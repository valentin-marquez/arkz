import { createClient } from "@/lib/supabase/server";
import CharacterContainer from "@/components/character-container";

export default async function Home() {
  const supabase = createClient();

  const { data: characters, error } = await supabase.from("nikkes").select("*");

  if (error) {
    console.error("Error fetching characters:", error);
    return <div>Error loading characters</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <CharacterContainer nikkes={characters} />
    </div>
  );
}
