import { createClient } from "@/lib/supabase/server";
import { StoryPageClient } from "@/components/story/story-page";

export default async function StoryPage() {
  const supabase = createClient();
  const { data: chapters, error } = await supabase.from("chapters").select("*");

  if (error) {
    console.error("Error fetching chapters:", error);
    return <div>Error loading chapters</div>;
  }

  return <StoryPageClient initialChapters={chapters || []} />;
}
