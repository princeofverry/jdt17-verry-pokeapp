import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchPokemonList, fetchPokemonDetail } from "@/services/pokemonService";

export function usePokemonList(limit = 20, offset = 0) {
  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
  } = useQuery({
    queryKey: ["pokemonList", limit, offset],
    queryFn: () => fetchPokemonList(limit, offset),
  });

  // Fetch individual pokemon details for items on the current page
  const pokemonQueries = useQueries({
    queries: listData
      ? listData.results.map((pokemon) => ({
          queryKey: ["pokemonDetail", pokemon.name],
          queryFn: () => fetchPokemonDetail(pokemon.name),
          staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours since stats rarely change
        }))
      : [],
  });

  const isLoadingDetails = pokemonQueries.some((q) => q.isLoading);
  const isErrorDetails = pokemonQueries.some((q) => q.isError);

  const pokemonListDetails = pokemonQueries
    .map((q) => q.data)
    .filter((d): d is NonNullable<typeof d> => !!d);

  return {
    pokemonList: pokemonListDetails,
    count: listData?.count || 0,
    hasNext: !!listData?.next,
    hasPrevious: !!listData?.previous,
    isLoading: isListLoading || isLoadingDetails,
    isError: isListError || isErrorDetails,
    error: listError || (isErrorDetails ? new Error("Failed to load details") : null),
  };
}
