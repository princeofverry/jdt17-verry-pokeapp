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
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Dna className="h-5 w-5 animate-spin-slow text-gray-900" />
          </div>
          <span className="text-base font-semibold text-gray-900 sm:text-lg">
            Poke<span className="text-secondary font-extrabold font-mono">Explorer</span>
          </span> */}
          <Image src={"pokemon.svg"} alt="logo" height={96} width={96} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-gray-900 ${
                  isActive ? "text-gray-900 font-semibold" : "text-gray-600"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Gacha Ticket Counter */}
        <div className="flex items-center gap-2">
          {mounted ? (
            <Badge
              variant={remainingTickets > 0 ? "default" : "flat"}
              className="flex items-center gap-1 py-1 px-2.5 font-bold rounded-lg border border-primary/20 text-gray-900 bg-primary select-none animate-fade-in"
            >
              <Ticket className="h-3.5 w-3.5 text-gray-900" />
              <span className="text-xs">{remainingTickets} Rolls Left</span>
            </Badge>
          ) : (
            <Skeleton className="h-6 w-24 rounded-lg" />
          )}
        </div>
      </div>
    </header>
  );
}
