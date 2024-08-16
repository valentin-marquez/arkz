// story-store.ts
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
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  completedChapters: string[];
  toggleChapterCompletion: (chapterId: string) => void;
}

const CHAPTERS_PER_PAGE = 10;

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      difficulty: "normal",
      setDifficulty: (difficulty) => {
        const { chapters, searchTerm, sortBy } = get();
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
        const { difficulty, searchTerm, sortBy } = get();
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
          chapters,
          filteredChapters: filteredAndSortedChapters.slice(
            0,
            CHAPTERS_PER_PAGE
          ),
          hasMore: filteredAndSortedChapters.length > CHAPTERS_PER_PAGE,
        });
      },
      filteredChapters: [],
      loadMore: () => {
        const { chapters, filteredChapters, difficulty, sortBy, searchTerm } =
          get();
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
      searchTerm: "",
      setSearchTerm: (searchTerm) => set({ searchTerm }),
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
