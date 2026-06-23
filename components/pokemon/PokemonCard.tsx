"use client";

import Link from "next/link";
import Image from "next/image";
import { PokemonDetail } from "@/types/pokemon";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PokemonCardProps {
  pokemon: PokemonDetail;
}

export function formatPokemonId(id: number): string {
  if (id < 10) return `#000${id}`;
  if (id < 100) return `#00${id}`;
  if (id < 1000) return `#0${id}`;
  return `#${id}`;
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getTypeStyles = (type: string) => {
  const styles: Record<string, string> = {
    normal: "bg-gray-100 text-gray-800 border-gray-200/40",
    fire: "bg-orange-50 text-orange-700 border-orange-200/40",
    water: "bg-blue-50 text-blue-700 border-blue-200/40",
    electric: "bg-amber-50 text-amber-700 border-amber-200/40",
    grass: "bg-emerald-50 text-emerald-700 border-emerald-200/40",
    ice: "bg-cyan-50 text-cyan-700 border-cyan-200/40",
    fighting: "bg-red-50 text-red-700 border-red-200/40",
    poison: "bg-purple-50 text-purple-700 border-purple-200/40",
    ground: "bg-yellow-50 text-yellow-700 border-yellow-200/40",
    flying: "bg-indigo-50 text-indigo-700 border-indigo-200/40",
    psychic: "bg-pink-50 text-pink-700 border-pink-200/40",
    bug: "bg-lime-50 text-lime-700 border-lime-200/40",
    rock: "bg-stone-50 text-stone-700 border-stone-200/40",
    ghost: "bg-violet-50 text-violet-700 border-violet-200/40",
    dragon: "bg-indigo-100 text-indigo-800 border-indigo-300/40",
    steel: "bg-slate-100 text-slate-700 border-slate-200/40",
    fairy: "bg-rose-50 text-rose-700 border-rose-200/40",
  };
  return (
    styles[type.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200"
  );
};

export function getPokemonImage(pokemon: PokemonDetail): string {
  const animated =
    pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated
      ?.front_default;
  return (
    animated ||
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    "/placeholder-pokemon.png"
  );
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const artwork = getPokemonImage(pokemon);

  return (
    <Link href={`/pokemon/${pokemon.id}`} className="group block outline-none">
      <Card className="h-full overflow-hidden border border-gray-100 hover:-translate-y-0.5 hover:shadow-xs">
        <CardContent className="flex flex-col items-center p-4">
          <div className="relative flex aspect-square w-full items-center justify-center rounded-lg bg-gray-50 p-4 transition-colors group-hover:bg-gray-100/70">
            {artwork && (
              <Image
                src={artwork}
                alt={pokemon.name}
                width={140}
                height={140}
                className="object-contain transition-transform group-hover:scale-105 duration-300"
                priority={pokemon.id <= 10} // Load first page items with priority
                unoptimized // Keep images crisp without next server resize overhead for pokeapi svgs
              />
            )}
            <span className="absolute top-2 right-2 text-[10px] font-bold font-mono text-gray-400 select-none">
              {formatPokemonId(pokemon.id)}
            </span>
          </div>

          <div className="mt-3 w-full text-center sm:text-left">
            <h3 className="font-heading text-sm font-bold text-gray-900 group-hover:text-secondary transition-colors truncate">
              {capitalize(pokemon.name)}
            </h3>

            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-1">
              {pokemon.types.map((t) => (
                <Badge
                  key={t.slot}
                  variant="outline"
                  className={`text-[10px] font-medium py-0 px-2 rounded-md ${getTypeStyles(
                    t.type.name,
                  )}`}
                >
                  {capitalize(t.type.name)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
