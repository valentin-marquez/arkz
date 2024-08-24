import { create } from "zustand";
import {
  CharacterState,
  Rarity,
  Element,
  WeaponType,
  Burst,
  Manufacturer,
} from "@/lib/types";
import { Tables } from "../types/database.types";

const applyFilters = (state: CharacterState): Tables<"nikkes">[] => {
  return state.characters.filter((character) => {
    const matchesFilter = character.name
      .toLowerCase()
      .includes(state.filter.toLowerCase());
    const matchesRarity =
      state.selectedRarities.length === 0 ||
      state.selectedRarities.includes(character.rarity as Rarity);
    const matchesElement =
      state.selectedElements.length === 0 ||
      state.selectedElements.includes(character.element as Element);
    const matchesWeaponType =
      state.selectedWeaponTypes.length === 0 ||
      state.selectedWeaponTypes.includes(character.weapon_type as WeaponType);
    const matchesBurst =
      !state.selectedBurst ||
      state.selectedBurst === character.burst ||
      (state.selectedBurst === "Multiple" && character.burst === "p");
    const matchesManufacturer =
      !state.selectedManufacturer ||
      state.selectedManufacturer === character.manufacturer;

    return (
      matchesFilter &&
      matchesRarity &&
      matchesElement &&
      matchesWeaponType &&
      matchesBurst &&
      matchesManufacturer
    );
  });
};

export const useCharacterStore = create<CharacterState>((set) => ({
  characters: [],
  filteredCharacters: [],
  filter: "",
  selectedRarities: [],
  selectedElements: [],
  selectedWeaponTypes: [],
  selectedBurst: undefined,
  selectedManufacturer: undefined,
  setCharacters: (characters) =>
    set((state) => ({
      characters,
      filteredCharacters: applyFilters({ ...state, characters }),
    })),
  setFilter: (filter) =>
    set((state) => ({
      filter,
      filteredCharacters: applyFilters({ ...state, filter }),
    })),
  setRarities: (rarities) =>
    set((state) => ({
      selectedRarities: rarities,
      filteredCharacters: applyFilters({
        ...state,
        selectedRarities: rarities,
      }),
    })),
  setElements: (elements) =>
    set((state) => ({
      selectedElements: elements,
      filteredCharacters: applyFilters({
        ...state,
        selectedElements: elements,
      }),
    })),
  setWeaponTypes: (weaponTypes) =>
    set((state) => ({
      selectedWeaponTypes: weaponTypes,
      filteredCharacters: applyFilters({
        ...state,
        selectedWeaponTypes: weaponTypes,
      }),
    })),
  setBurst: (burst) =>
    set((state) => ({
      selectedBurst: burst,
      filteredCharacters: applyFilters({ ...state, selectedBurst: burst }),
    })),
  setManufacturer: (manufacturer) =>
    set((state) => ({
      selectedManufacturer: manufacturer,
      filteredCharacters: applyFilters({
        ...state,
        selectedManufacturer: manufacturer,
      }),
    })),
}));
