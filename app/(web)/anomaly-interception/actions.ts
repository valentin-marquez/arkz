"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  AnomalyInterceptionTeamSubmissionSchema,
  AnomalyInterceptionTeamSubmission,
} from "@/lib/types/zod";
import { Tables } from "@/lib/types/supabase";

export async function getAnomalyInterceptionBosses(): Promise<{
  status: string;
  message?: string;
  data?: Tables<"bosses">[];
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bosses")
    .select("*")
    .eq("mode_type", "Anomaly Interception");

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    data: data as Tables<"bosses">[],
  };
}

export async function submitAnomalyInterceptionTeam(
  submission: AnomalyInterceptionTeamSubmission
): Promise<{
  status: string;
  message: string;
  data?: { teamId: string };
}> {
  const supabase = createClient();

  try {
    console.log("Validating submission data:", submission);
    AnomalyInterceptionTeamSubmissionSchema.parse(submission);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        status: "error",
        message: "User not authenticated",
      };
    }

    console.log("Calling RPC with data:", {
      p_user_id: submission.userId,
      p_mode_id: submission.modeId,
      p_boss_id: submission.bossId,
      p_game_version_id: submission.gameVersionId,
      p_comment: submission.comment ?? "",
      p_nikkes: submission.nikkes,
    });

    const { data, error } = await supabase
      .rpc("submit_anomaly_interception_team", {
        p_user_id: submission.userId,
        p_mode_id: submission.modeId,
        p_boss_id: submission.bossId,
        p_game_version_id: submission.gameVersionId,
        p_comment: submission.comment ?? "",
        p_nikkes: submission.nikkes,
      })
      .single();

    if (error) {
      console.error("Error submitting anomaly interception team:", error);
      return {
        status: "error",
        message: `Error submitting team: ${error.message}`,
      };
    }

    if (!data) {
      return {
        status: "error",
        message: "No data returned from RPC call",
      };
    }

    console.log("Team submitted successfully:", data);

    revalidatePath(`/anomaly-interception/boss/${submission.bossId}`);
    revalidatePath("/anomaly-interception/teams");

    return {
      status: "success",
      message: "Team submitted successfully",
      data: { teamId: data.team_id },
    };
  } catch (error) {
    console.error("Error in submitAnomalyInterceptionTeam:", error);
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: `Validation error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }
    return {
      status: "error",
      message: `Unexpected error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
