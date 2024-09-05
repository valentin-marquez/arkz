"use client";
import React from "react";
import { toast } from "sonner";
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

  const handleSubmit = async (
    teams: Tables<"nikkes">[][],
    comment: string,
    version: string
  ) => {
    if (!user) {
      toast.error("You must be logged in to submit a team");
      return;
    }

    console.log("Submitting team", teams, comment, version);

    try {
      const result = await submitSoloRaidTeam({
        seasonId,
        comment,
        gameVersionId: version,
        teams,
      });

      if (result.success) {
        toast.success("Team submitted successfully!");
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error submitting team:", error);
      toast.error("Failed to submit team. Please try again.");
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
