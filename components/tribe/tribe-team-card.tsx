"use client";
import React from "react";
import GenericTeamCard, {
  TeamCardProps,
} from "@/components/base/generic-team-card";
import { Badge } from "@/components/ui/badge";

interface TribeTowerTeamCardProps
  extends Omit<TeamCardProps, "renderMetadata"> {
  floor: number;
  towerName: string;
}

const TribeTowerTeamCard: React.FC<TribeTowerTeamCardProps> = ({
  floor,
  towerName,
  ...props
}) => {
  const renderMetadata = (metadata: Record<string, string | number>) => (
    <div className="flex space-x-2">
      <Badge variant="secondary">Floor {floor}</Badge>
      <Badge variant="outline" className="capitalize">
        {towerName}
      </Badge>
    </div>
  );

  return <GenericTeamCard {...props} renderMetadata={renderMetadata} />;
};

export default TribeTowerTeamCard;
