import TeamHeader from "@/components/TeamHeader";
import { Team } from "@/types/Team";

export default async function TeamsPage() {
    const teams = await fetch('/api/teams');
    if (!teams.ok) return (<div>Failed to fetch teams! (Is the server running?)</div>)

    const team_data: Team[] = await teams.json() as Team[]

    return (
        <div className="flex flex-col items-center-safe min-h-screen max-w-screen px-2 md:px-4 pt-24">
            {team_data.map((team: Team) => (
                <TeamHeader key={team.id} team={team}/>
            ))}
        </div>
    );
}