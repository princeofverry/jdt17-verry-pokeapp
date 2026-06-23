import { useQuery } from "@tanstack/react-query";
import { fetchPokemonDetail } from "@/services/pokemonService";

export function usePokemonDetail(idOrName: string | number) {
  return useQuery({
    queryKey: ["pokemonDetail", idOrName],
    queryFn: () => fetchPokemonDetail(idOrName),
    enabled: !!idOrName,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours since stats are static
  });
}
