"use client";
import React, { useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCharacterStore } from "@/lib/store/character-store";
import { Rarity, Element, WeaponType, Burst, Manufacturer } from "@/lib/types";
import CharacterCard from "@/components/character-card";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Database } from "@/lib/types/database.types";
import { m as motion, AnimatePresence } from "framer-motion";
import { getMediaURL } from "@/lib/supabase/utils";
import CharacterCardSkeleton from "./skeletons/character-card-skeleton";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Tables } from "@/lib/types/database.types";

const rarities: Rarity[] = ["R", "SR", "SSR"];
const elements: Element[] = ["Iron", "Electric", "Fire", "Wind", "Water"];
const weaponTypes: WeaponType[] = ["AR", "MG", "SMG", "SG", "RL", "SR"];
const bursts: Burst[] = ["1", "2", "3", "Multiple"];
const manufacturers: Manufacturer[] = [
  "Pilgrim",
  "Missilis",
  "Tetra",
  "Elysion",
  "Abnormal",
];

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      className={cn(
        "px-2 py-1 text-xs sm:text-sm font-medium transition-colors rounded-full",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">{title}</h2>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

export default function CharacterContainer({
  nikkes,
}: {
  nikkes: Database["public"]["Tables"]["nikkes"]["Row"][];
}) {
  const {
    characters,
    filteredCharacters,
    setCharacters,
    setFilter,
    selectedRarities,
    setRarities,
    selectedElements,
    setElements,
    selectedWeaponTypes,
    setWeaponTypes,
    selectedBurst,
    setBurst,
    selectedManufacturer,
    setManufacturer,
  } = useCharacterStore();

  const { theme } = useTheme();
  const isDark = theme?.includes("dark") || theme === "default";

  useEffect(() => {
    setCharacters(nikkes as Tables<"nikkes">[]);
  }, [nikkes, setCharacters]);

  const handleFilterChange = (
    setter: (value: any) => void,
    currentValue: any,
    newValue: any
  ) => {
    setter(
      currentValue.includes(newValue)
        ? currentValue.filter((v: any) => v !== newValue)
        : [...currentValue, newValue]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Character List</h2>
      <Card className="mb-8">
        <CardContent className="p-4 sm:p-6">
          <motion.div
            layout
            className="space-y-4"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          >
            <FilterSection title="Rarity">
              {rarities.map((rarity) => (
                <FilterButton
                  key={rarity}
                  active={selectedRarities.includes(rarity)}
                  onClick={() =>
                    handleFilterChange(setRarities, selectedRarities, rarity)
                  }
                >
                  {rarity}
                </FilterButton>
              ))}
            </FilterSection>

            <FilterSection title="Element">
              {elements.map((element) => (
                <FilterButton
                  key={element}
                  active={selectedElements.includes(element)}
                  onClick={() =>
                    handleFilterChange(setElements, selectedElements, element)
                  }
                >
                  <Image
                    src={getMediaURL(
                      `/images/elements/element_${element.toLowerCase()}.webp`
                    )}
                    alt={element}
                    width={16}
                    height={16}
                    className="inline-block mr-1 active:invert"
                  />
                  <span className="hidden sm:inline">{element}</span>
                </FilterButton>
              ))}
            </FilterSection>

            <FilterSection title="Weapon Type">
              {weaponTypes.map((weaponType) => (
                <FilterButton
                  key={weaponType}
                  active={selectedWeaponTypes.includes(weaponType)}
                  onClick={() =>
                    handleFilterChange(
                      setWeaponTypes,
                      selectedWeaponTypes,
                      weaponType
                    )
                  }
                >
                  <Image
                    src={getMediaURL(
                      `/images/weapons/weapon_${weaponType.toLowerCase()}.webp`
                    )}
                    alt={weaponType}
                    width={20}
                    height={20}
                    className={cn("inline-block mr-1", {
                      "filter invert": !isDark,
                    })}
                  />
                  <span className="hidden sm:inline">{weaponType}</span>
                </FilterButton>
              ))}
            </FilterSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Burst</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {selectedBurst || "Select Burst"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Select Burst</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {bursts.map((burst) => (
                      <DropdownMenuCheckboxItem
                        key={burst}
                        checked={selectedBurst === burst}
                        onCheckedChange={() => setBurst(burst)}
                      >
                        {burst}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Manufacturer</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {selectedManufacturer || "Select Manufacturer"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Select Manufacturer</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {manufacturers.map((manufacturer) => (
                      <DropdownMenuCheckboxItem
                        key={manufacturer}
                        checked={selectedManufacturer === manufacturer}
                        onCheckedChange={() => setManufacturer(manufacturer)}
                      >
                        {manufacturer}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Search</h2>
              <Input
                placeholder="Search for a character"
                type="search"
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <motion.div
        layout
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
      >
        <AnimatePresence>
          {filteredCharacters.map((character) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<CharacterCardSkeleton />}>
                <CharacterCard {...character} />
              </Suspense>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
