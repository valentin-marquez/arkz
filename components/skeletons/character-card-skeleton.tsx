"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CharacterCardSkeleton: React.FC = () => {
  return (
    <Card className="w-full overflow-hidden border-2">
      <CardContent className="p-3 flex items-center space-x-3">
        {/* Image Placeholder */}
        <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />

        <div className="flex-grow space-y-2">
          {/* Name Placeholder */}
          <Skeleton className="h-4 w-3/4 rounded" />

          <div className="flex items-center space-x-1 mt-1">
            {/* Rarity Badge Placeholder */}
            <Skeleton className="h-4 w-16 rounded" />

            {/* Element Icon Placeholder */}
            <Skeleton className="h-5 w-5 rounded-full" />

            {/* Weapon Type Icon Placeholder */}
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterCardSkeleton;
