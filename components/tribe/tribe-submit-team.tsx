"use client";
import React, { useEffect } from "react";
import { useCharacterStore } from "@/lib/store/character-store";
import { useTeamStore } from "@/lib/store/team-store";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import { submitTribeTowerTeam } from "@/app/(web)/tribe/action";
import GenericSubmitTeam from "@/components/base/generic-submit-team";
import CharacterCard from "@/components/character-card";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { TribeTowerTeamSubmissionSchema } from "@/lib/types/zod";
import { Manufacturer } from "@/lib/types";
import { Tables } from "@/lib/types/database.types";

type Nikke = Tables<"nikkes">;

interface TribeTowerSubmitTeamProps {
  towerId: string;
  towerName: string;
  floor: number;
  versions: Tables<"game_versions">[];
  allowCharacterRepeat: boolean;
  onClose: () => void;
  manufacturer: string;
}

const stringToManufacturer = (value: string): Manufacturer | undefined => {
  const manufacturers: Manufacturer[] = [
    "Pilgrim",
    "Missilis",
    "Tetra",
    "Elysion",
    "Abnormal",
  ];
  return manufacturers.includes(value as Manufacturer)
    ? (value as Manufacturer)
    : undefined;
};

export default function TribeTowerSubmitTeam({
  towerId,
  towerName,
  floor,
  versions,
  allowCharacterRepeat,
  onClose,
  manufacturer,
}: TribeTowerSubmitTeamProps) {
  const { user } = useAuth();
  const supabase = createClient();
  const { characters, setCharacters, filteredCharacters, setManufacturer } =
    useCharacterStore();

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

  useEffect(() => {
    // Set the manufacturer filter in the store
    setManufacturer(
      manufacturer === "all" ? undefined : stringToManufacturer(manufacturer)
    );
  }, [manufacturer, setManufacturer]);

  const handleSubmit = async (
    teams: Nikke[][],
    comment: string,
    gameVersionId: string
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a team.",
        variant: "destructive",
      });
      return;
    }

    try {
      const nikkes = teams[0].map((nikke, index) => ({
        id: nikke.id,
        position: index + 1,
      }));

      const validatedData = TribeTowerTeamSubmissionSchema.parse({
        userId: user.id,
        towerId,
        floor,
        gameVersionId,
        comment,
        nikkes,
      });

      const result = await submitTribeTowerTeam(validatedData);

      if (result.status === "error") {
        toast({
          title: "Error",
          description:
            result.message || "Failed to submit team. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Team submitted successfully!",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: "Validation Error",
            description: err.message,
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
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
