"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Ticket, CircleDot, XCircle, CheckCircle, ShieldAlert } from "lucide-react";
import { useGacha } from "@/hooks/useGacha";
import { useCollection } from "@/hooks/useCollection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatPokemonId, capitalize, getTypeStyles, getPokemonImage } from "./PokemonCard";

export default function PokemonGachaView() {
  const { rollPokemon, rolledPokemon, isLoading: isQueryLoading, error, remainingTickets, clearResult } = useGacha();
  const { attemptCatch, savePokemon, isNicknameDuplicate, checkAndResetTickets } = useCollection();

  const [gameState, setGameState] = useState<"idle" | "rolling" | "revealed">("idle");
  const [isCatching, setIsCatching] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const handleRollClick = async () => {
    if (remainingTickets <= 0) {
      toast.error("You don't have any tickets left for today! Tickets reset daily.");
      return;
    }

    setGameState("rolling");
    
    // Simulate spin/roll timer for aesthetic feel
    const [result] = await Promise.all([
      rollPokemon(),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);

    if (result) {
      setGameState("revealed");
    } else {
      setGameState("idle");
      toast.error(error || "Gacha roll failed. Please try again.");
    }
  };

  const handleCatchAction = async () => {
    if (!rolledPokemon) return;
    setIsCatching(true);

    setTimeout(() => {
      const caught = attemptCatch();
      setIsCatching(false);

      if (caught) {
        toast.success(`Success! You caught ${capitalize(rolledPokemon.name)}!`);
        setShowNicknameModal(true);
      } else {
        toast.error(`Oh no! ${capitalize(rolledPokemon.name)} escaped.`);
        setGameState("idle");
        clearResult();
      }
    }, 3000);
  };

  const onSaveNickname = (values: NicknameFormValues) => {
    if (!rolledPokemon) return;

    const artwork = getPokemonImage(rolledPokemon);

    savePokemon({
      id: rolledPokemon.id,
      name: rolledPokemon.name,
      nickname: values.nickname,
      image: artwork,
      types: rolledPokemon.types.map((t) => t.type.name),
    });

    setShowNicknameModal(false);
    reset();
    setGameState("idle");
    clearResult();
    toast.success(`${values.nickname} has been saved to your collection!`);
  };

  const handleClose = () => {
    setGameState("idle");
    clearResult();
  };

  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-12 flex-1 flex flex-col items-center justify-center">
        <CircleDot className="h-8 w-8 text-gray-300 animate-spin-slow" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 sm:py-8 flex-1 flex flex-col items-center justify-center">
      {/* Page Title */}
      <div className="text-center mb-8 select-none">
        <h1 className="font-heading text-3xl font-black text-foreground tracking-tight flex items-center justify-center gap-2 uppercase">
          <Ticket className="h-6 w-6 text-foreground" />
          DAILY GACHA ROLL
        </h1>
        <p className="mt-2 text-sm font-bold text-muted-foreground max-w-xs mx-auto">
          Use one of your 5 daily tickets to roll a random Pokemon and try to catch it!
        </p>
      </div>

      {/* Ticket Balance Widget */}
      <div className="mb-8 rounded-xl border-4 border-black bg-primary p-4 w-full flex items-center justify-between shadow-[4px_4px_0px_#000] relative overflow-hidden select-none">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-card border-2 border-black rounded-lg flex items-center justify-center">
            <Ticket className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-primary-foreground uppercase tracking-wider">Gacha Tickets</h4>
            <p className="text-sm font-black text-primary-foreground">{remainingTickets} / 5 Remaining Today</p>
          </div>
        </div>
        <Badge variant={remainingTickets > 0 ? "outline" : "destructive"} className="text-[10px] font-black py-0.5 px-2 bg-card text-foreground border-2 border-black shadow-none">
          {remainingTickets > 0 ? "ACTIVE" : "NO TICKETS"}
        </Badge>
      </div>

      {/* Arcade cabinet console screen wrap */}
      <div className="border-4 border-black bg-muted p-3 rounded-2xl shadow-[6px_6px_0px_#000] mb-8">
        {/* 3D Animation Card Flip Arena */}
        <div className="relative w-72 h-[340px] perspective-1000 select-none">
          <div
            className={`relative w-full h-full duration-700 preserve-3d transition-transform ${
              gameState === "revealed" ? "rotate-y-180" : ""
            } ${gameState === "rolling" ? "animate-bounce" : ""}`}
          >
            {/* Card Back (Default/Rolling) */}
            <div className="absolute inset-0 w-full h-full rounded-xl border-4 border-black bg-card shadow-none backface-hidden flex flex-col items-center justify-center p-6 text-center">
              {/* Red and White Pokeball card design layout */}
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-card border-4 border-black shadow-none overflow-hidden mb-6">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-[#FF4D4D] border-b-4 border-black" />
                <div className="z-10 h-10 w-10 rounded-full bg-card border-4 border-black flex items-center justify-center shadow-none">
                  <CircleDot className={`h-5 w-5 text-foreground ${gameState === "rolling" ? "animate-spin text-foreground" : ""}`} />
                </div>
              </div>

              {gameState === "rolling" ? (
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#FF4D4D] tracking-wider uppercase animate-pulse">
                    Rolling...
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground">Summoning a wild Pokemon</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-foreground tracking-wider uppercase">
                    Ready to Roll
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground">Press Roll Pokemon below</p>
                </div>
              )}
            </div>

            {/* Card Front (Revealed Result) */}
            <div className="absolute inset-0 w-full h-full rounded-xl border-4 border-black bg-card shadow-none rotate-y-180 backface-hidden flex flex-col items-between p-4">
              {rolledPokemon ? (
                <div className="flex flex-col h-full justify-between">
                  <div className="w-full flex justify-between items-center select-none">
                    <Badge variant="outline" className="text-[9px] font-black text-foreground font-mono py-0 px-2 rounded border-2 border-black bg-muted shadow-none">
                      {formatPokemonId(rolledPokemon.id)}
                    </Badge>
                    <div className="flex gap-1">
                      {rolledPokemon.types.map((t) => (
                        <Badge
                          key={t.slot}
                          variant="outline"
                          className={`text-[9px] font-black py-0 px-1.5 rounded border-2 ${getTypeStyles(t.type.name)}`}
                        >
                          {capitalize(t.type.name)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center p-2">
                    <Image
                      src={getPokemonImage(rolledPokemon)}
                      alt={rolledPokemon.name}
                      width={150}
                      height={150}
                      className="object-contain select-none"
                      unoptimized
                    />
                  </div>

                  <div className="w-full text-center">
                    <h3 className="font-heading text-lg font-black text-foreground tracking-tight uppercase">
                      {capitalize(rolledPokemon.name)}
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5">A wild Pokemon appeared!</p>

                    <div className="mt-4 flex gap-2 w-full justify-center">
                      <Button
                        onClick={handleCatchAction}
                        disabled={isCatching}
                        className="flex-1 text-xs font-black py-2.5 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
                      >
                        {isCatching ? "Throwing..." : "Catch"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClose}
                        disabled={isCatching}
                        className="flex-1 text-xs font-black py-2.5 h-9 rounded-lg hover:bg-foreground/10 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer bg-card text-foreground"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <ShieldAlert className="h-8 w-8 text-[#FF4D4D] mb-2" />
                  <p className="text-xs text-black font-black">Error loading data.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Controller */}
      <Button
        onClick={handleRollClick}
        disabled={gameState !== "idle" || remainingTickets <= 0}
        className="w-72 py-6 rounded-xl font-black text-sm bg-primary text-primary-foreground border-3 border-black shadow-[4px_4px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Sparkles className="h-4 w-4 text-black animate-pulse" />
        ROLL POKEMON
      </Button>

      {/* Unique Nickname Form Dialog */}
      <Dialog open={showNicknameModal} onOpenChange={(open) => !open}>
        <DialogContent className="max-w-md w-[90%] sm:w-full rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-card p-6 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-heading font-black text-lg text-foreground flex items-center gap-1.5 select-none">
              <CheckCircle className="h-5 w-5 text-[#6BCB77]" />
              Pokemon Caught!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-bold text-sm">
              Congratulations! You caught a wild <span className="font-black text-foreground">{rolledPokemon ? capitalize(rolledPokemon.name) : ""}</span>. Please assign a unique nickname to add it to your Pokedex collection.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSaveNickname)} className="space-y-4 py-2">
            <div className="space-y-2 select-none">
              <label htmlFor="nickname" className="text-xs font-black text-black uppercase">
                Nickname
              </label>
              <Input
                id="nickname"
                type="text"
                placeholder={rolledPokemon ? `My ${capitalize(rolledPokemon.name)}` : ""}
                {...register("nickname")}
                className={`h-10 font-extrabold rounded-lg ${
                  errors.nickname 
                    ? "border-red-500 shadow-[2px_2px_0px_#FF4D4D]" 
                    : "border-black focus-visible:shadow-[1px_1px_0px_#000]"
                }`}
                autoFocus
              />
              {errors.nickname && (
                <p className="text-xs font-bold text-[#FF4D4D]">{errors.nickname.message}</p>
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
              CATCHING {rolledPokemon ? rolledPokemon.name.toUpperCase() : "POKEMON"}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
