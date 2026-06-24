"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, Trophy, Trash2, ExternalLink, ShieldAlert, CircleDot } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { CaughtPokemon } from "@/types/pokemon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { capitalize, getTypeStyles, getTypeBorderColor } from "./PokemonCard";

export default function PokemonCollectionView() {
  const { collection, releasePokemon } = useCollection();
  const [mounted, setMounted] = useState(false);
  
  const [selectedPokemon, setSelectedPokemon] = useState<CaughtPokemon | null>(null);
  const [showConfirmRelease, setShowConfirmRelease] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReleaseClick = (pokemon: CaughtPokemon) => {
    setSelectedPokemon(pokemon);
    setShowConfirmRelease(true);
  };

  const handleConfirmRelease = () => {
    if (!selectedPokemon) return;
    releasePokemon(selectedPokemon.nickname);
    setShowConfirmRelease(false);
    toast.success(`${selectedPokemon.nickname} has been released into the wild.`);
    setSelectedPokemon(null);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12 flex-1 flex flex-col items-center justify-center">
        <CircleDot className="h-8 w-8 text-gray-300 animate-spin-slow" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 flex-1 flex flex-col">
      {/* Title Header */}
      <div className="mb-8 text-center sm:text-left select-none">
        <h1 className="font-heading text-3xl font-black tracking-tight text-black sm:text-4xl flex items-center justify-center sm:justify-start gap-2.5 uppercase">
          <Trophy className="h-7 w-7 text-black" />
          MY POKEMON COLLECTION
        </h1>
        <p className="mt-2 text-sm font-bold text-gray-700">
          Manage your caught team, view stats, or release Pokemon back into the wild.
        </p>
      </div>

      {collection.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 flex-1 items-start">
          {collection.map((pokemon) => {
            const primaryType = pokemon.types[0] || "normal";
            const borderColorClass = getTypeBorderColor(primaryType);
            return (
              <Card key={`${pokemon.id}-${pokemon.nickname}`} className={`group overflow-hidden border-4 bg-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[7px_7px_0px_#000] transition-all duration-200 ${borderColorClass}`}>
                <CardContent className="flex flex-col items-center p-0">
                {/* Artwork Area */}
                <div className="relative flex aspect-square w-full items-center justify-center bg-gray-100 p-4 border-b-3 border-black">
                  {pokemon.image ? (
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={100}
                      height={100}
                      className="object-contain transition-transform group-hover:scale-105 duration-200 select-none"
                      unoptimized
                    />
                  ) : (
                    <div className="h-[100px] w-[100px] bg-white border-2 border-black rounded-lg flex items-center justify-center text-black font-black">
                      N/A
                    </div>
                  )}
                  <span className="absolute top-2 right-2 text-[9px] font-black font-mono text-black border-2 border-black bg-white px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000] select-none">
                    #{pokemon.id}
                  </span>
                </div>

                {/* Nickname & Species */}
                <div className="p-3 w-full text-center bg-white">
                  <h3 className="font-heading text-sm font-black text-black truncate">
                    {pokemon.nickname}
                  </h3>
                  <p className="text-[9px] text-gray-500 font-extrabold tracking-wider uppercase mt-0.5 truncate">
                    {capitalize(pokemon.name)}
                  </p>

                  {/* Types */}
                  <div className="mt-2.5 flex flex-wrap justify-center gap-1 select-none">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className={`text-[9px] font-black py-0 px-1.5 rounded border-2 ${getTypeStyles(
                          type
                        )}`}
                      >
                        {capitalize(type)}
                      </Badge>
                    ))}
                  </div>

                  {/* Date details */}
                  <p className="mt-2 text-[9px] font-bold text-gray-500 select-none">
                    Caught on {formatDate(pokemon.caughtAt)}
                  </p>

                  {/* Card Actions */}
                  <div className="mt-4 flex gap-1.5 w-full justify-center items-center">
                    <Link
                      href={`/pokemon/${pokemon.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 text-[10px] font-black border-2 border-black rounded-lg text-black bg-[#6ECBF5] shadow-[2px_2px_0px_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer select-none"
                    >
                      <ExternalLink className="h-3 w-3" />
                      STATS
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => handleReleaseClick(pokemon)}
                      className="h-8 w-8 p-0 flex items-center justify-center border-2 border-black rounded-lg cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-y-[1px] transition-all text-white select-none shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      ) : (
        // Empty State Collection
        <div className="py-12 flex flex-col items-center justify-center text-center select-none bg-white border-4 border-black shadow-[6px_6px_0px_#000] rounded-xl p-8 max-w-md mx-auto my-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD93D] text-black border-2 border-black shadow-[2px_2px_0px_#000] mb-6">
            <Trophy className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-xl font-black text-black">Your collection is empty</h3>
          <p className="mt-2 text-sm font-bold text-gray-700 max-w-xs">
            You haven&rsquo;t caught any Pokemon yet. Go to Pokedex or Gacha Roll to expand your collection!
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full font-black h-10 cursor-pointer shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000]">
                <Compass className="h-4 w-4 mr-1 text-black" />
                Go to Pokedex
              </Button>
            </Link>
            <Link href="/gacha" className="flex-1">
              <Button className="w-full font-black h-10 bg-[#FFD93D] text-black hover:bg-[#FFD93D] border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000]">
                <Trophy className="h-4 w-4 mr-1 text-black" />
                Gacha Roll
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Release Confirmation Dialog */}
      <Dialog open={showConfirmRelease} onOpenChange={setShowConfirmRelease}>
        <DialogContent className="max-w-sm w-[95%] sm:w-full rounded-xl border-4 border-black shadow-[8px_8px_0px_#000] bg-white p-6">
          <DialogHeader>
            <DialogTitle className="font-heading font-black text-lg text-black flex items-center gap-1.5 select-none uppercase">
              <ShieldAlert className="h-5 w-5 text-[#FF4D4D]" />
              Release Pokemon?
            </DialogTitle>
            <DialogDescription className="text-gray-700 font-bold text-sm">
              Are you sure you want to release <span className="font-black text-black">{selectedPokemon?.nickname}</span> the <span className="font-black text-black">{selectedPokemon ? capitalize(selectedPokemon.name) : ""}</span> back into the wild? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-row gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmRelease(false)}
              className="flex-1 font-black rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-y-0.5 transition-all bg-white text-black select-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRelease}
              className="flex-1 font-black rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-y-0.5 transition-all bg-[#FF4D4D] text-white select-none"
            >
              Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
