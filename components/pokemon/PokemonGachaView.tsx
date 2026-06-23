"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sparkles,
  Ticket,
  CircleDot,
  XCircle,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { useGacha } from "@/hooks/useGacha";
import { useCollection } from "@/hooks/useCollection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function PokemonGachaView() {
  const {
    rollPokemon,
    rolledPokemon,
    isLoading: isQueryLoading,
    error,
    remainingTickets,
    clearResult,
  } = useGacha();
  const {
    attemptCatch,
    savePokemon,
    isNicknameDuplicate,
    checkAndResetTickets,
  } = useCollection();

  const [gameState, setGameState] = useState<"idle" | "rolling" | "revealed">(
    "idle",
  );
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

  const handleRollClick = async () => {
    if (remainingTickets <= 0) {
      toast.error(
        "You don't have any tickets left for today! Tickets reset daily.",
      );
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
    }, 1000);
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
      <div className="text-center mb-8">
        <h1 className="font-heading text-2xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-1.5">
          <Ticket className="h-6 w-6 text-primary" />
          Daily Gacha Roll
        </h1>
        <p className="mt-2 text-sm text-gray-600 max-w-xs mx-auto">
          Use one of your 5 daily tickets to roll a random Pokemon and try to
          catch it!
        </p>
      </div>

      {/* Ticket Balance Widget */}
      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-4 w-full flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary-foreground">
            <Ticket className="h-5 w-5 text-gray-950" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Gacha Tickets
            </h4>
            <p className="text-sm font-extrabold text-gray-900">
              {remainingTickets} / 5 Remaining Today
            </p>
          </div>
        </div>
        <Badge
          variant={remainingTickets > 0 ? "default" : "destructive"}
          className="text-[10px] font-bold py-0.5 px-2 rounded-md"
        >
          {remainingTickets > 0 ? "Active" : "No Tickets"}
        </Badge>
      </div>

      {/* 3D Animation Card Flip Arena */}
      <div className="relative w-72 h-[340px] perspective-1000 mb-8 select-none">
        <div
          className={`relative w-full h-full duration-700 preserve-3d transition-transform ${
            gameState === "revealed" ? "rotate-y-180" : ""
          } ${gameState === "rolling" ? "animate-bounce" : ""}`}
        >
          {/* Card Back (Default/Rolling) */}
          <div className="absolute inset-0 w-full h-full rounded-2xl border border-gray-200 bg-white shadow-md backface-hidden flex flex-col items-center justify-center p-6 text-center">
            {/* Red and White Pokeball card design layout */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gray-50 border-4 border-gray-950 shadow-inner overflow-hidden mb-6">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 border-b-4 border-gray-950" />
              <div className="z-10 h-8 w-8 rounded-full bg-white border-4 border-gray-950 flex items-center justify-center shadow-xs">
                <CircleDot
                  className={`h-4 w-4 text-gray-400 ${gameState === "rolling" ? "animate-spin text-secondary" : ""}`}
                />
              </div>
            </div>

            {gameState === "rolling" ? (
              <div className="space-y-1">
                <h3 className="text-sm font-black text-secondary tracking-wider uppercase animate-pulse">
                  Rolling...
                </h3>
                <p className="text-[10px] text-gray-400">
                  Summoning a wild Pokemon
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-900 tracking-wider uppercase">
                  Ready to Roll
                </h3>
                <p className="text-[10px] text-gray-400">
                  Press Roll Pokemon below
                </p>
              </div>
            )}
          </div>

          {/* Card Front (Revealed Result) */}
          <div className="absolute inset-0 w-full h-full rounded-2xl border border-gray-200 bg-white shadow-md backface-hidden rotate-y-180 flex flex-col items-center justify-between p-6">
            {rolledPokemon ? (
              <>
                <div className="w-full flex justify-between items-center select-none">
                  <Badge
                    variant="flat"
                    className="text-[10px] font-bold text-gray-500 font-mono py-0 px-2 rounded-md"
                  >
                    {formatPokemonId(rolledPokemon.id)}
                  </Badge>
                  <div className="flex gap-1">
                    {rolledPokemon.types.map((t) => (
                      <Badge
                        key={t.slot}
                        variant="outline"
                        className={`text-[9px] font-bold py-0 px-1.5 rounded-sm ${getTypeStyles(t.type.name)}`}
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
                    width={160}
                    height={160}
                    className="object-contain drop-shadow-md select-none"
                    unoptimized
                  />
                </div>

                <div className="w-full text-center">
                  <h3 className="font-heading text-lg font-black text-gray-900 tracking-tight">
                    {capitalize(rolledPokemon.name)}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    A wild Pokemon appeared!
                  </p>

                  <div className="mt-4 flex gap-2 w-full justify-center">
                    <Button
                      onClick={handleCatchAction}
                      disabled={isCatching}
                      className="flex-1 text-xs font-bold py-2 h-7 rounded-lg bg-primary text-gray-900 hover:bg-primary/95 border border-primary/20 cursor-pointer shadow-xs"
                    >
                      {isCatching ? "Throwing..." : "Catch"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClose}
                      disabled={isCatching}
                      className="flex-1 text-xs font-semibold py-2 h-7 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <ShieldAlert className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-xs text-gray-500 font-medium">
                  Error loading data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Controller */}
      <Button
        onClick={handleRollClick}
        disabled={gameState !== "idle" || remainingTickets <= 0}
        className="w-72 py-5 rounded-xl font-bold bg-primary text-gray-900 hover:bg-primary/95 shadow-md flex items-center justify-center gap-2 cursor-pointer border border-primary/20"
      >
        <Sparkles className="h-4 w-4 text-gray-900" />
        Roll Pokemon
      </Button>

      {/* Unique Nickname Form Dialog */}
      <Dialog open={showNicknameModal} onOpenChange={(open) => !open}>
        <DialogContent className="max-w-md w-[90%] sm:w-full rounded-2xl border border-gray-100">
          <DialogHeader>
            <DialogTitle className="font-heading font-black text-lg text-gray-900 flex items-center gap-1.5">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Pokemon Caught!
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Congratulations! You caught a wild{" "}
              <span className="font-bold text-gray-900">
                {rolledPokemon ? capitalize(rolledPokemon.name) : ""}
              </span>
              . Please assign a unique nickname to add it to your Pokedex
              collection.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSaveNickname)}
            className="space-y-4 py-2"
          >
            <div className="space-y-1">
              <label
                htmlFor="nickname"
                className="text-xs font-bold text-gray-700"
              >
                Nickname
              </label>
              <Input
                id="nickname"
                type="text"
                placeholder={
                  rolledPokemon ? `My ${capitalize(rolledPokemon.name)}` : ""
                }
                {...register("nickname")}
                className={`rounded-lg border bg-white ${
                  errors.nickname
                    ? "border-red-500 focus-visible:ring-red-400"
                    : "border-gray-200 focus-visible:ring-secondary focus-visible:border-secondary"
                }`}
                autoFocus
              />
              {errors.nickname && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.nickname.message}
                </p>
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
