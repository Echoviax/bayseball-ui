'use client';
import GameDisplayPill from '@/components/GameDisplayPill';
import { usePolling } from '@/hooks/poll';
import { LOCAL_OVERRIDE } from '@/lib/config';
import { GameEvent } from '@/types/GameEvent';
import { Team } from '@/types/Team';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import EventBlock from './EventBlock';

type GameHistory = {
    home_team: Team;
    away_team: Team;
    events: GameEvent[];
};

type EventBlockGroup = {
    title: string;
    emoji: string;
    inning?: number;
    inning_side?: number;
    messages: string[];
    color: string;
};

function groupEventLog(eventLog: GameEvent[], awayTeam: Team, homeTeam: Team): EventBlockGroup[] {
    if (!eventLog || eventLog.length === 0) {
        return [];
    }

    const blocks: EventBlockGroup[] = [];
    let currentBlock: EventBlockGroup | null = null;

    for (const event of eventLog) {
        const joinedMessage = event.message.join(" ");
        const isNewBatterEvent = joinedMessage.includes("Now Batting:");
        const isEndOfInningEvent = joinedMessage.includes("End of the") || joinedMessage.includes("Middle of the");

        const isBreakEvent = isNewBatterEvent || isEndOfInningEvent;

        if (isBreakEvent) {
            if (currentBlock) {
                blocks.push(currentBlock);
            }

            if (isNewBatterEvent) {
                const match = joinedMessage.match(/Now Batting: (.*)/);
                const batterName = match ? match[1].replace(/\.$/, '') : "At Bat";
                const battingTeam = event.inning_side === 0 ? awayTeam : homeTeam;
                
                currentBlock = {
                    title: batterName,
                    emoji: battingTeam.emoji,
                    inning: event.inning,
                    inning_side: event.inning_side,
                    messages: [...event.message],
                    color: battingTeam.color,
                };
            } else { // Default to end of inning
                currentBlock = {
                    title: "Game Info",
                    emoji: 'ℹ️',
                    messages: [...event.message],
                    color: '888888',
                };
            }
        } else if (currentBlock) {
            currentBlock.messages.push(...event.message);
        } else {
            const lastBlock = blocks[blocks.length - 1];
            if (lastBlock?.title === "Game Start") {
                lastBlock.messages.push(...event.message);
            } else {
                blocks.push({
                    title: "Game Start",
                    emoji: '⚾',
                    messages: [...event.message],
                    color: '888888',
                });
            }
        }
    }

    // Add the very last block to the list.
    if (currentBlock) {
        blocks.push(currentBlock);
    }

    return blocks.reverse();
}


export default function GamePage({ gameId }: { gameId: string; }) {
    const [gameHistory, setGameHistory] = useState<GameHistory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!gameId) return;
        const fetchGameHistory = async () => {
            try {
                const response = await fetch(`${LOCAL_OVERRIDE}/api/game/${gameId}`);
                if (!response.ok) throw new Error(`Failed to fetch game data. Status: ${response.status}`);
                const data = await response.json();
                setGameHistory(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchGameHistory();
    }, [gameId]);

    const latestTick = gameHistory?.events?.[gameHistory.events.length - 1]?.tick ?? 0;

    const fetchNewEvents = useCallback(async () => {
        if (!gameId) return { events: [] };
        const response = await fetch(`${LOCAL_OVERRIDE}/api/game/${gameId}?after=${latestTick}`);
        if (!response.ok) throw new Error('Failed to poll for new events');
        return await response.json();
    }, [gameId, latestTick]);

    const handleNewData = useCallback((newData: { events: GameEvent[] }) => {
        if (newData.events && newData.events.length > 0) {
            setGameHistory(prevHistory => {
                if (!prevHistory) return null;
                return {
                    ...prevHistory,
                    events: [...prevHistory.events, ...newData.events]
                };
            });
        }
    }, []);

    usePolling({
        pollFn: fetchNewEvents,
        onData: handleNewData,
        interval: 6000,
        enabled: !isLoading && !error,
    });
    
    const groupedEvents = useMemo(() => {
        if (!gameHistory) return [];
        return groupEventLog(gameHistory.events, gameHistory.away_team, gameHistory.home_team);
    }, [gameHistory]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400"><p>Loading game history...</p></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-400"><p>Error: {error}</p></div>;
    if (!gameHistory) return <div className="min-h-screen flex items-center justify-center text-gray-400"><p>Game not found.</p></div>;

    const latestEventData = gameHistory.events?.[gameHistory.events.length - 1];

    return (
        <div className="max-w-4xl mt-24 mx-auto p-4 sm:p-6">
            {latestEventData && (
                <GameDisplayPill 
                    homeTeam={gameHistory.home_team} 
                    awayTeam={gameHistory.away_team} 
                    event={latestEventData} 
                    killLinks={true}
                />
            )}
            <div className="mt-12 w-full max-w-4xl flex flex-col items-center justify-center space-y-4">
                {groupedEvents.map((group, index) => (
                    <EventBlock 
                        color={group.color}
                        key={index} 
                        emoji={group.emoji}
                        messages={group.messages}
                        title={group.title}
                        inning={group.inning}
                        inning_side={group.inning_side}
                    />
                ))}
            </div>
        </div>
    );
}