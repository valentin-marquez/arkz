import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "./supabase";

// Utility type to make all properties non-nullable
type NonNullableProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// Simplified access to tables and views
export type SimplifiedDatabase = {
  [K in keyof DatabaseGenerated["public"]["Tables"]]: NonNullableProperties<
    DatabaseGenerated["public"]["Tables"][K]["Row"]
  >;
} & {
  [K in keyof DatabaseGenerated["public"]["Views"]]: NonNullableProperties<
    DatabaseGenerated["public"]["Views"][K]["Row"]
  >;
};

// Merge the simplified structure with the original
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: SimplifiedDatabase;
  }
>;

// Export the Json type from the generated types
export type { Json } from "./supabase";

// Helper type for easier access to tables and views
export type TableOrView = keyof SimplifiedDatabase;

// Helper type for accessing a specific table or view
export type Tables<T extends TableOrView> = SimplifiedDatabase[T];

export type TeamWithNikkesStory = Tables<"teams_with_chapter_votes"> & {
  nikkes: Tables<"team_nikke_details">[];
};

export type TeamWithNIkkesTribe = Tables<"tribe_tower_teams_detailed"> & {
  nikkes: Tables<"tribe_tower_team_nikke_details">[];
};

export type TeamWithNikkesInterception =
  Tables<"interception_teams_with_votes_and_boss"> & {
    nikkes: Tables<"interception_team_nikke_details">[];
  };

export type TeamWithNikkes =
  | TeamWithNikkesStory
  | TeamWithNIkkesTribe
  | TeamWithNikkesInterception;
