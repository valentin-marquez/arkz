import { Tables } from "./database.types";

export type Rarity = "R" | "SR" | "SSR";
export type Element = "Iron" | "Electric" | "Fire" | "Wind" | "Water";
export type WeaponType = "AR" | "MG" | "SMG" | "SG" | "RL" | "SR";
export type Burst = "1" | "2" | "3" | "Multiple";
export type Manufacturer =
  | "Pilgrim"
  | "Missilis"
  | "Tetra"
  | "Elysion"
  | "Abnormal";
export interface CharacterState {
  characters: Tables<"nikkes">[];
  filteredCharacters: Tables<"nikkes">[];
  filter: string;
  selectedRarities: Rarity[];
  selectedElements: Element[];
  selectedWeaponTypes: WeaponType[];
  selectedBurst?: Burst;
  selectedManufacturer?: Manufacturer;
  setCharacters: (characters: Tables<"nikkes">[]) => void;
  setFilter: (filter: string) => void;
  setRarities: (rarities: Rarity[]) => void;
  setElements: (elements: Element[]) => void;
  setWeaponTypes: (weaponTypes: WeaponType[]) => void;
  setBurst: (burst?: Burst) => void;
  setManufacturer: (manufacturer?: Manufacturer) => void;
}

export type Difficulty = "normal" | "hard";
export type SortBy = "chapter_number" | "title";
