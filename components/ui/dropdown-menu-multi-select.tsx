"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

interface DropdownMenuMultiSelectProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

export function DropdownMenuMultiSelect({
  label,
  options,
  selectedOptions,
  onChange,
}: DropdownMenuMultiSelectProps) {
  const handleToggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((o) => o !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  const handleClear = () => {
    onChange([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selectedOptions.includes(option)}
            onCheckedChange={() => handleToggleOption(option)}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <Button
          className="w-full px-2"
          variant={"secondary"}
          size={"sm"}
          onClick={handleClear}
        >
          Clear
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
