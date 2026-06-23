import { Suspense } from "react";
import PokemonDetailView from "@/components/pokemon/PokemonDetailView";
import { Skeleton } from "@/components/ui/skeleton";

// Disable instant shell validation for dynamic path segment
export const unstable_instant = false;

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          <Skeleton className="h-4 w-32 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 flex flex-col items-center">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-8 w-40 mt-4 animate-pulse" />
              <Skeleton className="h-5 w-24 mt-2 animate-pulse" />
              <Skeleton className="h-10 w-full mt-6 rounded-xl animate-pulse" />
            </div>
            <div className="md:col-span-7 flex flex-col gap-6">
              <Skeleton className="h-20 w-full animate-pulse" />
              <Skeleton className="h-56 w-full animate-pulse" />
            </div>
          </div>
        </div>
      }
    >
      <PokemonDetailView params={params} />
    </Suspense>
  );
}
