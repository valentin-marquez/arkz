"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Difficulty, SortBy } from "@/lib/types";
import { Tables } from "@/lib/types/database.types";

interface StoryStore {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  chapters: Tables<"chapters">[];
  setChapters: (chapters: Tables<"chapters">[]) => void;
  filteredChapters: Tables<"chapters">[];
  loadMore: () => void;
  hasMore: boolean;
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  normalSearchTerm: string;
  setNormalSearchTerm: (searchTerm: string) => void;
  hardSearchTerm: string;
  setHardSearchTerm: (searchTerm: string) => void;
  completedChapters: string[];
  toggleChapterCompletion: (chapterId: string) => void;
}

const CHAPTERS_PER_PAGE = 10;

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      difficulty: "normal",
      setDifficulty: (difficulty) => {
        const {
          chapters,
          normalSearchTerm,
          hardSearchTerm,
          sortBy,
          setNormalSearchTerm,
          setHardSearchTerm,
        } = get();
        const searchTerm =
          difficulty === "normal" ? normalSearchTerm : hardSearchTerm;

        const filteredAndSortedChapters = chapters
          .filter(
            (chapter) =>
              chapter.difficulty === difficulty &&
              chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => {
            if (sortBy === "chapter_number") {
              return a.chapter_number - b.chapter_number;
            } else {
              return a.title.localeCompare(b.title);
            }
          });

        set({
          difficulty,
          filteredChapters: filteredAndSortedChapters.slice(
            0,
            CHAPTERS_PER_PAGE
          ),
          hasMore: filteredAndSortedChapters.length > CHAPTERS_PER_PAGE,
        });
      },
      chapters: [],
      setChapters: (chapters) => {
        set({ chapters });
      },
      filteredChapters: [],
      loadMore: () => {
        const {
          chapters,
          filteredChapters,
          difficulty,
          sortBy,
          normalSearchTerm,
          hardSearchTerm,
        } = get();
        const filteredAndSortedChapters = chapters
          .filter(
            (chapter) =>
              chapter.difficulty === difficulty &&
              chapter.title
                .toLowerCase()
                .includes(
                  difficulty === "normal"
                    ? normalSearchTerm.toLowerCase()
                    : hardSearchTerm.toLowerCase()
                )
          )
          .sort((a, b) => {
            if (sortBy === "chapter_number") {
              return a.chapter_number - b.chapter_number;
            } else {
              return a.title.localeCompare(b.title);
            }
          });

        const newFilteredChapters = filteredAndSortedChapters.slice(
          0,
          filteredChapters.length + CHAPTERS_PER_PAGE
        );
        set({
          filteredChapters: newFilteredChapters,
          hasMore:
            newFilteredChapters.length < filteredAndSortedChapters.length,
        });
      },
      hasMore: true,
      sortBy: "chapter_number",
      setSortBy: (sortBy) => set({ sortBy }),
      normalSearchTerm: "",
      setNormalSearchTerm: (searchTerm) =>
        set({ normalSearchTerm: searchTerm }),
      hardSearchTerm: "",
      setHardSearchTerm: (searchTerm) => set({ hardSearchTerm: searchTerm }),
      completedChapters: [],
      toggleChapterCompletion: (chapterId) =>
        set((state) => ({
          completedChapters: state.completedChapters.includes(chapterId)
            ? state.completedChapters.filter((id) => id !== chapterId)
            : [...state.completedChapters, chapterId],
        })),
    }),
    {
      name: "story-storage",
      partialize: (state) => ({ completedChapters: state.completedChapters }),
    }
  )
);
