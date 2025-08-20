'use client';

import { useState } from "react";
import TeamHeader from "./TeamHeader";
import { TeamModal } from "./TeamPopup";
import { Team } from "@/types/Team";

export default function TeamListClient({ teams }: { teams: Team[] }) {
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    return (
        <>
            <div className="w-full max-w-2xl p-4 mx-auto">
                <main className="space-y-4">
                    {teams.map((team) => (
                        <TeamHeader
                            key={team.id}
                            team={team}
                            onClick={() => setSelectedTeam(team)}
                        />
                    ))}
                </main>
            </div>
            {selectedTeam && (<TeamModal
                team={selectedTeam}
                onClose={() => setSelectedTeam(null)}
            />)}
        </>
    );
}