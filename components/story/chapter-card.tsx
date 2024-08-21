"use client";
"use client";
import React from "react";
import { m as motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { getMediaURL } from "@/lib/supabase/utils";
import { Tables } from "@/lib/types/database.types";
import { Difficulty } from "@/lib/types";

interface ChapterCardProps {
  chapter: Tables<"chapters">;
  currentDifficulty: Difficulty;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  currentDifficulty,
}) => {
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
        <Card className="overflow-hidden">
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
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge
                variant={
                  currentDifficulty === "hard" ? "destructive" : "secondary"
                }
                className="mb-2"
              >
                <span>Chapter {chapter.chapter_number}</span>
              </Badge>
              <h4 className="text-lg font-semibold text-white line-clamp-2">
                {chapter.title}
              </h4>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
