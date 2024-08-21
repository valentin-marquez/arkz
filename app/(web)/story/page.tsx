import { createClient } from "@/lib/supabase/server";
import { StoryPage } from "@/components/story/story-page";
import { Tables } from "@/lib/types/database.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nikke Story Guide - Arkz | Chapters & Plot Details",
  description:
    "Dive into the captivating story of Nikke: Goddess of Victory. Explore detailed chapter guides, uncover plot twists, and relive the epic narrative through Arkz's comprehensive story breakdown.",
};

export default async function Page() {
  const supabase = createClient();
  const { data: chapters, error } = await supabase.from("chapters").select("*");

  if (error) {
    console.error("Error fetching chapters:", error);
    return <div>Error loading chapters</div>;
  }

  return <StoryPage initialChapters={chapters as Tables<"chapters">[]} />;
}
