"use client";
import React from "react";
import GenericTeamCard, {
  TeamCardProps,
} from "@/components/base/generic-team-card";
import { Badge } from "@/components/ui/badge";

interface AnomalyInterceptionTeamCardProps
  extends Omit<TeamCardProps, "renderMetadata"> {
  bossName: string;
}

const AnomalyInterceptionTeamCard: React.FC<
  AnomalyInterceptionTeamCardProps
> = ({ bossName, ...props }) => {
  const renderMetadata = (metadata: Record<string, string | number>) => (
    <div className="flex space-x-2">
      <Badge variant="secondary">{bossName}</Badge>
    </div>
  );

  return <GenericTeamCard {...props} renderMetadata={renderMetadata} />;
};

export default AnomalyInterceptionTeamCard;
