"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  TribeTowerTeamSubmissionSchema,
  TribeTowerTeamSubmission,
} from "@/lib/types/zod";
import { z } from "zod";

export async function submitTribeTowerTeam(
  submission: TribeTowerTeamSubmission
): Promise<{
  status: string;
  message: string;
  data?: { teamId: string };
}> {
  const supabase = createClient();

  try {
    // Validate the submission data
    TribeTowerTeamSubmissionSchema.parse(submission);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        status: "error",
        message:
          "Hold your Nikkes! You need to be logged in to save a team. Care to sign in real quick? 🔐",
      };
    }

    // Fetch the tower data to check the max floors
    const { data: towerData, error: towerError } = await supabase
      .from("tribe_towers")
      .select("max_floors, manufacturer")
      .eq("id", submission.towerId)
      .single();

    if (towerError || !towerData) {
      console.error("Error fetching tower data:", towerError);
      return {
        status: "error",
        message:
          "Oops! We couldn't find that tower. Are you sure it exists? 🤔",
      };
    }

    if (submission.floor > towerData.max_floors) {
      return {
        status: "error",
        message: `Whoa there, Commander! That floor doesn't exist in this tower. The highest floor is ${towerData.max_floors}. 🏗️`,
      };
    }

    const nikkeIds = submission.nikkes.map((nikke) => nikke.id);

    const { data: nikkeData, error: nikkeError } = await supabase
      .from("nikkes")
      .select("id, manufacturer")
      .in("id", nikkeIds);

    if (nikkeError) {
      console.error("Error fetching nikke data:", nikkeError);
      return {
        status: "error",
        message: "We had trouble verifying your Nikkes. Please try again. 🕵️‍♀️",
      };
    }

    const invalidNikkes = nikkeData.filter(
      (nikke) =>
        towerData.manufacturer !== "all" &&
        nikke.manufacturer !== towerData.manufacturer
    );

    if (invalidNikkes.length > 0) {
      return {
        status: "error",
        message: `Oops! Some of your Nikkes don't belong to this tower. Please check your team composition. 🚫`,
      };
    }

    const { data, error } = await supabase
      .rpc("submit_tribe_tower_team", {
        p_user_id: submission.userId,
        p_tower_id: submission.towerId,
        p_floor: submission.floor,
        p_game_version_id: submission.gameVersionId,
        p_comment: submission.comment || "",
        p_nikkes: submission.nikkes,
      })
      .single();

    if (error) {
      console.error("Error submitting tribe tower team:", error);
      return {
        status: "error",
        message:
          "Ouch! We hit a snag while saving your team. Our Nikke engineers are on it! Maybe give it another shot in a minute? 🔧",
      };
    }

    if (!data || !data.team_id) {
      return {
        status: "error",
        message:
          "Huh, that's odd. Your team was saved, but we lost track of its ID. Don't panic! It's there, you might just need to refresh to see it. 🔄",
      };
    }

    // Revalidate the tower page and the team list page
    revalidatePath(`/tribe/tower/${submission.towerId}`);
    revalidatePath("/tribe/teams");

    return {
      status: "success",
      message:
        "Fantastic work, Commander! Your Tribe Tower team is locked and loaded. They're ready to climb to new heights! 🎉🗼",
      data: { teamId: data.team_id },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: `Oops! There's an issue with your team data: ${error.errors[0].message}. Can you double-check and try again? 🕵️‍♀️`,
      };
    }
    return {
      status: "error",
      message: "An unexpected error occurred. Our Nikkes are investigating! 🚨",
    };
  }
}
