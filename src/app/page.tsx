'use client';
import Game from "@/components/Game";
import { useEffect, useState } from "react";

type GameData = {
    home_team: any;
    away_team: any;
    game_id: string;
    events: any[];
};

export default function HomePage() {
    const [activeGames, setActiveGames] = useState<GameData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialGames = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/games');
                if (response.ok) {
                    const games = await response.json();
                    setActiveGames(games);
                }
            } catch (error) {
                console.error("Could not fetch initial game list:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialGames();
    }, []);

    if (isLoading) {
        return <div className="text-center mt-24 text-gray-400">Fetching live games...</div>;
    }

    return (
        <div className="mt-24 max-w-4xl flex flex-col items-center justify-center mx-auto gap-8">
            {activeGames.length > 0 ? (
                activeGames.map((game) => (
                    <Game key={game.game_id} initialGameData={game} />
                ))
            ) : (
                <p className="text-gray-400">No active games right now.</p>
            )}
        </div>
    );
}