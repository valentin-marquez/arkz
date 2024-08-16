// story-page.tsx
"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { StoryTabs } from "./story-tabs";
import { ChapterGrid } from "./chapter-grid";
import { Filters } from "./filters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStoryStore } from "@/lib/store/story-store";
import { useInView } from "react-intersection-observer";
import { Tables } from "@/lib/types/database.types";

interface StoryPageClientProps {
  initialChapters: Tables<"chapters">[];
}

export const StoryPageClient: React.FC<StoryPageClientProps> = ({
  initialChapters,
}) => {
  const {
    setChapters,
    filteredChapters,
    loadMore,
    hasMore,
    difficulty,
    setDifficulty,
    sortBy,
    searchTerm,
  } = useStoryStore();
  const { ref, inView } = useInView();

  useEffect(() => {
    setChapters(initialChapters);
  }, [setChapters, initialChapters]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

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
      <h1 className="text-4xl font-bold text-center mb-8">Story Chapters</h1>

      <StoryTabs
        difficulty={difficulty}
        setDifficulty={setDifficulty} // Ensure this function is passed
      />
      <Filters />

      <ScrollArea className="h-[calc(100vh-300px)] w-full rounded-md border p-4">
        <ChapterGrid chapters={filteredChapters} />
        {hasMore && (
          <div ref={ref} className="flex justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
            >
              Loading more chapters...
            </motion.div>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
};
