import { createClient } from "@/lib/supabase/server";
import TowerCard from "@/components/tribe/tower-card";
import { Tables } from "@/lib/types/database.types";

async function getTowersData(): Promise<{
  towers: Tables<"tribe_towers">[];
}> {
  const supabase = createClient();

  const { data: towers, error } = await supabase
    .from("tribe_towers")
    .select("*")
    .order("name");

  if (error) throw error;

  return { towers: towers as Tables<"tribe_towers">[] };
}

function isTowerAvailable(tower: Tables<"tribe_towers">): boolean {
  if (tower.is_always_available) return true;

  const now = new Date();
  const utcDay = now.getUTCDay();
  const utcHour = now.getUTCHours();
  const utcMinute = now.getUTCMinutes();

  const [resetHour, resetMinute] = tower.reset_hour.split(":").map(Number);
  const resetDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      resetHour,
      resetMinute
    )
  );

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (utcDay === 6) return true;

  if (tower.available_days.includes(daysOfWeek[utcDay])) {
    if (now >= resetDate) {
      return true;
    }
  }

  const yesterdayIndex = (utcDay - 1 + 7) % 7;
  if (tower.available_days.includes(daysOfWeek[yesterdayIndex])) {
    if (now < resetDate) {
      return true;
    }
  }

  return false;
}

export default async function Page() {
  const { towers } = await getTowersData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
      {towers.map((tower) => (
        <TowerCard
          key={tower.id}
          id={tower.id}
          name={tower.name}
          manufacturer={tower.manufacturer}
          maxFloors={tower.max_floors}
          availableDays={tower.available_days}
          isAvailable={isTowerAvailable(tower)}
        />
      ))}
    </div>
  );
}
