"use client";
import React from "react";
import GenericTeamList from "../base/generic-team-list";
import AnomalyInterceptionTeamCard from "./anomaly-interception-team-card";
import {
  Tables,
  TeamWithNikkesAnomalyInterception,
  TeamWithNikkes,
} from "@/lib/types/database.types";

interface AnomalyInterceptionTeamListProps {
  initialTeams: TeamWithNikkesAnomalyInterception[];
  versions: Tables<"game_versions">[];
  boss: Tables<"bosses">;
  initialUserLikes: string[];
}

const AnomalyInterceptionTeamList: React.FC<
  AnomalyInterceptionTeamListProps
> = ({ initialTeams, versions, boss, initialUserLikes }) => {
  const renderTeamCard = (team: TeamWithNikkes) => {
    const anomalyInterceptionTeam = team as TeamWithNikkesAnomalyInterception;
    return (
      <AnomalyInterceptionTeamCard
        id={anomalyInterceptionTeam.team_id}
        user={{
          username: anomalyInterceptionTeam.username,
          avatarUrl: anomalyInterceptionTeam.avatar_url,
        }}
        members={anomalyInterceptionTeam.nikkes}
        totalVotes={anomalyInterceptionTeam.total_votes}
        comment={anomalyInterceptionTeam.comment || ""}
        metadata={{ gameVersionId: anomalyInterceptionTeam.game_version_id }}
        isLiked={initialUserLikes.includes(anomalyInterceptionTeam.team_id)}
        bossName={boss.name}
        mode="anomaly-interception"
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
      initialTeams={initialTeams as TeamWithNikkesAnomalyInterception[]}
      versions={versions}
      renderTeamCard={renderTeamCard}
      getTeamId={getTeamId}
      getTeamMembers={getTeamMembers}
      filterTeams={filterTeams}
      sortTeams={sortTeams}
    />
  );
};

export default AnomalyInterceptionTeamList;
