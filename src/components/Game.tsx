'use client';
import { usePolling } from "@/hooks/poll";
import { useState, useCallback } from "react";
import GameDisplayPill from "./GameDisplayPill";
import { API_URL } from "@/lib/config";
import { GameData } from "@/types/GameData";

export default function Game({ initialGameData }: { initialGameData: GameData }) {
    const [gameData, setGameData] = useState<GameData>(initialGameData);
    const [latestTick, setLatestTick] = useState<number>(() => {
        const events = initialGameData.events;
        return events ? events[events.length - 1].tick : 0;
    });

    const fetchNewEvents = useCallback(async () => {
        const response = await fetch(`${API_URL}/api/game/${gameData.game_id}?after=${latestTick}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch events for game ${gameData.game_id}`);
        }
        return await response.json();
    }, [gameData.game_id, latestTick]);

    const handleNewData = useCallback((newData: { events: any[] }) => {
        if (newData.events && newData.events.length > 0) {
            setGameData(prevData => ({
                ...prevData,
                ...newData.events[newData.events.length - 1].data,
                events: [...prevData.events, ...newData.events],
            }));
            setLatestTick(newData.events[newData.events.length - 1].tick);
        }
    }, []);

    usePolling({
        pollFn: fetchNewEvents,
        onData: handleNewData,
        interval: 6000,
    });

    const latestEvent = gameData.events ? gameData.events[gameData.events.length - 1] : null;

    if (!latestEvent) {
        return <div>Loading game...</div>;
    }

    return (
        <GameDisplayPill
            homeTeam={gameData.home_team}
            awayTeam={gameData.away_team}
            gameId={gameData.game_id}
            event={latestEvent}
        />
    );
}