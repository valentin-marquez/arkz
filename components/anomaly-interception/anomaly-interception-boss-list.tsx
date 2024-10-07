"use client";
import React, { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, ChevronDown } from "lucide-react";
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

interface InterceptionBossCardProps {
  boss: Tables<"bosses">;
}

const InterceptionBossCard: React.FC<InterceptionBossCardProps> = ({
  boss,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
        <div className="relative h-40 sm:h-48">
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
            className="transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="/placeholder-boss.gif"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="font-bold text-lg text-white truncate">
              {boss.name}
            </h2>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            {boss.mode_type && (
              <Badge variant="secondary" className="text-xs">
                {boss.mode_type}
              </Badge>
            )}
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
          {boss.weak_element && (
            <div className="flex items-center space-x-2">
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
        <CardFooter className="p-4 pt-0">
          <Link href={`/anomaly-interception/${boss.slug}`} passHref>
            <Button variant="secondary" className="w-full">
              View Teams
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
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
      <div className="space-y-4 mb-8">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Filter Elements</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <ScrollArea className="h-[200px]">
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
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator className="my-6" />
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
