import { getContrastTextColor } from "@/helpers/colors";
import { Team } from "@/types/Team";

export default function TeamHeader({ team }: { team: Team }) {
    return (
        <div className="max-w-2xl relative w-full h-20 px-6 py-4 rounded-2xl shadow-xl overflow-hidden mb-4 flex items-center pointer-events-none select-none" style={{background: `#${team.color}`, color: getContrastTextColor(team.color)}}>
            <div className="text-5xl text-shadow-lg">
                {team.emoji}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
                <span className="text-2xl font-bold tracking-wide leading-tight">{team.name}</span>
                <span className="text-md font-semibold tracking-wide leading-tight italic opacity-70">"{team.motto}"</span>
            </div>
            <div></div>
        </div>
    );
}