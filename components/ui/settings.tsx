"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { m as motion } from "framer-motion";

const SettingsDialog = () => {
  const { theme, setTheme } = useTheme();

  const themeMapping: Record<string, string> = {
    default: "Dark (Default)",
    dorothy: "Dorothy",
    "dark-dorothy": "Dorothy (Dark)",
    "red-hood": "Red Hood",
    "dark-red-hood": "Red Hood (Dark)",
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Customize your experience with these settings.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <motion.div layout className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="theme" className="text-right">
            Theme
          </Label>
          <Select
            onValueChange={(value) => setTheme(value)}
            defaultValue={theme}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(themeMapping).map(([key, value]) => (
                <SelectItem
                  key={key}
                  value={key}
                  className="hover:cursor-pointer"
                >
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </div>
    </DialogContent>
  );
};

export default SettingsDialog;
