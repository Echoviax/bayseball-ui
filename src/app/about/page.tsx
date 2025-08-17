import React, { ReactNode } from 'react';

type InfoCardProps = {
    title: string;
    children: ReactNode;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => (
    <div className="w-full bg-[#364156]/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <div className="text-[#C5C3C6] space-y-4 leading-relaxed">
            {children}
        </div>
    </div>
);


export default function AboutPage() {
  return (
    <div className="max-w-3xl mt-24 mx-auto p-4 sm:p-6 text-[#DCDCDC]">
      <div className="flex flex-col items-center justify-center space-y-10">
        <div className="text-center">
            <h1 className="text-5xl font-bold text-white text-shadow-md">
                Bayseball
            </h1>
            <p className="mt-2 text-lg text-[#C5C3C6]">
                An automated fayke baseball simulation.
            </p>
        </div>

        <InfoCard title="What is Bayseball?">
            <p>
                Bayseball is an online baseball simulator, built to be as chaotic as Blaseball was, while hopefully staying a little more manageable. The game is comprised of 10 teams in a league and split into seasons. Between each season, users can vote on rule changes that will alter the game for seasons to come.
            </p>
        </InfoCard>

        <InfoCard title="Who are We?">
            <p>
                We're "solo" devs (plural) introduced to Blaseball right around the time MMOLB started in 2025. MMOLB led us to create EMMOLB, a third-party viewing client using the public API. Our love for baseball simulators eventually expanded into making our own, and now we're here.
            </p>
            <p className="text-right italic text-white/80 pt-2">
                - the Echo Cluster
            </p>
        </InfoCard>

        <InfoCard title="Special Thanks">
            <ul className="space-y-3 list-disc list-inside">
                <li>
                    <span className="font-semibold text-white">The Game Band</span> for developing Blaseball, the original chaotic baseball simulator.
                </li>
                <li>
                    <span className="font-semibold text-white">Danny</span> for developing MMOLB, the first baseball simulator we were able to catch live.
                </li>
                <li>
                    The <span className="font-semibold text-white">MMOLB community</span> for being so wonderful and supportive.
                </li>
                <li>
                    And of course, <span className="font-semibold text-white">our roommate</span>, who introduced us to the concept of Blaseball in the first place.
                </li>
            </ul>
        </InfoCard>
      </div>
    </div>
  );
}
