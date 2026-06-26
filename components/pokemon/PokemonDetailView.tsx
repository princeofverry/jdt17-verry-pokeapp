"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Sparkles,
  Scale,
  Ruler,
  CheckCircle,
  ShieldAlert,
  Award,
  Dna,
} from "lucide-react";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { usePokemonEvolution } from "@/hooks/usePokemonEvolution";
import { useCollection } from "@/hooks/useCollection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  formatPokemonId,
  capitalize,
  getTypeStyles,
  getPokemonImage,
} from "./PokemonCard";

import { use } from "react";

interface PokemonDetailViewProps {
  params: Promise<{ id: string }>;
}

export default function PokemonDetailView({ params }: PokemonDetailViewProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: pokemon, isLoading, error } = usePokemonDetail(id);
  const {
    attemptCatch,
    savePokemon,
    isNicknameDuplicate,
    checkAndResetTickets,
    remainingTickets,
  } = useCollection();

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
      .refine((val) => !isNicknameDuplicate(val), {
        message: "This nickname is already in your collection!",
      }),
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
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground">
          Failed to load Pokemon
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The Pokemon may not exist or network connectivity is unstable.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => router.push("/")}
        >
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
    }, 3000);
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
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 flex-1 select-none">
      {/* Back navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-extrabold text-foreground hover:underline mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Pokedex
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Card: Artwork & Primary details */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative flex aspect-square w-full items-center justify-center rounded-xl bg-card border-4 border-black p-8 shadow-[5px_5px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[7px_7px_0px_#000] transition-all">
            {artwork && (
              <Image
                src={artwork}
                alt={pokemon.name}
                width={220}
                height={220}
                className="object-contain select-none"
                priority
                unoptimized
              />
            )}
            <span className="absolute top-4 right-4 text-xs font-black font-mono text-foreground border-2 border-black bg-card px-2 py-0.5 rounded shadow-[2px_2px_0px_#000]">
              {formatPokemonId(pokemon.id)}
            </span>
          </div>

          <h1 className="mt-5 font-heading text-3xl font-black text-foreground tracking-tight text-center uppercase">
            {capitalize(pokemon.name)}
          </h1>

          <div className="mt-2.5 flex gap-1.5 justify-center">
            {pokemon.types.map((t) => (
              <Badge
                key={t.slot}
                variant="outline"
                className={`text-xs py-0.5 px-3 rounded-lg font-black border-2 ${getTypeStyles(t.type.name)}`}
              >
                {capitalize(t.type.name)}
              </Badge>
            ))}
          </div>

          {/* Catch Button */}
          <Button
            onClick={handleCatchAction}
            disabled={isCatching}
            className="mt-6 w-full py-6 rounded-xl font-black text-sm bg-primary text-black border-3 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all"
          >
            <Sparkles className="h-4 w-4 text-black animate-pulse" />
            {isCatching
              ? "THROWING POKEBALL..."
              : `CATCH ${pokemon.name.toUpperCase()}`}
          </Button>
        </div>

        {/* Right Info: Stats, Physical properties, Abilities & Moves */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Card 1: Physical properties */}
          <div className="rounded-xl border-4 border-black bg-card text-foreground p-5 shadow-[4px_4px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000] transition-all">
            <h2 className="font-heading text-sm font-black text-foreground tracking-wide uppercase mb-4 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-foreground" />
              Information
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center divide-x-2 divide-black">
              <div className="flex flex-col items-center">
                <Ruler className="h-4 w-4 text-foreground mb-1" />
                <span className="text-[10px] font-black text-muted-foreground uppercase">
                  Height
                </span>
                <span className="text-sm font-black text-foreground mt-0.5 font-mono">
                  {pokemon.height / 10} m
                </span>
              </div>
              <div className="flex flex-col items-center pl-2">
                <Scale className="h-4 w-4 text-foreground mb-1" />
                <span className="text-[10px] font-black text-muted-foreground uppercase">
                  Weight
                </span>
                <span className="text-sm font-black text-foreground mt-0.5 font-mono">
                  {pokemon.weight / 10} kg
                </span>
              </div>
              <div className="flex flex-col items-center pl-2">
                <Sparkles className="h-4 w-4 text-foreground mb-1" />
                <span className="text-[10px] font-black text-muted-foreground uppercase">
                  Base Exp
                </span>
                <span className="text-sm font-black text-foreground mt-0.5 font-mono">
                  {pokemon.base_experience || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Stats */}
          <div className="rounded-xl border-4 border-black bg-card text-foreground p-5 shadow-[4px_4px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000] transition-all">
            <h2 className="font-heading text-sm font-black text-foreground tracking-wide uppercase mb-4">
              Base Stats
            </h2>
            <div className="flex flex-col gap-3.5">
              {pokemon.stats.map((s) => {
                const label =
                  statLabelMap[s.stat.name] || s.stat.name.toUpperCase();
                const max = statMaxMap[s.stat.name] || 200;
                const percentage = Math.min(
                  100,
                  Math.round((s.base_stat / max) * 100),
                );

                return (
                  <div key={s.stat.name} className="flex gap-2 items-center">
                    <span className="w-10 text-[10px] font-black text-foreground tracking-wider">
                      {label}
                    </span>
                    <span className="w-8 text-xs font-black text-foreground text-right font-mono pr-2">
                      {s.base_stat}
                    </span>
                    <div className="flex-1 h-4 w-full bg-muted border-2 border-black rounded shadow-[1px_1px_0px_#000] overflow-hidden">
                      <div
                        className="h-full bg-[#6BCB77] border-r-2 border-black transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Abilities */}
          <div className="rounded-xl border-4 border-black bg-card text-foreground p-5 shadow-[4px_4px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000] transition-all">
            <h2 className="font-heading text-sm font-black text-foreground tracking-wide uppercase mb-3">
              Abilities
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {pokemon.abilities.map((a) => (
                <Badge
                  key={a.slot}
                  variant="outline"
                  className="bg-card border-2 border-black text-foreground text-xs py-1 px-3 rounded-lg font-black uppercase shadow-[2px_2px_0px_#000]"
                >
                  {capitalize(a.ability.name)}
                  {a.is_hidden && (
                    <span className="ml-1 text-[9px] font-bold text-muted-foreground normal-case font-sans">
                      (Hidden)
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Card 4: Moves (Max 10) */}
          <div className="rounded-xl border-4 border-black bg-card text-foreground p-5 shadow-[4px_4px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000] transition-all">
            <h2 className="font-heading text-sm font-black text-foreground tracking-wide uppercase mb-3">
              Moves (Top 10)
            </h2>
            {pokemon.moves.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {pokemon.moves.slice(0, 10).map((m) => (
                  <Badge
                    key={m.move.name}
                    variant="outline"
                    className="bg-card border-2 border-black text-foreground text-xs py-1 px-2.5 rounded-lg font-mono font-bold shadow-[2px_2px_0px_#000]"
                  >
                    {capitalize(m.move.name.replace("-", " "))}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No moves records found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Evolution Chain Section */}
      <div className="mt-8">
        <PokemonEvolutionChain pokemonIdOrName={pokemon.id} />
      </div>

      {/* Unique Nickname Form Dialog */}
      <Dialog open={showNicknameModal} onOpenChange={(open) => !open}>
        <DialogContent className="max-w-md w-[90%] sm:w-full rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-card p-6 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-heading font-black text-lg text-foreground flex items-center gap-1.5 select-none">
              <CheckCircle className="h-5 w-5 text-[#6BCB77]" />
              Pokemon Caught!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-bold text-sm">
              Congratulations! You caught a wild{" "}
              <span className="font-black text-foreground">
                {capitalize(pokemon.name)}
              </span>
              . Please assign a unique nickname to add it to your Pokedex
              collection.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSaveNickname)}
            className="space-y-4 py-2"
          >
            <div className="space-y-2 select-none">
              <label
                htmlFor="nickname"
                className="text-xs font-black text-foreground uppercase"
              >
                Nickname
              </label>
              <Input
                id="nickname"
                type="text"
                placeholder={`My ${capitalize(pokemon.name)}`}
                {...register("nickname")}
                className={`h-10 font-extrabold rounded-lg ${
                  errors.nickname
                    ? "border-red-500 shadow-[2px_2px_0px_#FF4D4D]"
                    : "border-black focus-visible:shadow-[1px_1px_0px_#000]"
                }`}
                autoFocus
              />
              {errors.nickname && (
                <p className="text-xs font-bold text-[#FF4D4D]">
                  {errors.nickname.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="submit"
                className="w-full sm:w-auto px-6 font-black bg-primary text-primary-foreground border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
              >
                Save to Collection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cinematic Catch Overlay */}
      {isCatching && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-300">
          <div className="relative w-64 h-64 flex flex-col items-center justify-center">
            <div className="absolute top-1/2 left-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-black bg-white overflow-hidden relative shadow-[4px_4px_0px_rgba(0,0,0,0.5)] animate-pokeball-shake">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-[#FF4D4D] border-b-4 border-black" />
                <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-4 border-black z-10 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D4D] animate-ping" />
                </div>
              </div>
            </div>
            <p className="absolute bottom-4 text-white text-xs font-black tracking-widest uppercase animate-pulse">
              CATCHING {pokemon.name.toUpperCase()}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface EvolutionTransition {
  from: { name: string; id: number; image: string };
  to: { name: string; id: number; image: string };
  minLevel?: number;
  triggerName?: string;
  item?: string;
}

function parseIdFromSpeciesUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

function getTransitions(node: any, transitions: EvolutionTransition[] = []): EvolutionTransition[] {
  if (!node) return transitions;
  const fromId = parseIdFromSpeciesUrl(node.species.url);
  const fromName = node.species.name;
  const fromImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${fromId}.png`;
  
  for (const nextNode of node.evolves_to) {
    const toId = parseIdFromSpeciesUrl(nextNode.species.url);
    const toName = nextNode.species.name;
    const toImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${toId}.png`;
    
    let minLevel: number | undefined;
    let triggerName: string | undefined;
    let item: string | undefined;
    
    if (nextNode.evolution_details && nextNode.evolution_details.length > 0) {
      const details = nextNode.evolution_details[0];
      minLevel = details.min_level ?? undefined;
      triggerName = details.trigger?.name.replace("-", " ") ?? undefined;
      item = details.item?.name.replace("-", " ") ?? undefined;
    }
    
    transitions.push({
      from: { name: fromName, id: fromId, image: fromImage },
      to: { name: toName, id: toId, image: toImage },
      minLevel,
      triggerName,
      item,
    });
    
    getTransitions(nextNode, transitions);
  }
  
  return transitions;
}

function PokemonEvolutionChain({ pokemonIdOrName }: { pokemonIdOrName: string | number }) {
  const { data, isLoading, error } = usePokemonEvolution(pokemonIdOrName);
  
  if (isLoading) {
    return (
      <div className="rounded-xl border-4 border-black bg-card p-5 shadow-[4px_4px_0px_#000] animate-pulse">
        <div className="h-5 w-40 bg-muted rounded mb-4" />
        <div className="h-28 w-full bg-muted rounded animate-pulse" />
      </div>
    );
  }
  
  if (error || !data) {
    return null;
  }
  
  const transitions = getTransitions(data.chain);
  
  if (transitions.length === 0) {
    return (
      <div className="rounded-xl border-4 border-black bg-card p-5 shadow-[4px_4px_0px_#000]">
        <h2 className="font-heading text-sm font-black text-foreground tracking-wide uppercase mb-2 flex items-center gap-1.5">
          <Dna className="h-4 w-4 text-foreground" />
          Evolution Chain
        </h2>
        <p className="text-xs text-muted-foreground italic">
          This Pokemon does not evolve.
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-xl border-4 border-black bg-card p-5 shadow-[4px_4px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000] transition-all">
      <h2 className="font-heading text-sm font-black text-foreground tracking-wide uppercase mb-4 flex items-center gap-1.5">
        <Dna className="h-4 w-4 text-foreground" />
        Evolution Chain
      </h2>
      
      <div className="flex flex-col gap-4">
        {transitions.map((transition, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-muted/30 dark:bg-muted/10 p-3 rounded-xl border-2 border-black border-dashed">
            {/* From Card */}
            <Link href={`/pokemon/${transition.from.id}`} className="group flex flex-col items-center p-2.5 bg-card border-3 border-black rounded-xl shadow-[3px_3px_0px_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_#000] transition-all shrink-0 w-24">
              <div className="relative aspect-square w-14 h-14 bg-muted/40 rounded-lg flex items-center justify-center p-1 border border-black/10">
                <Image src={transition.from.image} alt={transition.from.name} width={50} height={50} className="object-contain transition-transform group-hover:scale-105" unoptimized />
              </div>
              <span className="mt-1.5 text-[10px] font-black uppercase text-foreground truncate w-full text-center">{transition.from.name}</span>
            </Link>
            
            {/* Arrow / Trigger */}
            <div className="flex flex-col items-center justify-center text-center px-2">
              <span className="text-[9px] font-black uppercase text-foreground tracking-wider mb-1 bg-primary text-primary-foreground px-2 py-0.5 border-2 border-black rounded shadow-[1.5px_1.5px_0px_#000]">
                {transition.item ? `Use ${transition.item}` : transition.minLevel ? `Level ${transition.minLevel}` : transition.triggerName || "Evolve"}
              </span>
              <div className="text-foreground font-black text-lg select-none">
                <span className="hidden sm:inline">➔</span>
                <span className="sm:hidden">↓</span>
              </div>
            </div>
            
            {/* To Card */}
            <Link href={`/pokemon/${transition.to.id}`} className="group flex flex-col items-center p-2.5 bg-card border-3 border-black rounded-xl shadow-[3px_3px_0px_#000] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_#000] transition-all shrink-0 w-24">
              <div className="relative aspect-square w-14 h-14 bg-muted/40 rounded-lg flex items-center justify-center p-1 border border-black/10">
                <Image src={transition.to.image} alt={transition.to.name} width={50} height={50} className="object-contain transition-transform group-hover:scale-105" unoptimized />
              </div>
              <span className="mt-1.5 text-[10px] font-black uppercase text-foreground truncate w-full text-center">{transition.to.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 flex-1 select-none">
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 flex flex-col items-center w-full">
          <Skeleton className="aspect-square w-full rounded-xl animate-pulse" />
          <Skeleton className="h-8 w-40 mt-5 animate-pulse" />
          <Skeleton className="h-5 w-24 mt-2.5 animate-pulse" />
          <Skeleton className="h-12 w-full mt-6 animate-pulse" />
        </div>
        <div className="md:col-span-7 flex flex-col gap-6 w-full">
          <Skeleton className="h-24 w-full animate-pulse" />
          <Skeleton className="h-64 w-full animate-pulse" />
          <Skeleton className="h-28 w-full animate-pulse" />
          <Skeleton className="h-32 w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
