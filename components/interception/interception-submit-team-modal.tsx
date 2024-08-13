"use client";
import React, { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { signInWithDiscord } from "@/app/actions/auth";
import { usePathname } from "next/navigation";
import GenericSubmitTeamModal from "@/components/base/generic-submit-team-modal";
import InterceptionSubmitTeam from "./interception-submit-team";
import { Database } from "@/lib/types/database.types";

type Boss = Database["bosses"];
type GameVersion = Database["game_versions"];

interface InterceptionSubmitTeamModalProps {
  modeId: string;
  modeName: string;
  bosses: Boss[];
  versions: GameVersion[];
}

export default function InterceptionSubmitTeamModal({
  modeId,
  modeName,
  bosses,
  versions,
}: InterceptionSubmitTeamModalProps) {
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
      modalTitle={`Submit Team for ${modeName}`}
      modalDescription={`Submit your team for ${modeName} mode. Choose your team to take on the boss!`}
      SubmitTeamComponent={InterceptionSubmitTeam}
      submitTeamProps={{
        modeId,
        modeName,
        bosses,
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
