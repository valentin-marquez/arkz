"use client";
import React from "react";
import GenericTeamList from "../base/generic-team-list";
import SoloRaidTeamCard from "./solo-raid-team-card";
import {
  Tables,
  TeamWithNikkesSoloRaid,
  TeamWithNikkes,
} from "@/lib/types/database.types";

interface SoloRaidTeamListProps {
  initialTeams: TeamWithNikkesSoloRaid[];
  versions: Tables<"game_versions">[];
  initialUserLikes: string[];
}

const SoloRaidTeamList: React.FC<SoloRaidTeamListProps> = ({
  initialTeams,
  versions,
  initialUserLikes,
}) => {
  const renderTeamCard = (team: TeamWithNikkes) => {
    const soloRaidTeam = team as TeamWithNikkesSoloRaid;
    return (
      <SoloRaidTeamCard
        id={soloRaidTeam.team_id}
        user={{
          username: soloRaidTeam.username,
          avatarUrl: soloRaidTeam.avatar_url,
        }}
        team={soloRaidTeam}
        totalVotes={soloRaidTeam.total_votes}
        comment={soloRaidTeam.comment || ""}
        metadata={{ gameVersionId: soloRaidTeam.game_version_id }}
        isLiked={initialUserLikes.includes(soloRaidTeam.team_id)}
        mode="solo-raid"
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

export default SoloRaidTeamList;
