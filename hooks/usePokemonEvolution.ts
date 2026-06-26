import { useQuery } from "@tanstack/react-query";
import { fetchPokemonEvolutionChain } from "@/services/pokemonService";

export function usePokemonEvolution(idOrName: string | number) {
  return useQuery({
    queryKey: ["pokemonEvolution", idOrName],
    queryFn: () => fetchPokemonEvolutionChain(idOrName),
    enabled: !!idOrName,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours since evolution structures are static
  });
}
