"use client";
import React from "react";
import GenericTeamList from "../base/generic-team-list";
import TribeTowerTeamCard from "./tribe-team-card";
import {
  Tables,
  TeamWithNIkkesTribe,
  TeamWithNikkes,
} from "@/lib/types/database.types";

interface TribeTowerTeamListProps {
  initialTeams: TeamWithNIkkesTribe[];
  versions: Tables<"game_versions">[];
  initialUserLikes: string[];
}

const TribeTowerTeamList: React.FC<TribeTowerTeamListProps> = ({
  initialTeams,
  versions,
  initialUserLikes,
}) => {
  const renderTeamCard = (team: TeamWithNikkes) => {
    const tribeTeam = team as TeamWithNIkkesTribe;
    return (
      <TribeTowerTeamCard
        id={tribeTeam.team_id}
        user={{ username: tribeTeam.username, avatarUrl: tribeTeam.avatar_url }}
        members={tribeTeam.nikkes}
        totalVotes={tribeTeam.total_votes}
        comment={tribeTeam.comment || ""}
        floor={tribeTeam.floor}
        towerName={tribeTeam.tower_name}
        metadata={{ gameVersionId: tribeTeam.game_version_id }}
        isLiked={initialUserLikes.includes(tribeTeam.team_id)}
        mode="tribe_tower"
      />
    );
  };

  const getTeamId = (team: TeamWithNikkes) => team.team_id;
  const getTeamMembers = (team: TeamWithNikkes) => team.nikkes;

  const filterTeams = (teams: TeamWithNikkes[], filters: any) => {
    return teams.filter(
      (team) =>
        (filters.selectedVersion === "all" ||
          team.game_version_id === filters.selectedVersion) &&
        (!filters.searchTerm ||
          team.nikkes.some((member) =>
            member.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
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
