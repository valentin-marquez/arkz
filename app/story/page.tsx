import { createClient } from "@/lib/supabase/server";
import { StoryPageClient } from "@/components/story/story-page";
import { Tables } from "@/lib/types/database.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nikke Story Guide - Victorix | Chapters & Plot Details",
  description:
    "Dive into the captivating story of Nikke: Goddess of Victory. Explore detailed chapter guides, uncover plot twists, and relive the epic narrative through Victorix's comprehensive story breakdown.",
};

export default async function StoryPage() {
  const supabase = createClient();
  const { data: chapters, error } = await supabase.from("chapters").select("*");

  if (error) {
    console.error("Error fetching chapters:", error);
    return <div>Error loading chapters</div>;
  }

  return <StoryPageClient initialChapters={chapters as Tables<"chapters">[]} />;
}
