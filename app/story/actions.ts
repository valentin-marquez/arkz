"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/lib/types/database.types";
import { z } from "zod";
import {
  StoryTeamSubmissionSchema,
  StoryTeamSubmission,
} from "@/lib/types/zod";

export async function getChapters(): Promise<{
  status: string;
  message?: string;
  data?: Database["chapters"][];
}> {
  const supabase = createClient();

  const { data, error }: Database = await supabase.from("chapters").select("*");

  if (error) {
    return { status: "error", message: error.message };
  }

  return { status: "success", data: data };
}

export async function submitStoryTeam(
  submission: StoryTeamSubmission
): Promise<{
  status: string;
  message: string;
  data?: { teamId: string };
}> {
  const supabase = createClient();

  try {
    // Validate the submission data
    StoryTeamSubmissionSchema.parse(submission);

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

    const { data, error } = await supabase.rpc("submit_story_team", {
      p_user_id: submission.userId,
      p_mode_id: submission.modeId,
      p_chapter_id: submission.chapterId,
      p_game_version_id: submission.gameVersionId,
      p_comment: submission.comment,
      p_nikkes: submission.nikkes,
    });

    if (error) {
      console.error("Error submitting story team:", error);
      return {
        status: "error",
        message:
          "Uh-oh! Something went wrong while saving your team. Our tech Nikkes are on it! Maybe try again in a bit? 🛠️",
      };
    }

    if (!data || !data.team_id) {
      return {
        status: "error",
        message:
          "Hmm, that's strange. Your team was saved, but we couldn't get its ID. Don't worry, it's safe! You might just need to refresh. 🔄",
      };
    }

    // Revalidate the chapter page and the team list page
    revalidatePath(`/story/chapter/${submission.chapterId}`);
    revalidatePath("/story/teams");

    return {
      status: "success",
      message:
        "Awesome job, Commander! Your story team has been successfully deployed. They're ready to take on any challenge! 🎉👍",
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
