"use client";
import React, { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { signInWithDiscord } from "@/app/actions/auth";
import { usePathname } from "next/navigation";
import GenericSubmitTeamModal from "@/components/base/generic-submit-team-modal";
import StorySubmitTeam from "./story-submit-team";
import { Database, GameVersion } from "@/lib/types/database.types";

interface StorySubmitTeamModalProps {
  modeId: string;
  modeName: string;
  chapterId: string;
  numberOfTeams: number;
  allowCharacterRepeat: boolean;
  versions: GameVersion[];
}

export default function StorySubmitTeamModal({
  modeId,
  modeName,
  chapterId,
  numberOfTeams,
  allowCharacterRepeat,
  versions,
}: StorySubmitTeamModalProps) {
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
      modalDescription={`Submit your team for ${modeName} mode. You can submit up to ${numberOfTeams} teams.`}
      SubmitTeamComponent={StorySubmitTeam}
      submitTeamProps={{
        modeId,
        modeName,
        chapterId,
        numberOfTeams,
        versions,
        allowCharacterRepeat,
        onClose: handleClose,
      }}
      onSignIn={handleSignIn}
      isUserSignedIn={!!user}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
