"use client";
import React, { useState } from "react";
import GenericTeamCard, {
  TeamCardProps,
} from "@/components/base/generic-team-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { m as motion, AnimatePresence } from "framer-motion";
import { TeamWithNikkesSoloRaid } from "@/lib/types/database.types";
import { getMediaURL } from "@/lib/supabase/utils";

interface SoloRaidTeamCardProps
  extends Omit<TeamCardProps, "renderMetadata" | "members"> {
  team: TeamWithNikkesSoloRaid;
}

const SoloRaidTeamCard: React.FC<SoloRaidTeamCardProps> = ({
  team,
  ...props
}) => {
  const [expandedTeams, setExpandedTeams] = useState(false);

  const toggleExpandedTeams = () => setExpandedTeams(!expandedTeams);

  const renderMetadata = () => (
    <div className="flex space-x-2">
      <Badge variant="secondary">{team.boss_name}</Badge>
      <Badge variant="outline">{team.nikkes.length} Nikkes</Badge>
    </div>
  );

  const renderExtraContent = () => (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full"
        onClick={toggleExpandedTeams}
      >
        {expandedTeams ? (
          <>
            <ChevronUp className="mr-2 h-4 w-4" />
            Hide Teams
          </>
        ) : (
          <>
            <ChevronDown className="mr-2 h-4 w-4" />
            Show All Teams
          </>
        )}
      </Button>

      <AnimatePresence>
        {expandedTeams && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="mt-4 border-t pt-4 px-4">
                <h3 className="text-lg font-semibold mb-2">Team {index + 1}</h3>
                <div className="flex flex-wrap gap-2">
                  {team.nikkes
                    .slice(index * 5, (index + 1) * 5)
                    .map((nikke) => (
                      <Avatar key={nikke.team_nikke_id} className="w-10 h-10">
                        <AvatarImage
                          src={getMediaURL(nikke.icon_url)}
                          alt={nikke.name}
                        />
                        <AvatarFallback>{nikke.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <GenericTeamCard
      {...props}
      members={team.nikkes.slice(0, 5)}
      renderMetadata={renderMetadata}
      renderExtraContent={renderExtraContent}
    />
  );
};

export default SoloRaidTeamCard;
