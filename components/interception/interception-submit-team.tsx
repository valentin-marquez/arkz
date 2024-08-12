"use client";
import React, { useEffect } from "react";
import { useCharacterStore } from "@/lib/store/character-store";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import { submitInterceptionTeam } from "@/app/interception/actions";
import GenericSubmitTeam from "@/components/base/generic-submit-team";
import CharacterCard from "@/components/character-card";
import { Database } from "@/lib/types/database.types";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { InterceptionTeamSubmissionSchema } from "@/lib/types/zod";

type Nikke = Database["nikkes"];
type Boss = Database["bosses"];

interface InterceptionSubmitTeamProps {
  modeId: string;
  modeName: string;
  bosses: Boss[];
  versions: Database["game_versions"][];
  onClose: () => void;
}

export default function InterceptionSubmitTeam({
  modeId,
  modeName,
  bosses,
  versions,
  onClose,
}: InterceptionSubmitTeamProps) {
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
    team: Nikke[],
    comment: string,
    gameVersionId: string,
    bossId: string
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
      const nikkes = team.map((nikke, index) => ({
        id: nikke.id,
        position: index + 1,
      }));

      const validatedData = InterceptionTeamSubmissionSchema.parse({
        userId: user.id,
        modeId,
        bossId,
        gameVersionId,
        comment,
        nikkes,
      });

      const result = await submitInterceptionTeam(validatedData);

      if (result.status === "error") {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      if (result.status === "success") {
        toast({
          title: "Success",
          description:
            "Your Interception team has been successfully submitted! Ready to take on the boss! 🎉👍",
        });
        onClose();
      }
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
      numberOfTeams={1}
      versions={versions}
      allowCharacterRepeat={false}
      characters={characters}
      renderCharacterCard={(character, onClick) => (
        <CharacterCard {...character} isLink={false} />
      )}
      getCharacterId={(character) => character.id}
      onSubmit={handleSubmit}
      onClose={onClose}
      bosses={bosses}
    />
  );
}
