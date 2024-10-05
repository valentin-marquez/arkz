"use client";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import GenericSubmitTeam from "@/components/base/generic-submit-team";
import { Tables } from "@/lib/types/database.types";
import CharacterCard from "../character-card";
import { submitSoloRaidTeam } from "@/app/actions/solo-raid";

interface SoloRaidSubmitTeamProps {
  seasonId: string;
  boss: Tables<"bosses">;
  versions: Tables<"game_versions">[];
  onClose: () => void;
}

export default function SoloRaidSubmitTeam({
  seasonId,
  boss,
  versions,
  onClose,
}: SoloRaidSubmitTeamProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (
    teams: Tables<"nikkes">[][],
    comment: string,
    version: string
  ) => {
    if (!user) {
      toast({
        title: "You must be logged in to submit a team",
        description: "Please log in to submit a team.",
      });
      return;
    }

    if (teams.length === 0 || teams.some((team) => team.length === 0)) {
      toast({
        title: "All teams must have at least one Nikke",
        description: "Please add at least one Nikke to each team.",
      });
      return;
    }

    try {
      const result = await submitSoloRaidTeam({
        seasonId,
        comment,
        gameVersionId: version,
        teams,
      });

      if (result.success) {
        toast({
          title: "Team submitted successfully!",
          description: "Your team has been submitted successfully.",
        });
        onClose();
      } else {
        toast({
          title: "Failed to submit team",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting team:", error);
      toast({
        title: "Failed to submit team",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <GenericSubmitTeam
      numberOfTeams={5}
      versions={versions}
      renderCharacterCard={(character) => (
        <CharacterCard {...character} isLink={false} />
      )}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
