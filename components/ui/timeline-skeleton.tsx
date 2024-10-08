import { Card } from "./card";
import { Skeleton } from "./skeleton";

export const TimelineSkeleton: React.FC = () => (
  <Card className="container mx-auto p-4 bg-background text-foreground">
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-3/4" />
      <Skeleton className="h-16 w-1/2" />
    </div>
  </Card>
);
