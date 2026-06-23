import { Suspense } from "react";
import PokemonDashboard from "@/components/pokemon/PokemonDashboard";
import { Skeleton } from "@/components/ui/skeleton";

// Disable strict instant validation for this highly dynamic search/pagination route
export const unstable_instant = false;

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-8 flex flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-64 mb-6" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-100 bg-white p-4 h-[228px] flex flex-col justify-between"
              >
                <Skeleton className="w-full h-[30] rounded-lg" />
                <div className="mt-3 flex flex-col gap-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-5 w-1/2 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <PokemonDashboard />
    </Suspense>
  );
}
