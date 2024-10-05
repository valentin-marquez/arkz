import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import SoloRaidTeamList from "@/components/solo-raid/solo-raid-team-list";
import SoloRaidSubmitTeamModal from "@/components/solo-raid/solo-raid-submit-team-modal";
import { Tables, SeasonWithBoss } from "@/lib/types/database.types";
import { Metadata } from "next";
import { Header } from "@/components/ui/header";

export async function generateMetadata({
  params,
}: {
  params: { seasonslug: string };
}): Promise<Metadata> {
  const { season } = await fetchSeasonData(params.seasonslug);

  return {
    title: `${
      season?.name || "Solo Raid Season"
    } Guide - Arkz | Nikke: Goddess of Victory`,
    description: `Defeat ${
      season?.boss?.name || "the boss"
    } in the Solo Raid mode of Nikke: Goddess of Victory. Learn the best strategies, team compositions, and tips to conquer ${
      season?.boss?.name || "this challenging boss"
    } in Season ${season?.name || ""}.`,
  };
}

async function fetchSeasonData(seasonSlug: string): Promise<{
  season: SeasonWithBoss | null;
  teams: any[];
  versions: Tables<"game_versions">[] | [];
  userLikes: string[];
}> {
  const supabase = createClient();

  const { data: season, error: seasonError } = await supabase
    .from("solo_raid_seasons")
    .select("*, boss:bosses(*)")
    .eq("slug", seasonSlug)
    .single();

  if (seasonError) throw seasonError;

  const { data: teams, error: teamsError } = await supabase
    .from("solo_raid_teams_with_votes_and_season")
    .select("*")
    .eq("season_slug", seasonSlug);

  if (teamsError) throw teamsError;

  const teamsWithNikkes = await Promise.all(
    (teams || []).map(async (team) => {
      if (!team.team_id) return team;

      const { data: nikkes, error: nikkesError } = await supabase
        .from("solo_raid_team_nikke_details")
        .select("*")
        .eq("team_id", team.team_id);

      if (nikkesError) throw nikkesError;

      return { ...team, nikkes: nikkes || [] };
    })
  );

  const { data: versions, error: versionsError } = await supabase
    .from("game_versions")
    .select("*")
    .order("release_date", { ascending: false });

  if (versionsError) throw versionsError;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userLikes: string[] = [];
  if (user) {
    const { data: likes, error: likesError } = await supabase
      .from("user_likes")
      .select("team_id")
      .eq("user_id", user.id);

    if (likesError) throw likesError;
    userLikes = likes.map((like) => like.team_id);
  }

  return {
    season: season as SeasonWithBoss,
    teams: teamsWithNikkes,
    versions: versions as Tables<"game_versions">[],
    userLikes,
  };
}

export default async function SoloRaidSeasonPage({
  params,
}: {
  params: { seasonslug: string };
}) {
  const { season, teams, versions, userLikes } = await fetchSeasonData(
    params.seasonslug
  );

  if (!season) {
    return <div>Season not found.</div>;
  }
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/solo-raid", label: "Solo Raid" },
    { label: season.name },
  ];

  return (
    <main className="flex-1 relative space-y-4">
      <Header
        breadcrumbs={breadcrumbs}
        title={season.name}
        subtitle={`Solo Raid Season - Boss: ${season.boss?.name}`}
      />

      <Card className="container mx-auto w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl">Teams</CardTitle>
          <SoloRaidSubmitTeamModal
            seasonId={season.id}
            seasonName={season.name}
            boss={season.boss}
            versions={versions}
          />
        </CardHeader>
        <CardContent className="p-4 pt-0 xl:p-6">
          <SoloRaidTeamList
            initialTeams={teams}
            versions={versions}
            initialUserLikes={userLikes}
          />
        </CardContent>
      </Card>
    </main>
  );
}
