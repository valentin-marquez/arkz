"use client";
import React, { useEffect } from "react";
import { useCharacterStore } from "@/lib/store/character-store";
import { useTeamStore } from "@/lib/store/team-store";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import { submitStoryTeam } from "@/app/(web)/story/actions";
import GenericSubmitTeam from "@/components/base/generic-submit-team";
import CharacterCard from "@/components/character-card";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { StoryTeamSubmissionSchema } from "@/lib/types/zod";
import { Tables } from "@/lib/types/database.types";

type Nikke = Tables<"nikkes">;

interface StorySubmitTeamProps {
  modeId: string;
  modeName: string;
  chapterId: string;
  numberOfTeams: number;
  versions: Tables<"game_versions">[];
  allowCharacterRepeat: boolean;
  onClose: () => void;
}

export default function StorySubmitTeam({
  modeId,
  modeName,
  chapterId,
  numberOfTeams,
  versions,
  allowCharacterRepeat,
  onClose,
}: StorySubmitTeamProps) {
  const { user } = useAuth();
  const supabase = createClient();
  const { characters, setCharacters } = useCharacterStore();

  useEffect(() => {
    const fetchCharacters = async () => {
      const { data, error } = await supabase.from("nikkes").select("*");
      if (error) {
        console.error("Error fetching characters:", error);
        toast({
          title: "Error",
          description: "Failed to load characters. Please try again.",
          variant: "destructive",
        });
      } else {
        setCharacters(data as Nikke[]);
      }
    };

    fetchCharacters();
  }, [setCharacters, supabase]);

  const handleSubmit = async (
    teams: Nikke[][],
    comment: string,
    gameVersionId: string
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to submit a team.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (let i = 0; i < teams.length; i++) {
        const nikkes = teams[i].map((nikke, index) => ({
          id: nikke.id,
          position: index + 1,
        }));

        const validatedData = StoryTeamSubmissionSchema.parse({
          userId: user.id,
          modeId,
          chapterId,
          gameVersionId,
          comment,
          nikkes,
        });

        const result = await submitStoryTeam(validatedData);

        if (result.status === "error") {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
          return;
        }

        if (result.status === "success") {
          teams[i] = [];
        }
      }

      toast({
        title: "Success",
        description:
          "Awesome job, Commander! Your story team has been successfully deployed. They're ready to take on any challenge! 🎉👍",
      });
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: "Validation Error",
            description: `Oops! There's an issue with your team data: ${err.message}. Can you double-check and try again? 🕵️‍♀️`,
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "Error",
          description:
            "An unexpected error occurred. Our Nikkes are investigating! 🚨",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <GenericSubmitTeam
      numberOfTeams={numberOfTeams}
      versions={versions}
      allowCharacterRepeat={allowCharacterRepeat}
      characters={characters}
      renderCharacterCard={(character, onClick) => (
        <CharacterCard {...character} isLink={false} />
      )}
      getCharacterId={(character) => character.id}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
