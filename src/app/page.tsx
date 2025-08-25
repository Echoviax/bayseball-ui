'use client';
import Game from "@/components/Game";
import { LOCAL_OVERRIDE } from "@/lib/config";
import { GameData } from "@/types/GameData";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [activeGames, setActiveGames] = useState<GameData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [season, setSeason] = useState<number | null>(null);
    const [day, setDay] = useState<number | null>(null);

    useEffect(() => {
        const fetchInitialGames = async () => {
            try {
                const response = await fetch(`${LOCAL_OVERRIDE}/api/games`);
                if (response.ok) {
                    const games = await response.json();
                    setActiveGames(games);
                    if (games.length > 0) {
                        setSeason(games[0].season);
                        setDay(games[0].day);
                    } else {
                        setSeason(0);
                        setDay(1);
                    }
                }
            } catch (error) {
                console.error("Could not fetch initial game list:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialGames();
    }, []);

    useEffect(() => {
        if (day === null || season === null)
            return;

        const fetchGamesForDay = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${LOCAL_OVERRIDE}/api/games?season=${season}&day=${day}`);
                if (response.ok) {
                    const games = await response.json();
                    setActiveGames(games);
                } else {
                    setActiveGames([]);
                }
            } catch (error) {
                console.error(`Could not fetch games for day ${day}:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGamesForDay();
    }, [day, season]);

    const handlePreviousDay = () => {
        if (day && day > 1)
            setDay(day - 1);
    };

    const handleNextDay = () => {
        if (day !== null)
            setDay(day + 1);
    };

    return (
        <div className="max-w-4xl flex flex-col justify-center mx-auto gap-8">
            <div className="flex justify-between items-center bg-gray-800/70 backdrop-blur-lg p-4 rounded-lg sticky top-0 pt-24 z-10">
                <button onClick={handlePreviousDay} disabled={isLoading || day === 1} className="px-4 py-2 bg-[#364156] rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    &lt; Prev Day
                </button>
                <h2 className="text-xl font-bold text-white">
                    {season !== null ? `Season ${season}, Day ${day}` : 'Loading...'}
                </h2>
                <button onClick={handleNextDay} disabled={isLoading} className="px-4 py-2 bg-[#364156] rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    Next Day &gt;
                </button>
            </div>

            {isLoading ? (
                <div className="text-center text-gray-400">Fetching games...</div>
            ) : activeGames.length > 0 ? (
                activeGames.map((game) => (
                    <Game key={game.game_id} initialGameData={game} />
                ))
            ) : (
                <p className="text-center text-gray-400">No games found for this day.</p>
            )}
        </div>
    );
}