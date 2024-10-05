"use client";

import React from "react";
import CharacterCardSkeleton from "./character-card-skeleton";

const CharacterGridSkeleton: React.FC = () => {
  const skeletonCount = 12;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div key={index}>
          <CharacterCardSkeleton />
        </div>
      ))}
    </div>
  );
};

export default CharacterGridSkeleton;
