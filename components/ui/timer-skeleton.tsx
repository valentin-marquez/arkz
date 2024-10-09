"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TimerSkeleton = () => {
  return (
    <Card className="w-full mx-auto p-4 bg-muted/60 rounded-lg shadow-lg border-2">
      <Skeleton className="h-8 w-1/2 mb-4" />
      <div className="flex justify-evenly mb-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="h-10 w-16 mb-2" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
      <Skeleton className="h-4 w-full" />
    </Card>
  );
};

export default TimerSkeleton;
