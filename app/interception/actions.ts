"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  InterceptionTeamSubmissionSchema,
  InterceptionTeamSubmission,
} from "@/lib/types/zod";
import { Tables } from "@/lib/types/supabase";

export async function getBosses(): Promise<{
  status: string;
  message?: string;
  data?: Tables<"bosses">[];
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bosses")
    .select("*")
    .eq("mode_type", "Interception");

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    data: data as Tables<"bosses">[],
  };
}

export async function submitInterceptionTeam(
  submission: InterceptionTeamSubmission
): Promise<{
  status: string;
  message: string;
  data?: { teamId: string };
}> {
  const supabase = createClient();

  console.log("Received submission data:", JSON.stringify(submission, null, 2));

  try {
    // Validate the submission data
    InterceptionTeamSubmissionSchema.parse(submission);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        status: "error",
        message:
          "Hold up! It seems you're not logged in. Mind signing in real quick so we can save your awesome team? 🔐",
      };
    }

    const { data, error } = await supabase
      .rpc("submit_interception_team", {
        p_user_id: submission.userId,
        p_mode_id: submission.modeId,
        p_boss_id: submission.bossId,
        p_game_version_id: submission.gameVersionId,
        p_comment: submission.comment ?? "",
        p_nikkes: submission.nikkes,
      })
      .single();

    console.log("submitInterceptionTeam", data, error);

    if (error) {
      console.error("Error submitting interception team:", error);
      return {
        status: "error",
        message:
          "Uh-oh! Something went wrong while saving your team. Our tech Nikkes are on it! Maybe try again in a bit? 🛠️",
      };
    }

    if (!data) {
      return {
        status: "error",
        message:
          "Hmm, that's strange. Your team was saved, but we couldn't get its ID. Don't worry, it's safe! You might just need to refresh. 🔄",
      };
    }

    // Revalidate the boss page and the team list page
    revalidatePath(`/interception/boss/${submission.bossId}`);
    revalidatePath("/interception/teams");

    return {
      status: "success",
      message:
        "Awesome job, Commander! Your Interception team has been successfully deployed. They're ready to take on the boss! 🎉👍",
      data: { teamId: data.team_id },
    };
  } catch (error) {
    console.error("Error submitting interception team:", error);
    if (error instanceof z.ZodError) {
      console.log("Zod error:", error.errors);
      return {
        status: "error",
        message: `Oops! There's an issue with your team data: ${error.name}. Can you double-check and try again? 🕵️‍♀️`,
      };
    }
    return {
      status: "error",
      message: "An unexpected error occurred. Our Nikkes are investigating! 🚨",
    };
  }
}
