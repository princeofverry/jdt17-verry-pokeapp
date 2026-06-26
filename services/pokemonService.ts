import { PokemonDetail, PokemonListResponse } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) {
    throw new Error("Failed to fetch Pokemon list");
  }
  return res.json();
}

export async function fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
  const query = typeof idOrName === "string" ? idOrName.toLowerCase().trim() : idOrName;
  const res = await fetch(`${BASE_URL}/pokemon/${query}`);
  if (!res.ok) {
    throw new Error(`Pokemon not found: ${idOrName}`);
  }
  return res.json();
}

export interface EvolutionDetail {
  min_level?: number;
  trigger?: { name: string; url: string };
  item?: { name: string; url: string };
}

export interface ChainNode {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetail[];
  evolves_to: ChainNode[];
}

export interface EvolutionChainResponse {
  id: number;
  chain: ChainNode;
}

export async function fetchPokemonEvolutionChain(idOrName: string | number): Promise<EvolutionChainResponse> {
  const query = typeof idOrName === "string" ? idOrName.toLowerCase().trim() : idOrName;
  
  // 1. Fetch species data
  const speciesRes = await fetch(`${BASE_URL}/pokemon-species/${query}`);
  if (!speciesRes.ok) {
    throw new Error(`Pokemon species not found: ${idOrName}`);
  }
  const speciesData = await speciesRes.json();
  
  // 2. Fetch the evolution chain
  const chainRes = await fetch(speciesData.evolution_chain.url);
  if (!chainRes.ok) {
    throw new Error(`Failed to fetch evolution chain`);
  }
  return chainRes.json();
}
