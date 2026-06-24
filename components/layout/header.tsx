"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDot, Ticket, Trophy, Dna } from "lucide-react";
import { usePokemonStore } from "@/stores/pokemonStore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const remainingTickets = usePokemonStore((state) => state.remainingTickets);
  const checkAndResetTickets = usePokemonStore(
    (state) => state.checkAndResetTickets,
  );

  useEffect(() => {
    setMounted(true);
    checkAndResetTickets();
  }, [checkAndResetTickets]);

  const navLinks = [
    { href: "/", label: "Pokedex", icon: CircleDot },
    { href: "/gacha", label: "Gacha", icon: Ticket },
    { href: "/my-pokemon", label: "My Pokemon", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b-4 border-black bg-white select-none">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-black tracking-tight"
        >
          <Image src="/pokemon.svg" alt="logo" height={80} width={100} className="object-contain" priority />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 sm:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-extrabold transition-all px-3 py-1 rounded-lg border-2 ${
                  isActive
                    ? "bg-[#FFD93D] border-black text-black shadow-[2px_2px_0px_0px_#000]"
                    : "border-transparent text-black hover:bg-black/5"
                }`}
              >
                <Icon
                  className="h-4 w-4"
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Gacha Ticket Counter */}
        <div className="flex items-center gap-2">
          {mounted ? (
            <div
              className={`flex items-center gap-1.5 py-1 px-3 font-black rounded-lg border-2 border-black select-none shadow-[2px_2px_0px_0px_#000] transition-all text-xs ${
                remainingTickets > 0 
                  ? "bg-[#FFD93D] text-black" 
                  : "bg-[#FF4D4D] text-white"
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span>{remainingTickets} Rolls Left</span>
            </div>
          ) : (
            <Skeleton className="h-7 w-24 rounded-lg" />
          )}
        </div>
      </div>
    </header>
  );
}
