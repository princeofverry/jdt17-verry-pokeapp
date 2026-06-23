import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CaughtPokemon } from "@/types/pokemon";

interface PokemonStoreState {
  collection: CaughtPokemon[];
  remainingTickets: number;
  lastResetDate: string;
  
  // Actions
  catchPokemon: (pokemon: CaughtPokemon) => void;
  releasePokemon: (nickname: string) => void;
  useTicket: () => boolean;
  checkAndResetTickets: () => void;
  isNicknameDuplicate: (nickname: string) => boolean;
}

const DAILY_TICKET_LIMIT = 5;

const getTodayDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const usePokemonStore = create<PokemonStoreState>()(
  persist(
    (set, get) => ({
      collection: [],
      remainingTickets: DAILY_TICKET_LIMIT,
      lastResetDate: getTodayDateString(),

      catchPokemon: (pokemon) => {
        set((state) => ({
          collection: [pokemon, ...state.collection],
        }));
      },

      releasePokemon: (nickname) => {
        set((state) => ({
          collection: state.collection.filter(
            (p) => p.nickname.toLowerCase() !== nickname.toLowerCase()
          ),
        }));
      },

      useTicket: () => {
        // Ensure reset check runs before using a ticket
        get().checkAndResetTickets();
        
        const tickets = get().remainingTickets;
        if (tickets <= 0) return false;

        set((state) => ({
          remainingTickets: state.remainingTickets - 1,
        }));
        return true;
      },

      checkAndResetTickets: () => {
        const today = getTodayDateString();
        const lastReset = get().lastResetDate;

        if (today !== lastReset) {
          set({
            remainingTickets: DAILY_TICKET_LIMIT,
            lastResetDate: today,
          });
        }
      },

      isNicknameDuplicate: (nickname) => {
        const trimmed = nickname.trim().toLowerCase();
        return get().collection.some((p) => p.nickname.toLowerCase() === trimmed);
      },
    }),
    {
      name: "pokemon-explorer-storage",
    }
  )
);
