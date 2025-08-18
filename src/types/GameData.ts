import { GameEvent } from "./GameEvent";

export type GameData = {
    home_team: any;
    away_team: any;
    game_id: string;
    events: GameEvent[];
};