"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TwitterTimelineSkeleton = () => {
  return (
    <Card className="bg-muted/60 w-full p-0">
      <CardContent className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TwitterTimelineSkeleton;
