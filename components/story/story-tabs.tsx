"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Difficulty } from "@/lib/types";

interface StoryTabsProps {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}

export function StoryTabs({ difficulty, setDifficulty }: StoryTabsProps) {
  return (
    <Tabs
      defaultValue={difficulty}
      className="container mx-auto w-full max-w-md m-1.5"
      onValueChange={(value) => setDifficulty(value as Difficulty)}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="normal">Normal</TabsTrigger>
        <TabsTrigger value="hard">Hard</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
