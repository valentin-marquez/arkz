"use client";
import React from "react";
import GenericTeamList from "../base/generic-team-list";
import TribeTowerTeamCard from "./tribe-team-card";
import { Database } from "@/lib/types/database.types";
import type { TeamWithNikkes } from "@/lib/types/database.types";

interface TribeTowerTeamListProps {
  initialTeams: TeamWithNikkes[];
  versions: Database["game_versions"][];
}

const TribeTowerTeamList: React.FC<TribeTowerTeamListProps> = ({
  initialTeams,
  versions,
}) => {
  const renderTeamCard = (
    team: TeamWithNikkes,
    onVote: (teamId: string, voteType: "up" | "down") => void
  ) => (
    <TribeTowerTeamCard
      id={team.team_id}
      user={{ username: team.username, avatarUrl: team.avatar_url }}
      members={team.nikkes.map((nikke) => ({
        id: nikke.nikke_id,
        position: nikke.position,
        ...nikke.nikkes,
      }))}
      totalVotes={team.total_votes}
      comment={team.comment || ""}
      floor={team.floor}
      towerName={team.tower_name}
      metadata={{ gameVersionId: team.game_version_id }}
      onVote={onVote}
      mode="tribe_tower"
    />
  );

  const getTeamId = (team: TeamWithNikkes) => team.team_id;
  const getTeamMembers = (team: TeamWithNikkes) => team.nikkes;

  const filterTeams = (teams: TeamWithNikkes[], filters: any) => {
    return teams.filter(
      (team) =>
        (filters.selectedVersion === "all" ||
          team.game_version_id === filters.selectedVersion) &&
        (!filters.searchTerm ||
          team.nikkes.some((member) =>
            member.nikkes.name
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase())
          ))
    );
  };

  const sortTeams = (
    teams: TeamWithNikkes[],
    sortBy: string,
    sortOrder: "asc" | "desc"
  ) => {
    return [...teams].sort((a, b) => {
      if (sortBy === "votes") {
        return sortOrder === "desc"
          ? b.total_votes - a.total_votes
          : a.total_votes - b.total_votes;
      }
      return 0;
    });
  };

  return (
    <GenericTeamList
      initialTeams={initialTeams}
      versions={versions}
      renderTeamCard={renderTeamCard}
      getTeamId={getTeamId}
      getTeamMembers={getTeamMembers}
      filterTeams={filterTeams}
      sortTeams={sortTeams}
    />
  );
};

export default TribeTowerTeamList;
