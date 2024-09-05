"use client";
import React, { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, ChevronDown, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMediaURL } from "@/lib/supabase/utils";
import { Tables } from "@/lib/types/database.types";

interface SoloRaidSeasonCardProps {
  season: Tables<"solo_raid_seasons"> & { boss: Tables<"bosses"> };
}

const SoloRaidSeasonCard: React.FC<SoloRaidSeasonCardProps> = ({ season }) => {
  const isActive =
    new Date(season.start_date) <= new Date() &&
    new Date(season.end_date) >= new Date();
  const isFuture = new Date(season.start_date) > new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background z-10" />
        <div className="relative h-80">
          <Image
            src={
              season.boss.image_url
                ? getMediaURL(season.boss.image_url)
                : "/placeholder-boss.gif"
            }
            alt={season.boss.name}
            layout="fill"
            objectFit="contain"
            className="transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="/placeholder-boss.gif"
          />
        </div>
        <CardContent className="p-6 relative z-20">
          <div className="flex items-center justify-between mb-4">
            <Badge
              variant={
                isActive ? "default" : isFuture ? "secondary" : "outline"
              }
              className="text-xs"
            >
              {isActive ? "Active" : isFuture ? "Upcoming" : "Ended"}
            </Badge>
            {season.boss.element && (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary p-1 flex items-center justify-center">
                <Image
                  src={`/Images/element/element_${season.boss.element.toLowerCase()}.webp`}
                  alt={season.boss.element}
                  width={20}
                  height={20}
                />
              </div>
            )}
          </div>
          <h2 className="font-bold text-2xl mb-2 text-primary">
            {season.name}
          </h2>
          <p className="text-lg font-semibold mb-4 text-neutral">
            Boss: {season.boss.name}
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Starts: {new Date(season.start_date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              Ends: {new Date(season.end_date).toLocaleDateString()}
            </div>
          </div>
          {season.boss.weak_element && (
            <div className="mt-4 flex items-center">
              <span className="text-sm text-muted-foreground mr-2">
                Weak against:
              </span>
              <div className="w-6 h-6 rounded-full overflow-hidden bg-secondary border-2 border-destructive">
                <Image
                  src={`/Images/element/element_${season.boss.weak_element.toLowerCase()}.webp`}
                  alt={season.boss.weak_element}
                  width={24}
                  height={24}
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-6 pt-0 relative z-20">
          <Link href={`/solo-raid/${season.slug}`} passHref className="w-full">
            <Button variant="secondary" className="w-full">
              View Teams
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

interface SoloRaidSeasonsListProps {
  initialSeasons: (Tables<"solo_raid_seasons"> & { boss: Tables<"bosses"> })[];
}

const SoloRaidSeasonsList: React.FC<SoloRaidSeasonsListProps> = ({
  initialSeasons,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const uniqueElements = Array.from(
    new Set(initialSeasons.map((season) => season.boss.element).filter(Boolean))
  );

  const filteredSeasons = initialSeasons.filter(
    (season) =>
      season.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedElements.length === 0 ||
        (season.boss.element &&
          selectedElements.includes(season.boss.element))) &&
      (statusFilter.length === 0 ||
        (statusFilter.includes("Active") &&
          new Date(season.start_date) <= new Date() &&
          new Date(season.end_date) >= new Date()) ||
        (statusFilter.includes("Upcoming") &&
          new Date(season.start_date) > new Date()) ||
        (statusFilter.includes("Ended") &&
          new Date(season.end_date) < new Date()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search seasons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-between"
            >
              <Filter className="mr-2 h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <ScrollArea className="h-[300px]">
              <div className="p-2">
                <h4 className="mb-2 font-semibold">Status</h4>
                {["Active", "Upcoming", "Ended"].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) =>
                      setStatusFilter(
                        checked
                          ? [...statusFilter, status]
                          : statusFilter.filter((s) => s !== status)
                      )
                    }
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
                <Separator className="my-2" />
                <h4 className="mb-2 font-semibold">Elements</h4>
                {uniqueElements.map((element) => (
                  <DropdownMenuCheckboxItem
                    key={element}
                    checked={selectedElements.includes(element)}
                    onCheckedChange={(checked) =>
                      setSelectedElements(
                        checked
                          ? [...selectedElements, element]
                          : selectedElements.filter((e) => e !== element)
                      )
                    }
                  >
                    {element}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredSeasons.map((season) => (
            <SoloRaidSeasonCard key={season.id} season={season} />
          ))}
        </AnimatePresence>
      </motion.div>
      {filteredSeasons.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground mt-8"
        >
          No seasons found. Try different search terms or filters.
        </motion.p>
      )}
    </div>
  );
};

export default SoloRaidSeasonsList;
