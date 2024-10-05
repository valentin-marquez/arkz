"use server";
import { createClient } from "@/lib/supabase/server";

export async function voteForTeam(teamId: string, voteType: "up" | "down") {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("User must be logged in to vote");
  }

  const { data: existingVote, error: checkError } = await supabase
    .from("votes")
    .select("id, vote")
    .eq("user_id", session.user.id)
    .eq("team_id", teamId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw checkError;
  }

  const voteValue = voteType === "up" ? 1 : -1;

  if (existingVote) {
    const { error: updateError } = await supabase
      .from("votes")
      .update({ vote: voteValue })
      .eq("id", existingVote.id);

    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase
      .from("votes")
      .insert({ user_id: session.user.id, team_id: teamId, vote: voteValue });

    if (insertError) throw insertError;
  }

  const { data: newTotalVotes, error: countError } = await supabase
    .from("teams_with_chapter_votes")
    .select("total_votes")
    .eq("team_id", teamId)
    .single();

  if (countError) throw countError;

  return newTotalVotes.total_votes;
}
