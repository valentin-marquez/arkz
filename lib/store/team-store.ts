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
  isNikkeUsed: (nikkeId: string) => boolean;
}

const MAX_TEAMS = 5;
const TEAM_SIZE = 5;

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: Array(MAX_TEAMS).fill(Array(TEAM_SIZE).fill(null)),
  setTeams: (teams) => set({ teams }),
  addNikkeToTeam: (nikke, teamIndex, slotIndex) =>
    set((state) => {
      if (teamIndex >= MAX_TEAMS || state.isNikkeUsed(nikke.id)) {
        return state;
      }
      const newTeams = state.teams.map((team, index) =>
        index === teamIndex
          ? team.map((slot, idx) => (idx === slotIndex ? nikke : slot))
          : team
      );
      return { teams: newTeams };
    }),
  removeNikkeFromTeam: (teamIndex, slotIndex) =>
    set((state) => {
      const newTeams = state.teams.map((team, index) =>
        index === teamIndex
          ? team.map((slot, idx) => (idx === slotIndex ? null : slot))
          : team
      );
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
  isNikkeUsed: (nikkeId: string) => {
    const state = get();
    return state.teams.some((team) =>
      team.some((nikke) => nikke && nikke.id === nikkeId)
    );
  },
}));
