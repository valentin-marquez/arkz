"use client";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, m as motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface Filter {
  type: string;
  value: string;
}

interface DynamicFilterInputProps {
  onFilterChange: (filters: Filter[], searchTerm: string) => void;
}

const filterTypes = {
  rarity: ["R", "SR", "SSR"],
  element: ["Iron", "Electric", "Fire", "Wind", "Water"],
  weapon_type: ["AR", "MG", "SMG", "SG", "RL", "SR"],
  burst: ["1", "2", "3", "Multiple"],
  manufacturer: ["Pilgrim", "Missilis", "Tetra", "Elysion", "Abnormal"],
};

const DynamicFilterInput: React.FC<DynamicFilterInputProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLDivElement>(null);

  const updateInputContent = useCallback(() => {
    if (inputRef.current) {
      const highlightedContent = inputValue.replace(
        /(\w+):(\S+)/g,
        '<span class="bg-secondary text-secondary-foreground px-1 rounded mr-1">$1:$2</span>'
      );
      inputRef.current.innerHTML = highlightedContent;
      // Place cursor at the end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [inputValue]);

  useEffect(() => {
    updateInputContent();
  }, [updateInputContent]);

  const handleInputChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      const newValue = event.currentTarget.textContent || "";
      setInputValue(newValue);

      // Parse filters and search term
      const filterRegex = /(\w+):(\S+)/g;
      const newFilters: Filter[] = [];
      let searchTerm = newValue;
      let match;

      while ((match = filterRegex.exec(newValue)) !== null) {
        newFilters.push({
          type: match[1].toLowerCase(),
          value: match[2].toLowerCase(),
        });
        searchTerm = searchTerm.replace(match[0], "").trim();
      }

      setFilters(newFilters);
      onFilterChange(newFilters, searchTerm);

      // Generate suggestions
      const lastColonIndex = newValue.lastIndexOf(":");
      if (lastColonIndex !== -1) {
        const filterType = newValue
          .slice(0, lastColonIndex)
          .split(" ")
          .pop()
          ?.toLowerCase();
        if (filterType && filterTypes[filterType as keyof typeof filterTypes]) {
          setSuggestions(
            filterTypes[filterType as keyof typeof filterTypes].filter(
              (suggestion) =>
                suggestion
                  .toLowerCase()
                  .startsWith(newValue.slice(lastColonIndex + 1).toLowerCase())
            )
          );
        } else {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    },
    [onFilterChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    },
    []
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      const lastColonIndex = inputValue.lastIndexOf(":");
      if (lastColonIndex !== -1) {
        const newValue =
          inputValue.slice(0, lastColonIndex + 1) + suggestion + " ";
        setInputValue(newValue);
        handleInputChange({
          currentTarget: { textContent: newValue },
        } as React.FormEvent<HTMLDivElement>);
      }
      setSuggestions([]);
    },
    [inputValue, handleInputChange]
  );

  const handleClearFilters = useCallback(() => {
    setFilters([]);
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.textContent = "";
      inputRef.current.focus();
    }
    onFilterChange([], "");
  }, [onFilterChange]);

  return (
    <div className="relative w-full">
      <div className="flex items-center border border-input rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-grow px-3 py-2 min-h-[40px] outline-none text-foreground"
        />
        {filters.length > 0 && (
          <button
            onClick={handleClearFilters}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Popover.Root open={suggestions.length > 0}>
        <Popover.Anchor className="w-full" />
        <Popover.Content className="w-full mt-1 bg-popover border border-border rounded-md shadow-md z-10">
          <AnimatePresence>
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1, delay: index * 0.03 }}
              >
                <button
                  className="w-full text-left px-3 py-2 text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export default DynamicFilterInput;
