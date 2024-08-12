import React from "react";
import GenericTeamCard, {
  TeamCardProps,
} from "@/components/base/generic-team-card";
import { Badge } from "@/components/ui/badge";

interface ChapterTeamCardProps extends Omit<TeamCardProps, "renderMetadata"> {
  chapterNumber: number;
  difficulty: string;
}

const ChapterTeamCard: React.FC<ChapterTeamCardProps> = ({
  chapterNumber,
  difficulty,
  ...props
}) => {
  const renderMetadata = (metadata: Record<string, string | number>) => (
    <div className="flex space-x-2">
      <Badge variant="secondary">Ch. {chapterNumber}</Badge>
      <Badge variant="outline" className="capitalize">
        {difficulty}
      </Badge>
    </div>
  );

  return <GenericTeamCard {...props} renderMetadata={renderMetadata} />;
};

export default ChapterTeamCard;
