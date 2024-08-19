"use client";
import React, { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMediaURL } from "@/lib/supabase/utils";
import { Tables } from "@/lib/types/database.types";

interface InterceptionBossCardProps {
  boss: Tables<"bosses">;
}

const InterceptionBossCard: React.FC<InterceptionBossCardProps> = ({
  boss,
}) => {
  return (
    <Link href={`/interception/${boss.slug}`} passHref>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full cursor-pointer"
      >
        <Card className="overflow-hidden h-full transition-all duration-300 group hover:shadow-lg hover:scale-105">
          <div className="relative h-48">
            <Image
              src={
                boss.image_url
                  ? getMediaURL(boss.image_url)
                  : "/placeholder-boss.gif"
              }
              alt={boss.name}
              layout="fill"
              objectFit="cover"
              objectPosition="center top"
              className="transition-transform duration-300"
              placeholder="blur"
              blurDataURL="/placeholder-boss.gif"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-lg text-white truncate flex-grow">
                  {boss.name}
                </h2>
                {boss.element && (
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-secondary">
                    <Image
                      src={`/Images/element/element_${boss.element.toLowerCase()}.webp`}
                      alt={boss.element}
                      width={24}
                      height={24}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            {boss.mode_type && (
              <Badge
                variant="secondary"
                className="text-xs text-secondary-foreground"
              >
                {boss.mode_type}
              </Badge>
            )}
            {boss.weak_element && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Weak against:
                </span>
                <div className="w-4 h-4 rounded-full overflow-hidden bg-secondary border-2 border-destructive">
                  <Image
                    src={`/Images/element/element_${boss.weak_element.toLowerCase()}.webp`}
                    alt={boss.weak_element}
                    width={16}
                    height={16}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

interface InterceptionBossListProps {
  initialBosses: Tables<"bosses">[];
}

const InterceptionBossList: React.FC<InterceptionBossListProps> = ({
  initialBosses,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  const uniqueElements = Array.from(
    new Set(initialBosses.map((boss) => boss.element).filter(Boolean))
  );

  const filteredBosses = initialBosses.filter(
    (boss) =>
      boss.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedElements.length === 0 ||
        (boss.element && selectedElements.includes(boss.element)))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4 flex flex-row w-full">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search bosses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </div>
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-xs sm:text-sm">
                <Filter className="mr-2 h-4 w-4" /> Filter Elements
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredBosses.map((boss) => (
            <InterceptionBossCard key={boss.id} boss={boss} />
          ))}
        </AnimatePresence>
      </motion.div>
      {filteredBosses.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground mt-8"
        >
          No bosses found. Try different search terms or filters.
        </motion.p>
      )}
    </div>
  );
};

export default InterceptionBossList;
