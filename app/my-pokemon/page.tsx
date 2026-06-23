import { Suspense } from "react";
import PokemonCollectionView from "@/components/pokemon/PokemonCollectionView";
import { Skeleton } from "@/components/ui/skeleton";

// Disable strict instant validation for this local storage collection route
export const unstable_instant = false;

export default function MyPokemonPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="rounded-xl border border-gray-100 bg-white p-4 h-[256px] flex flex-col justify-between">
                <Skeleton className="w-full h-[120px] rounded-lg" />
                <div className="mt-3 flex flex-col gap-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <PokemonCollectionView />
    </Suspense>
  );
}
