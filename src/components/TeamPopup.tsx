'use client';

import { getContrastTextColor } from "@/helpers/colors";
import { LOCAL_OVERRIDE } from "@/lib/config";
import { Archetype } from "@/types/Archetype";
import { StatsPlayer } from "@/types/StatsPlayer";
import { Team } from "@/types/Team";
import { useEffect, useId, useRef, useState } from "react";

const SORT_ORDER = ["C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH", "SP1", "SP2", "SP3", "SP4", "SP5", "RP1", "RP2", "RP3", "CL"];

const fetchPlayersByTeam = async (teamId: string): Promise<{[key: string]: StatsPlayer}> => {
    const res = await fetch(`${LOCAL_OVERRIDE}/api/players-by-team/${teamId}`)
    return await res.json();
};

const Star = ({ fillPercentage }: { fillPercentage: number }) => {
    const clipId = `star-clip-${useId()}`;
    return (
        <svg width="20" height="20" viewBox="0 0 20 20">
            <defs>
                <clipPath id={clipId}>
                    <rect x="0" y="0" width={`${fillPercentage * 100}%`} height="100%" />
                </clipPath>
            </defs>
            <path d="M10 1 L12.94 6.53 L19.2 7.29 L14.6 11.21 L15.88 17.42 L10 14.27 L4.12 17.42 L5.4 11.21 L0.8 7.29 L7.06 6.53 Z" fill="#FBBF24" clipPath={`url(#${clipId})`} />
        </svg>
    );
};

const StarRating = ({ rating }: { rating: number; }) => {
    return (
        <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-300 w-8 text-right">{rating.toFixed(1)}</span>
            <div className="flex">
                {[...Array(5)].map((_, i) => {
                    const fill = Math.min(1, Math.max(0, rating - i));
                    return <Star key={i} fillPercentage={fill} />;
                })}
            </div>
        </div>
    );
};

const ArchetypePill = ({ archetype }: { archetype: Archetype; }) => (
    <div className="relative group">
        <div className="flex flex-col items-center p-2 border border-white/20 bg-gray-900/60 rounded-lg cursor-pointer transition-transform transform group-hover:scale-105">
            <span className="text-3xl">{archetype.emoji}</span>
            <span className="mt-1 text-xs font-semibold text-gray-400">{archetype.name}</span>
        </div>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-white text-center rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            <p className="font-bold">{archetype.name}</p>
            <p className="text-gray-300">{archetype.description}</p>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black"></div>
        </div>
    </div>
);

const PlayerDropdown = ({ playerData }: { playerData: StatsPlayer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5 transition-colors">
                <div className="flex">
                    <div className="font-Semibold text-lg text-white opacity-70 w-12">{playerData.position}</div>
                    <span className="font-semibold text-lg text-white">{playerData.name}</span>
                </div>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="p-4 bg-black/20">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        {playerData.archetypes.map((arch: Archetype, index: number) => (
                            <ArchetypePill key={index} archetype={arch} />
                        ))}
                    </div>
                    <div className="space-y-2">
                        {Object.entries(playerData.ratings).map(([category, rating]) => (
                            <div key={category} className="flex justify-between items-center bg-gray-900/40 p-2 rounded-md">
                                <span className="font-medium text-gray-300">{category}</span>
                                <StarRating rating={rating as number} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const TeamModal = ({ team, onClose }: { team: Team; onClose: () => void; }) => {
    const [players, setPlayers] = useState<StatsPlayer[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const modalRef = useRef(null);

    useEffect(() => {
        if (team) {
            setIsLoading(true);
            fetchPlayersByTeam(team.id).then((playerStats: {[key: string]: StatsPlayer}) => {
                const playersArray = Object.values(playerStats);

                const sorted = playersArray.sort((a, b) => 
                    SORT_ORDER.indexOf(a.position) - SORT_ORDER.indexOf(b.position)
                );
                
                setPlayers(sorted);
                setIsLoading(false);
            });
        }
    }, [team]);
  
    const handleBackdropClick = (e: any) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    if (!team) return null;

    return (
        <div ref={modalRef} onClick={handleBackdropClick} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#364156]/80 backdrop-blur-lg border border-white/10 text-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="relative w-full p-4 flex items-center justify-between" style={{ background: `#${team.color}`, color: getContrastTextColor(team.color) }}>
                    <div className="text-5xl">{team.emoji}</div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2 pointer-events-none">
                        <span className="text-2xl font-bold tracking-wide">{team.name}</span>
                        <span className="text-md font-semibold tracking-wide italic opacity-80">"{team.motto}"</span>
                    </div>
                        <button onClick={onClose} className="text-3xl z-10 hover:opacity-75 transition-opacity" style={{color: getContrastTextColor(team.color)}}>&times;</button>
                </div>

                <div className="overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 text-center">Loading Players...</div>
                        ) : (
                        <div>
                            {players && Object.entries(players).map(([playerId, playerData]) => (
                                <PlayerDropdown key={playerId} playerData={playerData as StatsPlayer} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};