"use client";
import React, { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Tables } from "@/lib/types/database.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { ChapterCard } from "./chapter-card";
import { Difficulty } from "@/lib/types";

interface StoryPageProps {
  initialChapters: Tables<"chapters">[];
}

const CHAPTERS_PER_PAGE = 32;

type SortBy = "chapter_number" | "title" | "id" | "mode_id";

export const StoryPage: React.FC<StoryPageProps> = ({ initialChapters }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [chapters, setChapters] =
    useState<Tables<"chapters">[]>(initialChapters);
  const [filteredChapters, setFilteredChapters] = useState<
    Tables<"chapters">[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("chapter_number");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [normalSearchTerm, setNormalSearchTerm] = useState("");
  const [hardSearchTerm, setHardSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const sortedChapters = [...filteredChapters].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  const { ref, inView } = useInView();

  const filterAndSortChapters = () => {
    const searchTerm =
      difficulty === "normal" ? normalSearchTerm : hardSearchTerm;
    const filtered = chapters
      .filter(
        (chapter) =>
          chapter.difficulty === difficulty &&
          chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "chapter_number") {
          return a.chapter_number - b.chapter_number;
        } else {
          return a.title.localeCompare(b.title);
        }
      });

    setFilteredChapters(filtered.slice(0, page * CHAPTERS_PER_PAGE));
    setHasMore(filtered.length > page * CHAPTERS_PER_PAGE);
  };

  useEffect(() => {
    filterAndSortChapters();
  }, [difficulty, sortBy, sortOrder, page, chapters]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setPage(1);
  };

  const handleSortChange = (newSortBy: SortBy) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    if (difficulty === "normal") {
      setNormalSearchTerm(newSearchTerm);
    } else {
      setHardSearchTerm(newSearchTerm);
    }
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.25,
      }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-center mb-8">Story Chapters</h1>

      <div className="flex flex-col gap-4 mb-4">
        <Tabs
          value={difficulty}
          onValueChange={(value: string) =>
            handleDifficultyChange(value as Difficulty)
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="normal">Normal</TabsTrigger>
            <TabsTrigger value="hard">Hard</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {sortedChapters.map((chapter) => (
            <motion.div
              key={chapter.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                bounce: 0.05,
                duration: 0.25,
              }}
            >
              <ChapterCard chapter={chapter} currentDifficulty={difficulty} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {hasMore && (
        <div ref={ref} className="flex justify-center p-4 mt-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              bounce: 0.05,
              duration: 0.25,
            }}
          >
            Loading more chapters...
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default StoryPage;
