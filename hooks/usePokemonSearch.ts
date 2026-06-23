import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPokemonDetail } from "@/services/pokemonService";

export function usePokemonSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const isEnabled = !!debouncedQuery;

  const queryResult = useQuery({
    queryKey: ["pokemonSearch", debouncedQuery],
    queryFn: () => fetchPokemonDetail(debouncedQuery),
    enabled: isEnabled,
    retry: false, // Do not retry on 404 (Pokemon not found)
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  return {
    ...queryResult,
    debouncedQuery,
    isLoading: isEnabled && (queryResult.isLoading || queryResult.isFetching),
    isError: isEnabled && queryResult.isError,
  };
}
