"use client";
import React, { useState, useCallback } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FixedSizeList } from "react-window";
import { getMediaURL } from "@/lib/supabase/utils";
import { useTheme } from "next-themes";

type TowerCardProps = {
  id: string;
  name: string;
  manufacturer: string;
  maxFloors: number;
  availableDays: string[];
  isAvailable: boolean;
};

const TowerCard: React.FC<TowerCardProps> = ({
  id,
  name,
  manufacturer,
  maxFloors,
  availableDays,
  isAvailable,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const router = useRouter();
  const { theme } = useTheme();

  const handleCardClick = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleFloorSelect = useCallback((value: string) => {
    setSelectedFloor(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedFloor) {
      router.push(`/tribe/${manufacturer}/${selectedFloor}`);
    }
  }, [selectedFloor, manufacturer, router]);

  const renderSelectItem = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <SelectItem key={index + 1} value={(index + 1).toString()} style={style}>
        Floor {index + 1}
      </SelectItem>
    ),
    []
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
      className="h-full"
    >
      <Card
        className="relative h-full overflow-hidden bg-gradient-to-b from-background to-secondary/10 dark:from-secondary dark:to-background border-2 border-secondary hover:border-primary transition-colors duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-primary dark:text-primary-foreground">
              {name}
            </h2>
            <Badge
              variant={isAvailable ? "default" : "secondary"}
              className="text-xs"
            >
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>

          <div className="flex-grow flex items-center justify-center my-4">
            {manufacturer !== "all" ? (
              <Image
                // src={`/Images/Manufacturers/manufacturer_${manufacturer.toLowerCase()}.webp`}
                src={getMediaURL(
                  `/images/manufacturers/manufacturer_${manufacturer.toLowerCase()}.webp`
                )}
                alt={`${manufacturer} logo`}
                width={100}
                height={100}
                className={`rounded-full
                  ${
                    // estos son los estilos dark mode
                    theme === "default" ||
                    theme === "dark-dorothy" ||
                    theme === "dark-red-hood"
                      ? ""
                      : "filter invert"
                  }`}
              />
            ) : (
              <div className="text-4xl font-bold text-primary dark:text-primary-foreground">
                All Manufacturers
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2 mt-0">
              Manufacturer:{" "}
              <span className="font-semibold text-foreground dark:text-primary-foreground">
                {manufacturer}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mb-2 mt-0">
              Max Floors:{" "}
              <span className="font-semibold text-foreground dark:text-primary-foreground">
                {maxFloors}
              </span>
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {availableDays.map((day) => (
                <Badge key={day} variant="outline" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  type: "spring",
                  bounce: 0.05,
                  duration: 0.3,
                }}
                className="mt-4"
              >
                <Select onValueChange={handleFloorSelect} value={selectedFloor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <FixedSizeList
                      height={200}
                      itemCount={maxFloors}
                      itemSize={35}
                      width="100%"
                    >
                      {renderSelectItem}
                    </FixedSizeList>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleSubmit}
                  className="w-full mt-2"
                  disabled={!selectedFloor}
                >
                  View Teams
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TowerCard;
