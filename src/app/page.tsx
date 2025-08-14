'use client';
import { act, useEffect, useState } from "react";

type CompressedGame = {
    home_team: any,
    game_id: string,
    away_team: any,
};

export default function HomePage() {
    const [activeGames, setActiveGames] = useState<CompressedGame[]>([]);
    
    useEffect(() => {
        const fetchGames = async () => {
            const games = await fetch('http://localhost:8000/api/games');
            if (games.ok) setActiveGames(await games.json() as CompressedGame[])
        }
        fetchGames();
    }, [])

    return (
        <div>
            {activeGames.map((game: CompressedGame) => (
                <div key={game.game_id}>{game.away_team.name} @ {game.home_team.name} Game_Id: {game.game_id}</div>
            ))}
        </div>
    );
}