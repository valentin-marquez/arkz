import React from "react";
import { createClient } from "@/lib/supabase/server";
import InterceptionBossList from "@/components/interception/interception-boss-list";
import { Tables } from "@/lib/types/database.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interception Bosses Guide - Arkz | Nikke: Goddess of Victory",
  description:
    "Master the Interception mode in Nikke: Goddess of Victory. Discover strategies and team compositions to defeat every boss in the Interception mode with Arkz's comprehensive guide.",
};

export default async function InterceptionPage() {
  const supabase = createClient();
  const { data: bosses, error } = await supabase
    .from("bosses")
    .select("*")
    .eq("mode_type", "Interception");

  if (error) {
    console.error("Error fetching bosses:", error);
    return <div>Error loading bosses. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary">
        Interception Bosses
      </h1>
      <InterceptionBossList initialBosses={bosses as Tables<"bosses">[]} />
    </div>
  );
}
