"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useStoryStore } from "@/lib/store/story-store";

export const Filters: React.FC = () => {
  const { sortBy, setSortBy, searchTerm, setSearchTerm } = useStoryStore();

  return (
    <div className="flex space-x-4 mb-4">
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="chapter_number">Chapter Number</SelectItem>
          <SelectItem value="title">Title</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="Search chapters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
      />
    </div>
  );
};
