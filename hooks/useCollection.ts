import { usePokemonStore } from "@/stores/pokemonStore";
import { CaughtPokemon } from "@/types/pokemon";

export function useCollection() {
  const collection = usePokemonStore((state) => state.collection);
  const catchPokemon = usePokemonStore((state) => state.catchPokemon);
  const releasePokemon = usePokemonStore((state) => state.releasePokemon);
  const isNicknameDuplicate = usePokemonStore((state) => state.isNicknameDuplicate);
  const checkAndResetTickets = usePokemonStore((state) => state.checkAndResetTickets);
  const remainingTickets = usePokemonStore((state) => state.remainingTickets);

  /**
   * Attempts to catch a Pokemon.
   * Returns true (70% probability) for success, or false (30% probability) for failure.
   */
  const attemptCatch = (): boolean => {
    return Math.random() < 0.70;
  };

  /**
   * Save a successfully caught Pokemon to the local collection.
   */
  const savePokemon = (pokemon: Omit<CaughtPokemon, "caughtAt">) => {
    const newCaughtPokemon: CaughtPokemon = {
      ...pokemon,
      caughtAt: new Date().toISOString(),
    };
    catchPokemon(newCaughtPokemon);
  };

  return {
    collection,
    releasePokemon,
    isNicknameDuplicate,
    attemptCatch,
    savePokemon,
    checkAndResetTickets,
    remainingTickets,
  };
}
