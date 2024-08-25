"use server";

import { Tables } from "@/lib/types/database.types";
import { createClient } from "@/lib/supabase/server";

export async function fetchTribeTowerData(
  manufacturer: string,
  floor: number
): Promise<{
  tower: Tables<"tribe_towers">;
  teams: any[];
  versions: Tables<"game_versions">[];
  floor: number;
  userLikes: string[];
}> {
  const supabase = createClient();

  const { data: towerData, error: towerError } = await supabase
    .from("tribe_towers")
    .select("*")
    .eq("manufacturer", manufacturer)
    .single();

  if (towerError) throw towerError;

  const { data: teamsWithDetails, error: teamsError } = await supabase
    .from("tribe_tower_teams_detailed")
    .select("*")
    .eq("tower_manufacturer", manufacturer)
    .eq("floor", floor);

  if (teamsError) throw teamsError;

  const teamsWithNikkes = await Promise.all(
    (teamsWithDetails || []).map(async (team) => {
      if (!team.team_id) return team;
      const { data: nikkes, error: nikkesError } = await supabase
        .from("tribe_tower_team_nikke_details")
        .select("*, nikkes(*)")
        .eq("team_id", team.team_id);

      if (nikkesError) throw nikkesError;

      return { ...team, nikkes: nikkes || [] };
    })
  );

  const { data: versions, error: versionsError } = await supabase
    .from("game_versions")
    .select("*")
    .order("release_date", { ascending: false });

  if (versionsError) throw versionsError;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userLikes: string[] = [];
  if (user) {
    const { data: likes, error: likesError } = await supabase
      .from("user_likes")
      .select("team_id")
      .eq("user_id", user.id);

    if (likesError) throw likesError;
    userLikes = likes.map((like) => like.team_id);
  }

  return {
    tower: towerData as Tables<"tribe_towers">,
    teams: teamsWithNikkes,
    versions: versions as Tables<"game_versions">[],
    floor: floor,
    userLikes,
  };
}
