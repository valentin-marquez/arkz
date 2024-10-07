import React from "react";
import { createClient } from "@/lib/supabase/server";
import AnomalyInterceptionBossList from "@/components/anomaly-interception/anomaly-interception-boss-list";
import { Tables } from "@/lib/types/database.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anomaly Interception Bosses Guide - Arkz | Nikke: Goddess of Victory",
  description:
    "Master the Anomaly Interception mode in Nikke: Goddess of Victory. Discover strategies and team compositions to defeat every boss in the Anomaly Interception mode with Arkz's comprehensive guide.",
};

export default async function AnomalyInterceptionPage() {
  const supabase = createClient();
  const { data: bosses, error } = await supabase
    .from("bosses")
    .select("*")
    .eq("mode_type", "Anomaly Interception");

  if (error) {
    console.error("Error fetching bosses:", error);
    return <div>Error loading bosses. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary">
        Anomaly Interception Bosses
      </h1>
      <AnomalyInterceptionBossList
        initialBosses={bosses as Tables<"bosses">[]}
      />
    </div>
  );
}
