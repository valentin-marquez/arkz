"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/types/supabase";
import Link from "next/link";
import Loading from "@/components/ui/loading";

type TeamWithChapterVotes =
  Database["public"]["Views"]["teams_with_chapter_votes"]["Row"];
type TeamNikkeDetails =
  Database["public"]["Views"]["team_nikke_details"]["Row"];
type TeamWithNikkes = TeamWithChapterVotes & {
  nikkes: TeamNikkeDetails[];
};

type ChapterData = {
  chapter: Database["public"]["Tables"]["chapters"]["Row"];
  teams: TeamWithNikkes[];
  versions: Database["public"]["Tables"]["game_versions"]["Row"][];
  mode: Database["public"]["Tables"]["modes"]["Row"];
};

const DataContext = createContext<ChapterData | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

const fetchChapterData = async (
  difficulty: string,
  chapter: string
): Promise<ChapterData> => {
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

  const teamsWithNikkes: TeamWithNikkes[] = await Promise.all(
    (teamsWithVotes || []).map(async (team) => {
      const { data: nikkes, error: nikkesError } = await supabase
        .from("team_nikke_details")
        .select("*")
        // @ts-ignore
        .eq("team_id", team?.team_id);

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

  return {
    chapter: chapterData,
    teams: teamsWithNikkes,
    versions: versions || [],
    mode: modeData,
  };
};

export default function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: {
    difficulty: string;
    chapter: string;
  };
}) {
  const [data, setData] = useState<ChapterData | undefined>(undefined);
  const { difficulty, chapter } = params;

  useEffect(() => {
    fetchChapterData(difficulty, chapter).then(setData).catch(console.error);
  }, [difficulty, chapter]);

  if (!data) return <Loading />;

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
