import { createClient } from "@/lib/supabase/server";
import CharacterContainer from "@/components/character-container";
import { Suspense, cache } from "react";
import CharacterGridSkeleton from "@/components/skeletons/character-grid-skeleton";

export const revalidate = 3600; // 1 hour

const getNikkes = cache(async () => {
  const supabase = createClient();
  const { data: characters, error } = await supabase.from("nikkes").select("*");

  if (error) {
    console.error("Error fetching characters:", error);
    return [];
  }

  return characters;
});

export default async function Home() {
  const characters = await getNikkes();

  return (
    <div className="flex flex-col w-full">
      <Suspense fallback={<CharacterGridSkeleton />}>
        <CharacterContainer nikkes={characters} />
      </Suspense>
    </div>
  );
}
