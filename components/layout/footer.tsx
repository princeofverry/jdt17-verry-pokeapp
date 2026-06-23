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
    <footer className="sticky bottom-0 z-40 w-full border-t border-gray-100 bg-white/10 py-2 backdrop-blur-xs sm:hidden">
      <div className="flex justify-around items-center px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-black font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div
                className={`p-1 rounded-full transition-colors ${isActive ? "bg-secondary/10" : ""}`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-primary" : "text-gray-600"}`}
                />
              </div>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
