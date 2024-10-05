"use client";
import React, { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { signInWithDiscord } from "@/app/actions/auth";
import { usePathname } from "next/navigation";
import GenericSubmitTeamModal from "@/components/base/generic-submit-team-modal";
import TribeTowerSubmitTeam from "./tribe-submit-team";
import { Tables } from "@/lib/types/database.types";

interface TribeTowerSubmitTeamModalProps {
  towerId: string;
  towerName: string;
  floor: number;
  allowCharacterRepeat: boolean;
  versions: Tables<"game_versions">[];
  manufacturer: string;
}

export default function TribeTowerSubmitTeamModal({
  towerId,
  towerName,
  floor,
  allowCharacterRepeat,
  versions,
  manufacturer,
}: TribeTowerSubmitTeamModalProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignIn = async () => {
    await signInWithDiscord({
      pathname: pathname,
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <GenericSubmitTeamModal
      modalTitle={`Submit Team for ${towerName}`}
      modalDescription={`Submit your team for ${towerName} floor ${floor}.`}
      SubmitTeamComponent={TribeTowerSubmitTeam}
      submitTeamProps={{
        towerId,
        towerName,
        floor,
        versions,
        allowCharacterRepeat,
        onClose: handleClose,
        manufacturer,
      }}
      onSignIn={handleSignIn}
      isUserSignedIn={!!user}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
