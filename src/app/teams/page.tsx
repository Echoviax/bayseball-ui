import TeamListClient from "@/components/TeamListClient";
import { API_URL } from "@/lib/config";
import { Team } from "@/types/Team";

export default async function TeamsPage() {
    const res = await fetch(`${API_URL}/api/teams`);
    if (!res.ok) return (<div>Failed to fetch teams! (Is the server running?)</div>)

    const teams: Team[] = await res.json();

    return (
        <div className="flex flex-col items-center min-h-screen max-w-screen px-2 md:px-4 pt-24">
            <TeamListClient teams={teams} />
        </div>
    );
}