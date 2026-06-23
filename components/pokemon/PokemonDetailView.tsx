"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Sparkles, Scale, Ruler, CheckCircle, ShieldAlert, Award } from "lucide-react";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { useCollection } from "@/hooks/useCollection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatPokemonId, capitalize, getTypeStyles, getPokemonImage } from "./PokemonCard";

import { use } from "react";

interface PokemonDetailViewProps {
  params: Promise<{ id: string }>;
}

export default function PokemonDetailView({ params }: PokemonDetailViewProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: pokemon, isLoading, error } = usePokemonDetail(id);
  const { attemptCatch, savePokemon, isNicknameDuplicate, checkAndResetTickets, remainingTickets } = useCollection();

  const [isCatching, setIsCatching] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  // Re-check ticket limits
  useEffect(() => {
    checkAndResetTickets();
  }, [checkAndResetTickets]);

  // Form Validation Schema using Zod
  const nicknameSchema = z.object({
    nickname: z
      .string()
      .trim()
      .min(1, "Nickname is required")
      .max(20, "Nickname must be 20 characters or less")
      .refine(
        (val) => !isNicknameDuplicate(val),
        { message: "This nickname is already in your collection!" }
      ),
  });

  type NicknameFormValues = z.infer<typeof nicknameSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NicknameFormValues>({
    resolver: zodResolver(nicknameSchema),
    defaultValues: { nickname: "" },
  });

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !pokemon) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="font-heading text-lg font-bold text-gray-900">Failed to load Pokemon</h3>
        <p className="mt-1 text-sm text-gray-600">
          The Pokemon may not exist or network connectivity is unstable.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => router.push("/")}>
          Back to Pokedex
        </Button>
      </div>
    );
  }

  const artwork = getPokemonImage(pokemon);

  // Stat styling names mapping
  const statLabelMap: Record<string, string> = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SP. ATK",
    "special-defense": "SP. DEF",
    speed: "SPD",
  };

  // Stats max estimation for gauge bars
  const statMaxMap: Record<string, number> = {
    hp: 255,
    attack: 190,
    defense: 230,
    "special-attack": 194,
    "special-defense": 230,
    speed: 180,
  };

  const handleCatchAction = async () => {
    setIsCatching(true);
    // Add micro timeout for button feedback suspense feel
    setTimeout(() => {
      const caught = attemptCatch();
      setIsCatching(false);

      if (caught) {
        toast.success(`Success! You caught ${capitalize(pokemon.name)}!`);
        setShowNicknameModal(true);
      } else {
        toast.error(`Oh no! ${capitalize(pokemon.name)} escaped.`);
      }
    }, 1000);
  };

  const onSaveNickname = (values: NicknameFormValues) => {
    savePokemon({
      id: pokemon.id,
      name: pokemon.name,
      nickname: values.nickname,
      image: artwork,
      types: pokemon.types.map((t) => t.type.name),
    });
    setShowNicknameModal(false);
    reset();
    toast.success(`${values.nickname} has been saved to your collection!`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 flex-1">
      {/* Back navigation */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors mb-6 group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Pokedex
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Card: Artwork & Primary details */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 p-8 shadow-xs">
            {artwork && (
              <Image
                src={artwork}
                alt={pokemon.name}
                width={240}
                height={240}
                className="object-contain drop-shadow-md select-none"
                priority
                unoptimized
              />
            )}
            <span className="absolute top-4 right-4 text-xs font-black font-mono text-gray-400">
              {formatPokemonId(pokemon.id)}
            </span>
          </div>

          <h1 className="mt-4 font-heading text-2xl font-black text-gray-900 tracking-tight text-center">
            {capitalize(pokemon.name)}
          </h1>

          <div className="mt-2 flex gap-1.5 justify-center">
            {pokemon.types.map((t) => (
              <Badge
                key={t.slot}
                variant="outline"
                className={`text-xs py-0.5 px-3 rounded-lg font-bold border ${getTypeStyles(t.type.name)}`}
              >
                {capitalize(t.type.name)}
              </Badge>
            ))}
          </div>

          {/* Catch Button */}
          <Button
            onClick={handleCatchAction}
            disabled={isCatching}
            className="mt-6 w-full py-5 rounded-xl font-bold bg-primary text-gray-900 hover:bg-primary/95 shadow-md flex items-center justify-center gap-2 cursor-pointer border border-primary/20"
          >
            <Sparkles className="h-4 w-4 text-gray-900 animate-pulse" />
            {isCatching ? "Throwing Pokeball..." : `Catch ${capitalize(pokemon.name)}`}
          </Button>
        </div>

        {/* Right Info: Stats, Physical properties, Abilities & Moves */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Card 1: Physical properties */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="font-heading text-sm font-black text-gray-900 tracking-wide uppercase mb-4 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-secondary" />
              Information
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-100">
              <div className="flex flex-col items-center">
                <Ruler className="h-4 w-4 text-gray-400 mb-1" />
                <span className="text-xs text-gray-600">Height</span>
                <span className="text-sm font-extrabold text-gray-900 mt-0.5 font-mono">
                  {pokemon.height / 10} m
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Scale className="h-4 w-4 text-gray-400 mb-1" />
                <span className="text-xs text-gray-600">Weight</span>
                <span className="text-sm font-extrabold text-gray-900 mt-0.5 font-mono">
                  {pokemon.weight / 10} kg
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Sparkles className="h-4 w-4 text-gray-400 mb-1" />
                <span className="text-xs text-gray-600">Base Exp</span>
                <span className="text-sm font-extrabold text-gray-900 mt-0.5 font-mono">
                  {pokemon.base_experience || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Stats */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="font-heading text-sm font-black text-gray-900 tracking-wide uppercase mb-4">
              Base Stats
            </h2>
            <div className="flex flex-col gap-3">
              {pokemon.stats.map((s) => {
                const label = statLabelMap[s.stat.name] || s.stat.name.toUpperCase();
                const max = statMaxMap[s.stat.name] || 200;
                const percentage = Math.min(100, Math.round((s.base_stat / max) * 100));

                return (
                  <div key={s.stat.name} className="grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-3 text-[10px] font-black text-gray-500 tracking-wider">
                      {label}
                    </span>
                    <span className="col-span-1.5 text-xs font-bold text-gray-900 text-right font-mono pr-2">
                      {s.base_stat}
                    </span>
                    <div className="col-span-7.5 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary transition-all duration-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Abilities */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="font-heading text-sm font-black text-gray-900 tracking-wide uppercase mb-3">
              Abilities
            </h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((a) => (
                <Badge
                  key={a.slot}
                  variant="outline"
                  className="bg-gray-50 border-gray-150 text-gray-800 text-xs py-1 px-3 rounded-lg font-medium"
                >
                  {capitalize(a.ability.name)}
                  {a.is_hidden && (
                    <span className="ml-1 text-[9px] text-gray-400 font-normal font-mono">(Hidden)</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Card 4: Moves (Max 10) */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="font-heading text-sm font-black text-gray-900 tracking-wide uppercase mb-3">
              Moves (Top 10)
            </h2>
            {pokemon.moves.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {pokemon.moves.slice(0, 10).map((m) => (
                  <Badge
                    key={m.move.name}
                    variant="outline"
                    className="bg-white border-gray-100 hover:bg-gray-50/50 text-gray-700 text-xs py-1 px-2.5 rounded-lg font-mono font-normal"
                  >
                    {capitalize(m.move.name.replace("-", " "))}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No moves records found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Unique Nickname Form Dialog */}
      <Dialog open={showNicknameModal} onOpenChange={(open) => !open}>
        <DialogContent className="max-w-md w-[90%] sm:w-full rounded-2xl border border-gray-100">
          <DialogHeader>
            <DialogTitle className="font-heading font-black text-lg text-gray-900 flex items-center gap-1.5">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Pokemon Caught!
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Congratulations! You caught a wild <span className="font-bold text-gray-900">{capitalize(pokemon.name)}</span>. Please assign a unique nickname to add it to your Pokedex collection.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSaveNickname)} className="space-y-4 py-2">
            <div className="space-y-1">
              <label htmlFor="nickname" className="text-xs font-bold text-gray-700">
                Nickname
              </label>
              <Input
                id="nickname"
                type="text"
                placeholder={`My ${capitalize(pokemon.name)}`}
                {...register("nickname")}
                className={`rounded-lg border bg-white ${
                  errors.nickname ? "border-red-500 focus-visible:ring-red-400" : "border-gray-200 focus-visible:ring-secondary focus-visible:border-secondary"
                }`}
                autoFocus
              />
              {errors.nickname && (
                <p className="text-xs font-semibold text-red-500">{errors.nickname.message}</p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full sm:w-auto px-6 font-bold bg-primary text-gray-900 hover:bg-primary/95 border border-primary/20 cursor-pointer"
              >
                Save to Collection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 flex-1">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 flex flex-col items-center">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="h-8 w-40 mt-4" />
          <Skeleton className="h-5 w-24 mt-2" />
          <Skeleton className="h-10 w-full mt-6 rounded-xl" />
        </div>
        <div className="md:col-span-7 flex flex-col gap-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  );
}
