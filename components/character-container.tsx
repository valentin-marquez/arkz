"use client";
import React, { useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { m as motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { getMediaURL } from "@/lib/supabase/utils";
import SkeletonLoader from "./skeletons/character-card-skeleton";
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

const FilterButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <Button
    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    }`}
    onClick={onClick}
  >
    {children}
  </Button>
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

  useEffect(() => {
    const fetchCharacters = async () => {
      setCharacters(nikkes as Tables<"nikkes">[]);
    };
    fetchCharacters();
  }, [nikkes, setCharacters]);

  const handleBurstChange = (burst: Burst | undefined) => {
    setBurst(selectedBurst === burst ? undefined : burst);
  };

  const handleManufacturerChange = (manufacturer: Manufacturer | undefined) => {
    setManufacturer(
      selectedManufacturer === manufacturer ? undefined : manufacturer
    );
  };

  const isDark =
    theme?.toString().includes("dark") || theme?.toString() === "default"
      ? true
      : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Character List</h1>
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Rarity</h2>
              <div className="flex flex-wrap gap-2">
                {rarities.map((rarity) => (
                  <FilterButton
                    key={rarity}
                    active={selectedRarities.includes(rarity)}
                    onClick={() =>
                      setRarities(
                        selectedRarities.includes(rarity)
                          ? selectedRarities.filter((r) => r !== rarity)
                          : [...selectedRarities, rarity]
                      )
                    }
                  >
                    {rarity}
                  </FilterButton>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Element</h2>
              <div className="flex flex-wrap gap-2">
                {elements.map((element) => (
                  <FilterButton
                    key={element}
                    active={selectedElements.includes(element)}
                    onClick={() =>
                      setElements(
                        selectedElements.includes(element)
                          ? selectedElements.filter((e) => e !== element)
                          : [...selectedElements, element]
                      )
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
                    {element}
                  </FilterButton>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Weapon Type</h2>
              <div className="flex flex-wrap gap-2">
                {weaponTypes.map((weaponType) => (
                  <FilterButton
                    key={weaponType}
                    active={selectedWeaponTypes.includes(weaponType)}
                    onClick={() =>
                      setWeaponTypes(
                        selectedWeaponTypes.includes(weaponType)
                          ? selectedWeaponTypes.filter((w) => w !== weaponType)
                          : [...selectedWeaponTypes, weaponType]
                      )
                    }
                  >
                    <Image
                      src={getMediaURL(
                        `/images/weapons/weapon_${weaponType.toLowerCase()}.webp`
                      )}
                      alt={weaponType}
                      width={24}
                      height={24}
                      className={cn("inline-block mr-1", {
                        "filter invert": !isDark,
                      })}
                    />
                    {weaponType}
                  </FilterButton>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
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
                        className="cursor-pointer"
                        key={burst}
                        checked={selectedBurst === burst}
                        onCheckedChange={() => handleBurstChange(burst)}
                      >
                        {burst}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2 flex-1">
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
                        className="cursor-pointer"
                        key={manufacturer}
                        checked={selectedManufacturer === manufacturer}
                        onCheckedChange={() =>
                          handleManufacturerChange(manufacturer)
                        }
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
          </div>
        </CardContent>
      </Card>
      <motion.div
        layout
        transition={{ type: "spring", bounce: 0.05, duration: 0.25 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      >
        <AnimatePresence>
          {filteredCharacters.map((character) => (
            <div key={character.id}>
              <Suspense fallback={<CharacterCardSkeleton />}>
                <CharacterCard {...character} />
              </Suspense>
            </div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
