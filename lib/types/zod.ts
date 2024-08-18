import { z } from "zod";

export const StoryTeamSubmissionSchema = z.object({
  userId: z
    .string()
    .uuid(
      "Oops! That user ID looks as wonky as a Rapture's aim. Got a valid one?"
    ),
  modeId: z
    .string()
    .uuid("Hey Commander, that mode ID is MIA. Mind sending a proper one?"),
  chapterId: z
    .string()
    .uuid("Chapter ID's gone rogue! Bring it back to base, will ya?"),
  gameVersionId: z
    .string()
    .uuid("Game version's outdated! Time to patch up that ID!"),
  comment: z.string().optional(),
  nikkes: z
    .array(
      z.object({
        id: z
          .string()
          .uuid("Nikke ID's been scrambled! Unscramble it, pretty please?"),
        position: z
          .number()
          .int()
          .min(1, "Position's gotta be 1-5! Even Rams knows that!")
          .max(5, "Whoa there! We're not fielding an army. Keep it 1-5!"),
      })
    )
    .length(
      5,
      "Five Nikkes, no more, no less! It's not a party without the full squad!"
    ),
});

export type StoryTeamSubmission = z.infer<typeof StoryTeamSubmissionSchema>;

export const TribeTowerTeamSubmissionSchema = z.object({
  userId: z
    .string()
    .uuid("User ID's gone AWOL! Bring it back to base, Commander!"),
  towerId: z
    .string()
    .uuid("Tower ID's crumbling! Shore it up with a valid one!"),
  floor: z
    .number()
    .int()
    .positive("Negative floors? What is this, an underground bunker?"),
  gameVersionId: z
    .string()
    .uuid("Game version's glitching out! Reboot with a proper ID!"),
  comment: z.string().optional(),
  nikkes: z
    .array(
      z.object({
        id: z
          .string()
          .uuid(
            "This Nikke ID's as confused as a Pilgrim in a tech store. Fix it up!"
          ),
        position: z
          .number()
          .int()
          .min(1, "Positions start at 1, not 0! Even Auto knows that!")
          .max(
            5,
            "We're not trying to zerg rush here. Keep it to 5 positions!"
          ),
      })
    )
    .length(
      5,
      "Five Nikkes! Not four, not six. Five! It's like you've never seen a proper formation before!"
    ),
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
  userId: z
    .string()
    .uuid("This user ID's more elusive than Modernia. Got a real one?"),
  modeId: z.string().uuid("Mode ID's gone rogue! Bring it back to base, stat!"),
  bossId: z
    .string()
    .uuid("Boss ID's playing hide and seek. Find it, Commander!"),
  gameVersionId: z
    .string()
    .uuid("Game version's more outdated than Helm's fashion sense. Update it!"),
  comment: z.string().optional(),
  nikkes: z
    .array(
      z.object({
        id: z
          .string()
          .uuid(
            "This Nikke ID's as reliable as Rapi's gossip. Get a genuine one!"
          ),
        position: z
          .number()
          .int()
          .min(1, "Positions start at 1! Even a rookie knows that!")
          .max(5, "Five positions max! We're not trying to zerg rush here!"),
      })
    )
    .length(
      5,
      "Five Nikkes or bust! It's not rocket science... well, maybe it is for some Nikkes."
    ),
});

export type InterceptionTeamSubmission = z.infer<
  typeof InterceptionTeamSubmissionSchema
>;

export const nikkeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  rarity: z.enum(["SSR", "SR", "R"]),
  element: z.enum(["Water", "Iron", "Wind", "Fire", "Electric"]),
  weapon_type: z.enum(["AR", "MG", "RL", "SG", "SMG", "SR"]),
  burst: z.enum(["1", "2", "3", "p"]),
  manufacturer: z.enum(["Abnormal", "Elysion", "Missilis", "Pilgrim", "Tetra"]),
  icon_url: z.string().url("Invalid icon URL"),
  full_image_url: z.string().url("Invalid full image URL"),
});

export type NikkeFormData = z.infer<typeof nikkeSchema>;
