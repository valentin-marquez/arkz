"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database } from "@/lib/types/database.types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import InterceptionTeamCard from "./interception-team-card";

type InterceptionTeam =
  Database["public"]["Tables"]["interception_teams_with_votes"]["Row"];
type GameVersion = Database["public"]["Tables"]["game_versions"]["Row"];

interface InterceptionTeamListProps {
  initialTeams: InterceptionTeam[];
  versions: GameVersion[];
}

export default function InterceptionTeamList({
  initialTeams,
  versions,
}: InterceptionTeamListProps) {
  const [teams, setTeams] = useState(initialTeams);
  const [filteredTeams, setFilteredTeams] = useState(initialTeams);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<string | "all">("all");

  useEffect(() => {
    const filtered = teams.filter(
      (team) =>
        (selectedVersion === "all" ||
          team.game_version_id === selectedVersion) &&
        team.nikkes.some((nikke) =>
          nikke.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredTeams(filtered);
  }, [teams, searchTerm, selectedVersion]);

  const handleVote = async (teamId: string) => {
    // TODO: Implement voting logic
    console.log("Voted for team:", teamId);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedVersion} onValueChange={setSelectedVersion}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by version" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Versions</SelectItem>
            {versions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.version}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        layout
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {filteredTeams.map((team) => (
          <InterceptionTeamCard
            key={team.team_id}
            team={team}
            onVote={handleVote}
            mode="interception"
          />
        ))}
      </motion.div>

      {filteredTeams.length === 0 && (
        <p className="text-center text-muted-foreground">
          No teams found. Try adjusting your filters.
        </p>
      )}
    </div>
  );
}
