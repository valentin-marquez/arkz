"use client";

import React from "react";
import { motion } from "framer-motion";
import CharacterCardSkeleton from "./character-card-skeleton";

const CharacterGridSkeleton: React.FC = () => {
  // Adjust this number to match the number of skeleton cards you want to display
  const skeletonCount = 12;

  return (
    <motion.div
      layout
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
    >
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div key={index}>
          <CharacterCardSkeleton />
        </div>
      ))}
    </motion.div>
  );
};

export default CharacterGridSkeleton;
