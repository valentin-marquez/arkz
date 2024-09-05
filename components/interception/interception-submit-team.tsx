"use client";
import React, { useEffect } from "react";
import { useCharacterStore } from "@/lib/store/character-store";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import { submitInterceptionTeam } from "@/app/(web)/interception/actions";
import GenericSubmitTeam from "@/components/base/generic-submit-team";
import CharacterCard from "@/components/character-card";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { InterceptionTeamSubmissionSchema } from "@/lib/types/zod";
import { Tables } from "@/lib/types/database.types";

interface InterceptionSubmitTeamProps {
  modeId: string;
  modeName: string;
  boss: Tables<"bosses">;
  versions: Tables<"game_versions">[];
  onClose: () => void;
}

export default function InterceptionSubmitTeam({
  modeId,
  modeName,
  boss,
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
        setCharacters(data as Tables<"nikkes">[]);
      }
    };

    fetchCharacters();
  }, [setCharacters, supabase]);

  const handleSubmit = async (
    teams: Tables<"nikkes">[][],
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

        const validatedData = InterceptionTeamSubmissionSchema.parse({
          userId: user.id,
          modeId,
          bossId: boss.id,
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
          teams[i] = [];
          toast({
            title: result.status,
            description: result.message,
          });
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: `Oops! There's an issue with your team data. Can you double-check and try again? 🕵️‍♀️`,
          variant: "destructive",
          action: (
            <ToastAction
              altText="Copy errors to clipboard"
              onClick={() => {
                navigator.clipboard.writeText(
                  error.errors.map((err) => err.message).join("\n")
                );
                toast({
                  title: "Copied to clipboard",
                  description: "The errors have been copied to your clipboard.",
                });
              }}
            />
          ),
        });
      } else if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
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
      renderCharacterCard={(character, onClick) => (
        <CharacterCard {...character} isLink={false} />
      )}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
