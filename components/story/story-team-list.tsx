"use client";
import React from "react";
import GenericTeamList from "../base/generic-team-list";
import ChapterTeamCard from "./story-team-card";
import { Database } from "@/lib/types/database.types";
import type {
  TeamWithNikkes,
  teams_with_chapter_votes,
} from "@/lib/types/database.types";

interface ChapterTeamListProps {
  initialTeams: teams_with_chapter_votes[];
  versions: Database["game_versions"][];
}

const ChapterTeamList: React.FC<ChapterTeamListProps> = ({
  initialTeams,
  versions,
}) => {
  const renderTeamCard = (
    team: TeamWithNikkes,
    onVote: (teamId: string, voteType: "up" | "down") => void
  ) => (
    <ChapterTeamCard
      id={team.team_id}
      user={{ username: team.username, avatarUrl: team.avatar_url }}
      members={team.nikkes}
      totalVotes={team.total_votes}
      comment={team.comment || ""}
      chapterNumber={team.chapter_number}
      difficulty={team.difficulty}
      metadata={{ gameVersionId: team.game_version_id }}
      onVote={onVote}
      mode="story"
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
            member.nikke_name
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

export default ChapterTeamList;
