import React from "react";
import { createClient } from "@/lib/supabase/server";
import SoloRaidSeasonsList from "@/components/solo-raid/solo-raid-boss-list";
import { Tables } from "@/lib/types/database.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solo Raid Seasons - Arkz | Nikke: Goddess of Victory",
  description:
    "Explore the Solo Raid Seasons in Nikke: Goddess of Victory. Find strategies and team compositions for each season's boss with Arkz's comprehensive guide.",
};

export default async function SoloRaidSeasonsPage() {
  const supabase = createClient();
  const { data: seasons, error } = await supabase
    .from("solo_raid_seasons")
    .select(
      `
      *,
      boss: bosses (*)
    `
    )
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching solo raid seasons:", error);
    return <div>Error loading solo raid seasons. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary">
        Solo Raid Seasons
      </h1>
      <SoloRaidSeasonsList
        initialSeasons={
          seasons as (Tables<"solo_raid_seasons"> & {
            boss: Tables<"bosses">;
          })[]
        }
      />
    </div>
  );
}
