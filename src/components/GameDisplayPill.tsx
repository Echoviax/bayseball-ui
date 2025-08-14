function DiamondIcon({bases = {first: false, second: false, third: false}}) {
    return (
        <div className="relative w-12 h-12">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="50,10 90,50 50,90 10,50" className="fill-current text-gray-200" />
                <polygon points="45,5 55,5 55,15 45,15" className="fill-current text-gray-400" transform="rotate(45 50 10)" /> {/* Home */}
                <polygon points="85,45 95,45 95,55 85,55" className={`fill-current transition-colors ${bases.first ? 'text-yellow-400' : 'text-gray-400'}`} transform="rotate(45 90 50)" /> {/* First */}
                <polygon points="45,85 55,85 55,95 45,95" className={`fill-current transition-colors ${bases.second ? 'text-yellow-400' : 'text-gray-400'}`} transform="rotate(45 50 90)" /> {/* Second */}
                <polygon points="5,45 15,45 15,55 5,55" className={`fill-current transition-colors ${bases.third ? 'text-yellow-400' : 'text-gray-400'}`} transform="rotate(45 10 50)" /> {/* Third */}
            </svg>
        </div>
    );
}

function TeamDisplay({ team, score }: {team: any; score: number}) {
    return (
        <div className="flex clex-col items-center text-center">
            <span className="text-2xl">{team.emoji}</span>
            <span className="mt-1 text-xs font-bold uppercase tracking-wider truncate w-20">{team.name}</span>
            <span className="text-2xl font-bold">{score}</span>
        </div>
    );
}

function Base({ baseName, runner, position }: {baseName: string; runner: string; position: string;}) {
    <div className={`absolute group ${position}`}>
        <div className={`w-3 h-3 bg-gray-400 rounded-sm transition-colors ${runner ? 'bg-yellow-400' : ''}`}>
            {runner && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {runner}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                </div>
            )}
        </div>
    </div>
}

export default function GameDisplayPill({homeTeam, awayTeam, event}: {homeTeam: any; awayTeam: any; event: any;}) {
    return (
        null
    );
}