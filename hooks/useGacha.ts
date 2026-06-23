import { useState } from "react";
import { fetchPokemonDetail } from "@/services/pokemonService";
import { usePokemonStore } from "@/stores/pokemonStore";
import { PokemonDetail } from "@/types/pokemon";

// The Pokedex contains 1025 national Pokemon
const MAX_POKEMON_ID = 1025;

export function useGacha() {
  const [rolledPokemon, setRolledPokemon] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { useTicket, remainingTickets } = usePokemonStore();

  const rollPokemon = async (): Promise<PokemonDetail | null> => {
    setIsLoading(true);
    setError(null);
    setRolledPokemon(null);

    try {
      // 1. Try to consume a gacha ticket
      const hasTicket = useTicket();
      if (!hasTicket) {
        throw new Error("No tickets left for today!");
      }

      // 2. Generate a random Pokemon ID
      const randomId = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;

      // 3. Fetch the Pokemon details
      const detail = await fetchPokemonDetail(randomId);
      setRolledPokemon(detail);
      return detail;
    } catch (err: any) {
      const errMsg = err?.message || "Failed to roll Pokemon";
      setError(errMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setRolledPokemon(null);
    setError(null);
  };

  return {
    rollPokemon,
    rolledPokemon,
    isLoading,
    error,
    clearResult,
    remainingTickets,
  };
}
