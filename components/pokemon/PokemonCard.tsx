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
    normal: "bg-[#EAEAEA] text-black border-black",
    fire: "bg-[#FF8B8B] text-black border-black",
    water: "bg-[#85D3FF] text-black border-black",
    electric: "bg-[#FFE485] text-black border-black",
    grass: "bg-[#8CEB9C] text-black border-black",
    ice: "bg-[#A1EBEC] text-black border-black",
    fighting: "bg-[#FF7F7F] text-black border-black",
    poison: "bg-[#D39CFC] text-black border-black",
    ground: "bg-[#F6D38E] text-black border-black",
    flying: "bg-[#C3B6FF] text-black border-black",
    psychic: "bg-[#FFBBE2] text-black border-black",
    bug: "bg-[#C8E285] text-black border-black",
    rock: "bg-[#D2C4A2] text-black border-black",
    ghost: "bg-[#A485E2] text-black border-black",
    dragon: "bg-[#7F7FFF] text-white border-black",
    steel: "bg-[#CFD9DC] text-black border-black",
    fairy: "bg-[#FFC2DA] text-black border-black",
  };
  return (
    styles[type.toLowerCase()] || "bg-white text-black border-black"
  );
};

export const getTypeBorderColor = (type: string) => {
  const styles: Record<string, string> = {
    normal: "border-[#A8A77A]",
    fire: "border-[#EE8130]",
    water: "border-[#6390F0]",
    electric: "border-[#F7D02C]",
    grass: "border-[#7AC74C]",
    ice: "border-[#96D9D6]",
    fighting: "border-[#C22E28]",
    poison: "border-[#A33EA1]",
    ground: "border-[#E2BF65]",
    flying: "border-[#A98FF3]",
    psychic: "border-[#F95587]",
    bug: "border-[#A6B91A]",
    rock: "border-[#B6A136]",
    ghost: "border-[#735797]",
    dragon: "border-[#6F35FC]",
    steel: "border-[#B7B7CE]",
    fairy: "border-[#D685AD]",
  };
  return styles[type.toLowerCase()] || "border-black";
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
  const primaryType = pokemon.types[0]?.type.name || "normal";
  const borderColorClass = getTypeBorderColor(primaryType);

  return (
    <Link href={`/pokemon/${pokemon.id}`} className="group block outline-none">
      <Card className={`h-full overflow-hidden border-4 bg-white shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[7px_7px_0px_#000] transition-all duration-200 ${borderColorClass}`}>
        <CardContent className="flex flex-col items-center p-0">
          <div className="relative flex aspect-square w-full items-center justify-center bg-gray-100 p-4 border-b-3 border-black">
            {artwork && (
              <Image
                src={artwork}
                alt={pokemon.name}
                width={110}
                height={110}
                className="object-contain transition-transform group-hover:scale-105 duration-200 select-none"
                priority={pokemon.id <= 10}
                unoptimized
              />
            )}
            <span className="absolute top-2 right-2 text-[9px] font-black font-mono text-black border-2 border-black bg-white px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000] select-none">
              {formatPokemonId(pokemon.id)}
            </span>
          </div>

          <div className="p-3 w-full text-center sm:text-left bg-white">
            <h3 className="font-heading text-sm font-black text-black group-hover:text-secondary transition-colors truncate">
              {capitalize(pokemon.name)}
            </h3>

            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-1">
              {pokemon.types.map((t) => (
                <Badge
                  key={t.slot}
                  variant="outline"
                  className={`text-[9px] font-black py-0 px-2 rounded border-2 ${getTypeStyles(
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
