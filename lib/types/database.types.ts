import type { Database as DatabaseType } from "./supabase";

export type Database = {
  [P in keyof DatabaseType["public"]["Tables"]]: DatabaseType["public"]["Tables"][P]["Row"];
} & {
  [P in keyof DatabaseType["public"]["Views"]]: DatabaseType["public"]["Views"][P]["Row"];
};

type RemoveNullOn<T, O extends keyof T = never> = {
  [P in keyof T]: P extends O ? Exclude<T[P], null> : T[P];
};
type RemoveNullExcept<T, E extends keyof T = never> = {
  [P in keyof T]: P extends E ? T[P] : Exclude<T[P], null>;
};

export type teams_with_chapter_votes = RemoveNullExcept<
  Database["teams_with_chapter_votes"],
  "comment"
>;

export type team_nikke_details = RemoveNullExcept<
  Database["team_nikke_details"]
>;

export type teams_with_votes = RemoveNullExcept<Database["teams_with_votes"]>;

export type tribe_tower_teams_with_votes = RemoveNullExcept<
  Database["tribe_tower_teams_with_votes"],
  "comment"
>;

export type TeamWithNikkes = teams_with_chapter_votes & {
  nikkes: team_nikke_details[];
};

export type GameVersion = RemoveNullExcept<Database["game_versions"]>;
