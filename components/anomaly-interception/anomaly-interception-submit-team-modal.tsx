"use client";
import React, { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { signInWithDiscord } from "@/app/actions/auth";
import { usePathname } from "next/navigation";
import GenericSubmitTeamModal from "@/components/base/generic-submit-team-modal";
import AnomalyInterceptionSubmitTeam from "./anomaly-interception-submit-team";
import { Tables } from "@/lib/types/database.types";

interface AnomalyInterceptionSubmitTeamModalProps {
  modeId: string;
  modeName: string;
  boss: Tables<"bosses">;
  versions: Tables<"game_versions">[];
}

export default function AnomalyInterceptionSubmitTeamModal({
  modeId,
  modeName,
  boss,
  versions,
}: AnomalyInterceptionSubmitTeamModalProps) {
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
      modalTitle={`Submit Team for ${boss.name}`}
      modalDescription={`Submit you team for ${modeName} mode. Choose your team to take on ${boss.name}!`}
      SubmitTeamComponent={AnomalyInterceptionSubmitTeam}
      submitTeamProps={{
        modeId,
        modeName,
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
