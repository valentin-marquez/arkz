import { z } from "zod";

export const StoryTeamSubmissionSchema = z.object({
  userId: z.string(),
  modeId: z.string(),
  chapterId: z.string(),
  gameVersionId: z.string(),
  comment: z.string().optional(),
  nikkes: z
    .array(
      z.object({
        id: z.string(),
        position: z.number().int().min(1).max(5),
      })
    )
    .length(5, "Each team must have exactly 5 Nikkes"),
});

export type StoryTeamSubmission = z.infer<typeof StoryTeamSubmissionSchema>;

export const TribeTowerTeamSubmissionSchema = z.object({
  userId: z.string(),
  towerId: z.string(),
  floor: z.number().int().positive(),
  gameVersionId: z.string(),
  comment: z.string().optional(),
  nikkes: z
    .array(
      z.object({
        id: z.string(),
        position: z.number().int().min(1).max(5),
      })
    )
    .length(5, "Each team must have exactly 5 Nikkes"),
});

export type TribeTowerTeamSubmission = z.infer<
  typeof TribeTowerTeamSubmissionSchema
>;

export interface TribeTower {
  id: string;
  name: string;
  manufacturer: string;
  max_floors: number;
  available_days: string[];
  is_always_available: boolean;
  reset_hour: string;
  reset_day: string | null;
}

export const InterceptionTeamSubmissionSchema = z.object({
  userId: z.string().uuid(),
  modeId: z.string().uuid(),
  bossId: z.string().uuid(),
  gameVersionId: z.string().uuid(),
  comment: z.string().optional(),
  nikkes: z
    .array(
      z.object({
        id: z.string().uuid(),
        position: z.number().int().min(1).max(5),
      })
    )
    .length(5),
});

export type InterceptionTeamSubmission = z.infer<
  typeof InterceptionTeamSubmissionSchema
>;
