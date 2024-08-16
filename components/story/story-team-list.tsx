"use client";
import React from "react";
import GenericTeamList from "../base/generic-team-list";
import ChapterTeamCard from "./story-team-card";
import {
  Tables,
  TeamWithNikkes,
  TeamWithNikkesStory,
} from "@/lib/types/database.types";

interface ChapterTeamListProps {
  initialTeams: TeamWithNikkesStory[];
  versions: Tables<"game_versions">[];
}

const ChapterTeamList: React.FC<ChapterTeamListProps> = ({
  initialTeams,
  versions,
}) => {
  const renderTeamCard = (
    team: TeamWithNikkes,
    onVote: (teamId: string, voteType: "up" | "down") => void
  ) => {
    const storyTeam = team as TeamWithNikkesStory;
    return (
      <ChapterTeamCard
        id={storyTeam.team_id}
        user={{ username: storyTeam.username, avatarUrl: storyTeam.avatar_url }}
        members={storyTeam.nikkes}
        totalVotes={storyTeam.total_votes}
        comment={storyTeam.comment || ""}
        chapterNumber={storyTeam.chapter_number}
        difficulty={storyTeam.difficulty}
        metadata={{ gameVersionId: storyTeam.game_version_id }}
        onVote={onVote}
        mode="story"
      />
    );
  };

  const getTeamId = (team: TeamWithNikkes) =>
    (team as TeamWithNikkesStory).team_id;
  const getTeamMembers = (team: TeamWithNikkes) =>
    (team as TeamWithNikkesStory).nikkes;

  const filterTeams = (teams: TeamWithNikkes[], filters: any) => {
    return teams.filter((team) => {
      const storyTeam = team as TeamWithNikkesStory;
      return (
        (filters.selectedVersion === "all" ||
          storyTeam.game_version_id === filters.selectedVersion) &&
        (!filters.searchTerm ||
          storyTeam.nikkes.some((member) =>
            member.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
          ))
      );
    });
  };

  const sortTeams = (
    teams: TeamWithNikkes[],
    sortBy: string,
    sortOrder: "asc" | "desc"
  ) => {
    return [...teams].sort((a, b) => {
      const aStory = a as TeamWithNikkesStory;
      const bStory = b as TeamWithNikkesStory;
      if (sortBy === "votes") {
        return sortOrder === "desc"
          ? bStory.total_votes - aStory.total_votes
          : aStory.total_votes - bStory.total_votes;
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
