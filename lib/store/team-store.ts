import { create } from "zustand";
import { Database } from "@/lib/types/database.types";

type Nikke = Database["public"]["Tables"]["nikkes"]["Row"];

type Team = (Nikke | null)[];
type Teams = Team[];

interface TeamState {
  teams: Teams;
  setTeams: (teams: Teams) => void;
  addNikkeToTeam: (nikke: Nikke, teamIndex: number, slotIndex: number) => void;
  removeNikkeFromTeam: (teamIndex: number, slotIndex: number) => void;
  moveNikkeWithinTeam: (
    teamIndex: number,
    fromIndex: number,
    toIndex: number
  ) => void;
  moveNikkeBetweenTeams: (
    fromTeamIndex: number,
    fromSlotIndex: number,
    toTeamIndex: number,
    toSlotIndex: number
  ) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  teams: [],
  setTeams: (teams) => set({ teams }),
  addNikkeToTeam: (nikke, teamIndex, slotIndex) =>
    set((state) => {
      const newTeams = [...state.teams];
      newTeams[teamIndex][slotIndex] = nikke;
      return { teams: newTeams };
    }),
  removeNikkeFromTeam: (teamIndex, slotIndex) =>
    set((state) => {
      const newTeams = [...state.teams];
      newTeams[teamIndex][slotIndex] = null;
      return { teams: newTeams };
    }),
  moveNikkeWithinTeam: (teamIndex, fromIndex, toIndex) =>
    set((state) => {
      const newTeams = [...state.teams];
      const team = [...newTeams[teamIndex]];
      const [movedNikke] = team.splice(fromIndex, 1);
      team.splice(toIndex, 0, movedNikke);
      newTeams[teamIndex] = team;
      return { teams: newTeams };
    }),
  moveNikkeBetweenTeams: (
    fromTeamIndex,
    fromSlotIndex,
    toTeamIndex,
    toSlotIndex
  ) =>
    set((state) => {
      const newTeams = state.teams.map((team) => [...team]);
      const movedNikke = newTeams[fromTeamIndex][fromSlotIndex];
      newTeams[fromTeamIndex][fromSlotIndex] = null;
      newTeams[toTeamIndex][toSlotIndex] = movedNikke;
      return { teams: newTeams };
    }),
}));
