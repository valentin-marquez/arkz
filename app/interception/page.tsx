import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database.types";
import InterceptionBossList from "@/components/interception/interception-boss-list";

type Boss = Database["bosses"];

export default async function InterceptionPage() {
  const supabase = createClient();
  const { data: bosses, error } = await supabase.from("bosses").select("*");

  if (error) {
    console.error("Error fetching bosses:", error);
    return <div>Error loading bosses. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary">
        Interception Bosses
      </h1>
      <InterceptionBossList initialBosses={bosses || []} />
    </div>
  );
}
