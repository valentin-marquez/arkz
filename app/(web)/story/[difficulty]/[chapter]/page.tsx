import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StoryTeamList from "@/components/story/story-team-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import StorySubmitTeamModal from "@/components/story/story-submit-team-modal";
import { Tables } from "@/lib/types/database.types";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { difficulty: string; chapter: string };
}): Promise<Metadata> {
  const { difficulty, chapter } = params;

  return {
    title: `Arkz - Nikke Chapter ${chapter} Guide | ${difficulty} Difficulty`,
    description: `Conquer Chapter ${chapter} in Nikke: Goddess of Victory with our in-depth strategies and team compositions for ${difficulty} difficulty. Maximize your squad’s potential and dominate every challenge.`,
  };
}

async function fetchChapterData(
  difficulty: string,
  chapter: string
): Promise<{
  chapter: Tables<"chapters">;
  teams: any[];
  versions: Tables<"game_versions">[];
  mode: Tables<"modes">;
  userLikes: string[];
}> {
  const supabase = createClient();
  const chapterNumber = parseInt(chapter);

  const { data: chapterData, error: chapterError } = await supabase
    .from("chapters")
    .select("*")
    .eq("chapter_number", chapterNumber)
    .eq("difficulty", difficulty)
    .single();

  if (chapterError) throw chapterError;

  const { data: teamsWithVotes, error: teamsError } = await supabase
    .from("teams_with_chapter_votes")
    .select("*")
    .eq("difficulty", difficulty)
    .eq("chapter_number", chapterNumber);

  if (teamsError) throw teamsError;

  const teamsWithNikkes = await Promise.all(
    (teamsWithVotes || []).map(async (team) => {
      if (!team.team_id) return team;

      const { data: nikkes, error: nikkesError } = await supabase
        .from("team_nikke_details")
        .select("*")
        .eq("team_id", team.team_id);

      if (nikkesError) throw nikkesError;

      return { ...team, nikkes: nikkes || [] };
    })
  );

  const { data: versions, error: versionsError } = await supabase
    .from("game_versions")
    .select("*")
    .order("release_date", { ascending: false });

  if (versionsError) throw versionsError;

  const { data: modeData, error: modeError } = await supabase
    .from("modes")
    .select("*")
    .eq("name", difficulty === "normal" ? "Story Normal" : "Story Hard")
    .single();

  if (modeError || !modeData) throw modeError;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userLikes: string[] = [];
  if (user) {
    const { data: likes, error: likesError } = await supabase
      .from("user_likes")
      .select("team_id")
      .eq("user_id", user.id);

    if (likesError) throw likesError;
    userLikes = likes.map((like) => like.team_id);
  }

  return {
    chapter: (chapterData as Tables<"chapters">) || {},
    teams: teamsWithNikkes,
    versions: (versions as Tables<"game_versions">[]) || [],
    mode: modeData as Tables<"modes">,
    userLikes,
  };
}

export default async function Page({
  params,
}: {
  params: { difficulty: string; chapter: string };
}) {
  const { difficulty, chapter } = params;
  const data = await fetchChapterData(difficulty, chapter);

  return (
    <main className="flex-1 relative space-y-4">
      <div className="flex flex-row w-full justify-between items-center">
        <div className="flex flex-col w-full">
          <Breadcrumb className="px-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/story">Story</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize font-bold">
                  Chapter {chapter} ({difficulty})
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="px-8 flex flex-wrap flex-col">
            <h1 className="text-2xl">Story</h1>
            <p className="text-muted-foreground mt-0 capitalize text-sm">
              Level: {difficulty} - Chapter: {chapter}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <Card className="container mx-auto w-full p-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Teams</CardTitle>
          <StorySubmitTeamModal
            modeId={data.mode.id}
            modeName={data.mode.name}
            chapterId={data.chapter.id}
            numberOfTeams={1}
            allowCharacterRepeat={false}
            versions={data.versions}
          />
        </CardHeader>
        <CardContent className="p-4 pt-0 xl:p-6">
          <StoryTeamList
            initialTeams={data.teams}
            versions={data.versions}
            initialUserLikes={data.userLikes}
          />
        </CardContent>
      </Card>
    </main>
  );
}
