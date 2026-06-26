"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDot, Ticket, Trophy } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Pokedex", icon: CircleDot },
    { href: "/gacha", label: "Gacha Roll", icon: Ticket },
    { href: "/my-pokemon", label: "Collection", icon: Trophy },
  ];

  return (
    <footer className="sticky bottom-0 z-40 w-full border-t-4 border-black bg-card text-foreground py-2 sm:hidden select-none">
      <div className="flex justify-around items-center px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-extrabold transition-all border-2 rounded-lg ${
                isActive
                  ? "bg-primary border-black text-primary-foreground shadow-[2px_2px_0px_0px_#000]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className="h-5 w-5"
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
