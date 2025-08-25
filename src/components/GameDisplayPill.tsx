'use client';

import { GameEvent } from "@/types/GameEvent";
import { Team } from "@/types/Team";
import { useState } from "react";

function TeamDisplay({ team, score }: { team: Team; score: number }) {
    return (
        <div className="relative flex flex-col items-center text-center bg-gray-800/70 rounded-lg pt-4 pb-2 w-24 overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: `#${team.color}` }} />
            <span className="text-2xl text-shadow-md">{team.emoji}</span>
            <span className="mt-1 text-[.7rem] font-bold uppercase tracking-wider w-20">{team.lite_name}</span>
            <span className="text-2xl font-bold">{score}</span>
        </div>
    );
}

function Base({ runner, color, position }: { runner: string; color: string; position: string; }) {
    return (
        <div className={`absolute group ${position}`}>
            <div className='w-8 h-8 bg-gray-400 transition-colors transform rotate-45 shadow-inner' style={{background: runner ? color : '#99A1Af', boxShadow: runner ? `0 0 8px ${color}` : 'none'}} />
            {runner && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {runner}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                </div>
            )}
        </div>
    );
}

export default function GameDisplayPill({ homeTeam, awayTeam, event, gameId=null, killLinks=false }: { homeTeam: Team; awayTeam: Team; event: GameEvent; gameId?: string|null; killLinks?: boolean; }) {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const battingColor = event.inning_side === 0 ? `#${awayTeam.color}` : `#${homeTeam.color}`

    const handleClick = () => {
        if (killLinks || !gameId) return;
        window.location.href = `/game/${gameId}`;
    };

    return (
        <div 
            className={`w-full max-w-4xl bg-[#364156]/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-4 transition-colors duration-300 ${(killLinks || !gameId) ? '' : 'cursor-pointer'}`}
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            style={{
                borderColor: isHovered ? battingColor : 'rgba(255, 255, 255, 0.1)'
            }}
        >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="sm:flex-1 flex justify-center sm:justify-start">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <TeamDisplay team={awayTeam} score={event.away_score} />
                        <div className="text-gray-400 text-sm font-semibold">VS</div>
                        <TeamDisplay team={homeTeam} score={event.home_score} />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex flex-col items-center text-center w-20">
                        <div className="text-sm font-semibold opacity-80">B-S</div>
                        <div className="text-2xl font-mono font-bold">{event.balls}-{event.strikes}</div>
                        <div className="text-xs font-bold mt-1 bg-red-500/50 text-white rounded-full w-12 text-center">{event.outs} OUT</div>
                    </div>

                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <Base runner={event.bases.first} color={battingColor} position="top-1/2 -translate-y-1/2 right-0" />
                        <Base runner={event.bases.second} color={battingColor} position="top-0 left-1/2 -translate-x-1/2" />
                        <Base runner={event.bases.third} color={battingColor} position="top-1/2 -translate-y-1/2 left-0" />
                    </div>
                
                    <div className="flex flex-col items-center text-center w-20">
                        <div className="h-[26px] flex items-end justify-center">
                            {event.event !== 'game_end' ? (
                                <div className="text-xs opacity-80 font-semibold">INNING</div>
                            ) : (
                                <span className="px-2 py-1 bg-red-500/50 text-white text-xs font-bold rounded-full leading-none">
                                    FINAL
                                </span>
                            )}
                        </div>

                        <div className="text-2xl font-bold flex items-center">
                            <span className="text-base mr-1.5">
                                {event.inning_side === 0 ? '▲' : '▼'}
                            </span>
                            {event.inning}
                        </div>
                    </div>
                </div>

                <div className="sm:flex-1 flex justify-center w-full">
                    <div className="text-sm text-left w-full sm:w-48 bg-gray-800/50 p-3 rounded-lg">
                        <div><span className="font-bold text-gray-400">P:</span> {event.pitcher}</div>
                        <div><span className="font-bold text-gray-400">B:</span> {event.batter}</div>
                        <div className="mt-1 pt-1 border-t border-white/10"><span className="font-bold text-gray-400">NB:</span> {event.next_up}</div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-center text-md text-gray-300">
                {event.message.join(" ")}
            </div>
        </div>
    );
}
