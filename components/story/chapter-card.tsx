"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { Database } from "@/lib/types/database.types";
import { useStoryStore } from "@/lib/store/story-store";
import { getMediaURL } from "@/lib/supabase/utils";

interface ChapterCardProps {
  chapter: Database["chapters"];
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  const { difficulty, completedChapters, toggleChapterCompletion } =
    useStoryStore();
  const isCompleted = completedChapters.includes(chapter.id);

  // Function to handle checkbox click
  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click from bubbling up to the link
    toggleChapterCompletion(chapter.id);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.25,
      }}
    >
      <Link href={`/story/${chapter.difficulty}/${chapter.chapter_number}`}>
        <Card className={`overflow-hidden ${isCompleted ? "opacity-50" : ""}`}>
          <CardContent className="p-0 relative">
            <Image
              src={getMediaURL(chapter.image_path)}
              alt={chapter.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
              placeholder="blur"
              blurDataURL="/placeholder-boss.gif"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-2 right-2">
              <Checkbox
                checked={isCompleted}
                onClick={handleCheckboxClick} // Use the custom click handler
                onCheckedChange={() => {}}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge
                variant={difficulty === "hard" ? "destructive" : "secondary"}
                className="mb-2"
              >
                Chapter {chapter.chapter_number}
              </Badge>
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {chapter.title}
              </h3>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
