'use client';
import GameDisplayPill from '@/components/GameDisplayPill';
import { usePolling } from '@/hooks/poll';
import { LOCAL_OVERRIDE } from '@/lib/config';
import { GameEvent } from '@/types/GameEvent';
import { Team } from '@/types/Team';
import React, { useEffect, useState, useCallback, useRef } from 'react';

type GameHistory = {
    home_team: Team;
    away_team: Team;
    events: GameEvent[];
};

const EventBlock = ({ event }: { event: GameEvent }) => (
    <div className="w-full bg-[#364156]/50 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg p-4 animate-fade-in">
        <div className="flex items-center mb-2">
            <span className="font-mono text-xs bg-gray-700/50 text-gray-300 rounded-full px-2 py-0.5">
                TICK {event.tick}
            </span>
        </div>
        <div className="text-[#DCDCDC] space-y-1">
            {event.message.map((msg: string, index: number) => (
                <p key={index}>{msg}</p>
            ))}
        </div>
    </div>
);

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
                {gameHistory.events.toReversed().map((event) => (
                    <EventBlock key={event.tick} event={event} />
                ))}
            </div>
        </div>
    );
}
