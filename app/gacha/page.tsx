import { Suspense } from "react";
import PokemonGachaView from "@/components/pokemon/PokemonGachaView";
import { Skeleton } from "@/components/ui/skeleton";

// Disable strict instant validation for this random gacha roll route
export const unstable_instant = false;

export default function GachaPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-md px-4 py-12 flex-1 flex flex-col items-center justify-center">
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-20 w-full mb-8 rounded-xl" />
          <Skeleton className="w-72 h-[340px] rounded-2xl mb-8" />
          <Skeleton className="w-72 h-10 rounded-xl" />
        </div>
      }
    >
      <PokemonGachaView />
    </Suspense>
  );
}
