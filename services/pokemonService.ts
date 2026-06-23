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
