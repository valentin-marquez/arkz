"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Database } from "@/lib/types/database.types";
import { motion } from "framer-motion";

interface GenericTeamListProps<T> {
  initialTeams: T[];
  versions: Database["game_versions"][];
  renderTeamCard: (
    team: T,
    onVote: (teamId: string, voteType: "up" | "down") => void
  ) => React.ReactNode;
  getTeamId: (team: T) => string;
  getTeamMembers: (team: T) => { id: string; name: string }[];
  filterTeams: (teams: T[], filters: any) => T[];
  sortTeams: (teams: T[], sortBy: string, sortOrder: "asc" | "desc") => T[];
}

export default function GenericTeamList<T>({
  initialTeams,
  versions,
  renderTeamCard,
  getTeamId,
  getTeamMembers,
  filterTeams,
  sortTeams,
}: GenericTeamListProps<T>) {
  const [teams, setTeams] = useState(initialTeams);
  const [filteredTeams, setFilteredTeams] = useState(initialTeams);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(
    versions[0].id || "all"
  );
  const [page, setPage] = useState(1);
  const [teamsPerPage, setTeamsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("votes");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  console.log("teams", teams);

  useEffect(() => {
    let filtered = filterTeams(teams, { selectedVersion, searchTerm });
    filtered = sortTeams(filtered, sortBy, sortOrder);
    setFilteredTeams(filtered);
    setPage(1);
  }, [
    teams,
    selectedVersion,
    searchTerm,
    sortBy,
    sortOrder,
    filterTeams,
    sortTeams,
  ]);

  const handleVersionChange = (value: string) => setSelectedVersion(value);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);
  const handleTeamsPerPageChange = (value: string) =>
    setTeamsPerPage(parseInt(value));
  const handleSortChange = (value: string) => {
    if (value === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(value);
      setSortOrder("desc");
    }
  };

  const onVote = (teamId: string, voteType: "up" | "down") => {
    // TODO: Implement voting logic here
    console.log(`Voted ${voteType} for team ${teamId}`);
  };

  const paginatedTeams = filteredTeams.slice(
    (page - 1) * teamsPerPage,
    page * teamsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Filters and  sorting controls */}
      <div className="flex flex-col *:flex *:flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4  *:space-y-1.5 *:w-full *:sm:w-[180px]">
        <div>
          <Label htmlFor="version">Game Version:</Label>
          <Select value={selectedVersion} onValueChange={handleVersionChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by version" />
            </SelectTrigger>
            <SelectContent id="version">
              <SelectItem className="cursor-pointer" value="all">
                All Versions
              </SelectItem>
              {versions.map((version) => (
                <SelectItem
                  className="cursor-pointer"
                  key={version.id}
                  value={version.id}
                >
                  {version.version}{" "}
                  {version.id === versions[0].id && "(Latest)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="teamsPerPage">Teams per page:</Label>
          <Select
            value={teamsPerPage.toString()}
            onValueChange={handleTeamsPerPageChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Teams per page" />
            </SelectTrigger>
            <SelectContent id="teamsPerPage">
              <SelectItem className="cursor-pointer" value="10">
                10 per page
              </SelectItem>
              <SelectItem className="cursor-pointer" value="20">
                20 per page
              </SelectItem>
              <SelectItem className="cursor-pointer" value="50">
                50 per page
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sort">Sort by:</Label>
          <Button
            id="sort"
            variant="outline"
            onClick={() => handleSortChange("votes")}
            className="w-full sm:w-[180px] px-3 py-2"
          >
            Sort by Votes
            {sortBy === "votes" && (sortOrder === "asc" ? "↑" : "↓")}
          </Button>
        </div>
        <div>
          <Label htmlFor="search">Search:</Label>
          <Input
            id="search"
            className="w-full"
            placeholder="Search Nikke"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Teams list */}
      <motion.div
        layout
        className="rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-content-center place-items-center"
      >
        {paginatedTeams.map((team) => (
          <div key={getTeamId(team)}>{renderTeamCard(team, onVote)}</div>
        ))}
      </motion.div>

      {/* Not teams found message */}
      {paginatedTeams.length === 0 && (
        <div className="container mx-auto flex flex-col w-full items-center">
          <Image
            src="/no-teams.png"
            alt="No teams found"
            width={200}
            height={200}
          />
          <h4 className="p-4 pb-0 text-center">No teams found</h4>
          <p className="p-0 m-0 text-muted-foreground">
            Send us a team to be added to the database.
          </p>
        </div>
      )}

      {/* Pagination */}
      {paginatedTeams.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : 0}
                className={cn(
                  `${page <= 1 ? "pointer-events-none opacity-50" : ""}`
                )}
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Previous
              </PaginationPrevious>
            </PaginationItem>
            {Array.from(
              { length: Math.ceil(filteredTeams.length / teamsPerPage) },
              (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                aria-disabled={
                  page >= Math.ceil(filteredTeams.length / teamsPerPage)
                }
                tabIndex={
                  page >= Math.ceil(filteredTeams.length / teamsPerPage)
                    ? -1
                    : 0
                }
                className={cn(
                  `${
                    page >= Math.ceil(filteredTeams.length / teamsPerPage)
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`
                )}
              >
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
