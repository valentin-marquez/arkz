"use client";
import React, { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { signInWithDiscord } from "@/app/actions/auth";
import { usePathname } from "next/navigation";
import GenericSubmitTeamModal from "@/components/base/generic-submit-team-modal";
import SoloRaidSubmitTeam from "./solo-raid-submit-team";
import { Tables } from "@/lib/types/database.types";

interface SoloRaidSubmitTeamModalProps {
  seasonId: string;
  seasonName: string;
  boss: Tables<"bosses">;
  versions: Tables<"game_versions">[];
}

export default function SoloRaidSubmitTeamModal({
  seasonId,
  seasonName,
  boss,
  versions,
}: SoloRaidSubmitTeamModalProps) {
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
      modalTitle={`Submit a Team for ${seasonName}`}
      modalDescription="Share your team composition and strategy with the community."
      SubmitTeamComponent={SoloRaidSubmitTeam}
      submitTeamProps={{
        seasonId,
        boss,
        versions,
        onClose: handleClose,
      }}
      onSignIn={handleSignIn}
      isUserSignedIn={!!user}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
