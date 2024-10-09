import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/types/database.types";

export async function getEvents(): Promise<Tables<"game_events">[]> {
  const supabase = createClient();
  const currentDate = new Date();
  const threeDaysAgo = new Date(
    currentDate.getTime() - 3 * 24 * 60 * 60 * 1000
  );

  const { data: eventsData, error: eventsError } = await supabase
    .from("game_events")
    .select("*")
    .or(
      `end_date.gte.${threeDaysAgo.toISOString()},and(start_date.lte.${currentDate.toISOString()},end_date.gte.${currentDate.toISOString()})`
    )
    .order("importance", { ascending: true })
    .order("start_date", { ascending: true });

  if (eventsError) {
    console.error("Error fetching events:", eventsError);
    return [];
  }

  return eventsData as Tables<"game_events">[];
}
