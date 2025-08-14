import { getContrastTextColor } from "@/helpers/colors";
import { Team } from "@/types/Team";

export default function TeamHeader({ team }: { team: Team }) {
    return (
        <div className="max-w-2xl relative w-full h-20 px-6 py-4 rounded-2xl shadow-xl overflow-hidden mb-4 flex items-center" style={{background: `#${team.color}`, color: getContrastTextColor(team.color)}}>
            <div className="text-5xl">
                {team.emoji}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
                <span className="text-2xl font-bold tracking-wide leading-tight">{team.name}</span>
            </div>
            <div></div>
        </div>
    );
}