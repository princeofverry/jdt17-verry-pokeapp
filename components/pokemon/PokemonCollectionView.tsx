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
import { capitalize, getTypeStyles } from "./PokemonCard";

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
        <h1 className="font-heading text-2xl font-black tracking-tight text-gray-900 sm:text-3xl flex items-center justify-center sm:justify-start gap-2">
          <Trophy className="h-7 w-7 text-secondary" />
          My Pokemon Collection
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your caught team, view stats, or release Pokemon back into the wild.
        </p>
      </div>

      {collection.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 flex-1 items-start">
          {collection.map((pokemon) => (
            <Card key={`${pokemon.id}-${pokemon.nickname}`} className="group overflow-hidden border border-gray-100 bg-white hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200">
              <CardContent className="flex flex-col items-center p-4">
                {/* Artwork Area */}
                <div className="relative flex aspect-square w-full items-center justify-center rounded-lg bg-gray-50 p-4 transition-colors group-hover:bg-gray-100/70">
                  {pokemon.image ? (
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={120}
                      height={120}
                      className="object-contain transition-transform group-hover:scale-105 duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="h-[120px] w-[120px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      N/A
                    </div>
                  )}
                  <span className="absolute top-2 right-2 text-[9px] font-bold font-mono text-gray-400 select-none">
                    #{pokemon.id}
                  </span>
                </div>

                {/* Nickname & Species */}
                <div className="mt-3 w-full text-center">
                  <h3 className="font-heading text-sm font-black text-gray-900 truncate">
                    {pokemon.nickname}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-0.5 truncate">
                    {capitalize(pokemon.name)}
                  </p>

                  {/* Types */}
                  <div className="mt-2 flex flex-wrap justify-center gap-1 select-none">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className={`text-[9px] font-bold py-0 px-1.5 rounded-sm ${getTypeStyles(
                          type
                        )}`}
                      >
                        {capitalize(type)}
                      </Badge>
                    ))}
                  </div>

                  {/* Date details */}
                  <p className="mt-2 text-[10px] text-gray-500 font-medium font-sans select-none">
                    Caught on {formatDate(pokemon.caughtAt)}
                  </p>

                  {/* Card Actions */}
                  <div className="mt-4 flex gap-1.5 w-full">
                    <Link
                      href={`/pokemon/${pokemon.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 h-7 text-[10px] font-bold border border-gray-150 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer select-none"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Stats
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => handleReleaseClick(pokemon)}
                      className="h-7 w-7 p-0 flex items-center justify-center rounded-lg cursor-pointer shadow-xs select-none"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Empty State Collection
        <div className="py-16 flex flex-col items-center justify-center text-center flex-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-4 select-none">
            <Trophy className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="font-heading text-base font-bold text-gray-900">Your collection is empty</h3>
          <p className="mt-1 text-sm text-gray-600 max-w-xs">
            You haven&rsquo;t caught any Pokemon yet. Go to Pokedex or Gacha Roll to expand your collection!
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/">
              <Button variant="outline" className="px-5 font-bold h-9 cursor-pointer">
                <Compass className="h-4 w-4 mr-1 text-gray-600" />
                Go to Pokedex
              </Button>
            </Link>
            <Link href="/gacha">
              <Button className="px-5 font-bold h-9 bg-primary text-gray-900 hover:bg-primary/95 border border-primary/20 cursor-pointer">
                <Trophy className="h-4 w-4 mr-1 text-gray-900" />
                Gacha Roll
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Release Confirmation Dialog */}
      <Dialog open={showConfirmRelease} onOpenChange={setShowConfirmRelease}>
        <DialogContent className="max-w-sm w-[90%] sm:w-full rounded-2xl border border-gray-100">
          <DialogHeader>
            <DialogTitle className="font-heading font-black text-lg text-gray-900 flex items-center gap-1.5 select-none">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              Release Pokemon?
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Are you sure you want to release <span className="font-bold text-gray-900">{selectedPokemon?.nickname}</span> the <span className="font-bold text-gray-900">{selectedPokemon ? capitalize(selectedPokemon.name) : ""}</span> back into the wild? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-row gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmRelease(false)}
              className="flex-1 font-semibold rounded-lg hover:bg-gray-50 cursor-pointer select-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRelease}
              className="flex-1 font-bold rounded-lg cursor-pointer shadow-xs select-none"
            >
              Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
