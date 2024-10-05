"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Tables } from "@/lib/types/database.types";

type SoloRaidTeamSubmission = {
  seasonId: string;
  comment: string;
  gameVersionId: string;
  teams: Tables<"nikkes">[][];
};

export async function submitSoloRaidTeam(data: SoloRaidTeamSubmission) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { seasonId, comment, gameVersionId, teams } = data;

  if (
    teams.length === 0 ||
    teams.some((team) => team.length === 0 || team.some((nikke) => !nikke))
  ) {
    return {
      success: false,
      error:
        "All teams must have at least one Nikke and no Nikke can be null or undefined",
    };
  }

  try {
    const { data: teamData, error: teamError } = await supabase
      .from("solo_raid_teams")
      .insert({
        user_id: user.id,
        season_id: seasonId,
        comment,
        game_version_id: gameVersionId,
      })
      .select()
      .single();

    if (teamError) throw teamError;

    const teamNikkes = teams.flatMap((team, teamIndex) =>
      team.map((nikke, position) => ({
        team_id: teamData.id,
        nikke_id: nikke.id,
        team_number: teamIndex + 1,
        position: position + 1,
      }))
    );

    const { error: nikkesError } = await supabase
      .from("solo_raid_team_nikkes")
      .insert(teamNikkes);

    if (nikkesError) throw nikkesError;

    revalidatePath("/solo-raid");

    return { success: true, teamId: teamData.id };
  } catch (error) {
    console.error("Error submitting team:", error);
    return { success: false, error: "Failed to submit team" };
  }
}
