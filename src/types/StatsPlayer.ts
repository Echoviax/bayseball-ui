import { Archetype } from "./Archetype";

export type StatsPlayer = {
    name: string;
    archetypes: Archetype[];
    position: string;
    ratings: {
        [key: string]: number
    }
}