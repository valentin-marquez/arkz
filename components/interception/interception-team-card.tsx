"use client";
import React from "react";
import GenericTeamCard, {
  TeamCardProps,
} from "@/components/base/generic-team-card";
import { Badge } from "@/components/ui/badge";

interface InterceptionTeamCardProps
  extends Omit<TeamCardProps, "renderMetadata"> {
  bossName: string;
}

const InterceptionTeamCard: React.FC<InterceptionTeamCardProps> = ({
  bossName,
  ...props
}) => {
  const renderMetadata = (metadata: Record<string, string | number>) => (
    <div className="flex space-x-2">
      <Badge variant="secondary">{bossName}</Badge>
      {/* <Badge variant="outline">Lv. {bossLevel}</Badge> */}
    </div>
  );

  return <GenericTeamCard {...props} renderMetadata={renderMetadata} />;
};

export default InterceptionTeamCard;
