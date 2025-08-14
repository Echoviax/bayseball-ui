'use client';
import GameDisplayPill from "@/components/GameDisplayPill";
import { act, useEffect, useState } from "react";

type CompressedGame = {
    home_team: any,
    game_id: string,
    away_team: any,
};

export default function HomePage() {
    const [activeGames, setActiveGames] = useState<CompressedGame[]>([]);
    
    const homeTeam = {
        name: "Meteorites",
        emoji: "☄️",
        color: '96D4C1'
    }

    const awayTeam = {
        name: "Engineers",
        emoji: "⚙️",
        color: '6176aa'
    }

    const event = {
        messages: ['Ball. 3-2'],
        data: {
            inning: 3,
            inning_side: 1,
            strikes: 2,
            balls: 3,
            batter: "Example Batter",
            pitcher: "Example Pitcher",
            next_up: "Example Batter",
            outs: 2,
            home_score: 2,
            away_score: 1,
            bases: {
                first: 'John',
                second: null,
                third: 'Someone else'
            }
        }
    }

    useEffect(() => {
        const fetchGames = async () => {
            const games = await fetch('http://localhost:8000/api/games');
            if (games.ok) setActiveGames(await games.json() as CompressedGame[])
        }
        fetchGames();
    }, [])

    return (
        <div className="mt-24 max-w-4xl flex justify-center mx-auto">
            {activeGames.map((game: CompressedGame) => (
                <div key={game.game_id}>{game.away_team.name} @ {game.home_team.name} Game_Id: {game.game_id}</div>
            ))}
            <GameDisplayPill homeTeam={homeTeam} awayTeam={awayTeam} event={event} />
        </div>
    );
}