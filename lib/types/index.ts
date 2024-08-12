import {
  Database,
  GameVersion,
  team_nikke_details,
  teams_with_chapter_votes,
} from "./database.types";

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
  characters: Database["nikkes"][];
  filteredCharacters: Database["nikkes"][];
  filter: string;
  selectedRarities: Rarity[];
  selectedElements: Element[];
  selectedWeaponTypes: WeaponType[];
  selectedBurst?: Burst;
  selectedManufacturer?: Manufacturer;
  setCharacters: (characters: Database["nikkes"][]) => void;
  setFilter: (filter: string) => void;
  setRarities: (rarities: Rarity[]) => void;
  setElements: (elements: Element[]) => void;
  setWeaponTypes: (weaponTypes: WeaponType[]) => void;
  setBurst: (burst?: Burst) => void;
  setManufacturer: (manufacturer?: Manufacturer) => void;
}

export type TeamWithChapterVotes = teams_with_chapter_votes;
export type TeamNikkeDetails = team_nikke_details;
export type TeamWithNikkes = TeamWithChapterVotes & {
  nikkes: TeamNikkeDetails[];
};

export type ChapterData = {
  chapter: Database["chapters"];
  teams: TeamWithNikkes[];
  versions: Database["game_versions"];
  mode: Database["modes"];
};

export type TribeTowerData = {
  tower: Database["tribe_towers"];
  teams: TeamWithNikkes[];
  versions: GameVersion[];
};

export type Difficulty = "normal" | "hard";
export type SortBy = "chapter_number" | "title";

export interface Chapter {
  chapter_number: number;
  difficulty: Difficulty;
  id: string;
  image_path: string;
  mode_id: string | null;
  title: string;
}
