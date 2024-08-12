"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChapterCard } from "./chapter-card";
import { useInView } from "react-intersection-observer";
import { useStoryStore } from "@/lib/store/story-store";
import { Database } from "@/lib/types/database.types";

interface ChapterGridProps {
  chapters: Database["chapters"][];
}

export const ChapterGrid: React.FC<ChapterGridProps> = ({ chapters }) => {
  const { loadMore, hasMore } = useStoryStore();
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          layout
          transition={{
            type: "spring",
            bounce: 0.05,
            duration: 0.25,
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </motion.div>
      </AnimatePresence>
      {hasMore && (
        <div ref={ref} className="flex justify-center p-4 mt-4">
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
    </>
  );
};
