"use client";
import React from "react";
import GenericTeamList from "../base/generic-team-list";
import InterceptionTeamCard from "./interception-team-card";
import {
  Tables,
  TeamWithNikkesInterception,
  TeamWithNikkes,
} from "@/lib/types/database.types";

interface InterceptionTeamListProps {
  initialTeams: TeamWithNikkesInterception[];
  versions: Tables<"game_versions">[];
  boss: Tables<"bosses">;
  initialUserLikes: string[];
}

const InterceptionTeamList: React.FC<InterceptionTeamListProps> = ({
  initialTeams,
  versions,
  boss,
  initialUserLikes,
}) => {
  const renderTeamCard = (team: TeamWithNikkes) => {
    const interceptionTeam = team as TeamWithNikkesInterception;
    return (
      <InterceptionTeamCard
        id={interceptionTeam.team_id}
        user={{
          username: interceptionTeam.username,
          avatarUrl: interceptionTeam.avatar_url,
        }}
        members={interceptionTeam.nikkes}
        totalVotes={interceptionTeam.total_votes}
        comment={interceptionTeam.comment || ""}
        metadata={{ gameVersionId: interceptionTeam.game_version_id }}
        isLiked={initialUserLikes.includes(interceptionTeam.team_id)}
        bossName={boss.name}
        mode="interception"
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
      initialTeams={initialTeams as TeamWithNikkesInterception[]}
      versions={versions}
      renderTeamCard={renderTeamCard}
      getTeamId={getTeamId}
      getTeamMembers={getTeamMembers}
      filterTeams={filterTeams}
      sortTeams={sortTeams}
    />
  );
};

export default InterceptionTeamList;
