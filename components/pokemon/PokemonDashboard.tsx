"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Compass, AlertCircle } from "lucide-react";
import { usePokemonList } from "@/hooks/usePokemonList";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import PokemonCard from "./PokemonCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ITEMS_PER_PAGE = 20;

export default function PokemonDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current page from search params (default: 1)
  const currentPage = Number(searchParams.get("page")) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const [searchVal, setSearchVal] = useState("");

  // Paginated list query
  const {
    pokemonList,
    count,
    hasNext,
    hasPrevious,
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
  } = usePokemonList(ITEMS_PER_PAGE, offset);

  // Search query (debounced internally)
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    debouncedQuery,
  } = usePokemonSearch(searchVal);

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`?page=${newPage}`);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    // Reset page search param if user starts searching, to clear path
    if (searchParams.get("page")) {
      router.replace("/");
    }
  };

  const isSearching = debouncedQuery.length > 0;
  const isLoading = isSearching ? isSearchLoading : isListLoading;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 flex-1 flex flex-col">
      {/* Decorative Pokeball background indicator & Main Header */}
      <div className="mb-8 text-center sm:text-left select-none">
        <h1 className="font-heading text-3xl font-black tracking-tight text-foreground sm:text-4xl flex items-center justify-center sm:justify-start gap-2.5">
          <Image src="/logo.png" alt="logo" width={32} height={36} className="object-contain" />
          POKEDEX
        </h1>
        <p className="mt-2 text-sm font-bold text-muted-foreground">
          Search and explore Pokemon species, stats, types, and build your
          custom collection.
        </p>
      </div>

      {/* Search Input Section */}
      <div className="relative mb-8 max-w-md w-full mx-auto sm:mx-0">
        <Search className="absolute top-3 left-3 h-4 w-4 text-foreground z-10" />
        <Input
          type="text"
          placeholder="Search by name or ID (e.g. pikachu, 25)..."
          value={searchVal}
          onChange={handleSearchChange}
          className="pl-10 h-10 w-full font-extrabold"
        />
      </div>

      {/* Main Grid View */}
      {isLoading ? (
        // Loading Skeletons
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 flex-1">
          {Array.from({ length: isSearching ? 1 : ITEMS_PER_PAGE }).map(
            (_, idx) => (
              <div
                key={idx}
                className="border-4 border-black bg-card p-3 h-[228px] rounded-xl shadow-[4px_4px_0px_#000] flex flex-col justify-between"
              >
                <Skeleton className="w-full h-[120px]" />
                <div className="mt-3 flex flex-col gap-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              </div>
            ),
          )}
        </div>
      ) : isSearching ? (
        // Search Results Mode
        searchData ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 flex-1 items-start">
            <PokemonCard pokemon={searchData} />
          </div>
        ) : isSearchError ? (
          <div className="py-12 flex flex-col items-center justify-center text-center select-none bg-card border-4 border-black shadow-[6px_6px_0px_#000] rounded-xl p-8 max-w-sm mx-auto my-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4D4D] text-white border-2 border-black mb-4 shadow-[2px_2px_0px_#000]">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-black text-foreground">
              No Pokemon Found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground font-bold max-w-xs">
              We couldn't find any Pokemon matching &ldquo;{debouncedQuery}
              &rdquo;. Check spelling or try an ID.
            </p>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <h3 className="font-heading text-base font-black text-foreground">
              Type to Search
            </h3>
          </div>
        )
      ) : isListError ? (
        // List Error State
        <div className="my-6">
          <Alert variant="destructive" className="border-4 border-black bg-[#FF4D4D] text-white shadow-[6px_6px_0px_#000]">
            <AlertCircle className="h-4 w-4 text-white" />
            <AlertTitle className="font-black">Error Loading Pokemons</AlertTitle>
            <AlertDescription className="font-bold">
              {listError?.message ||
                "Something went wrong while fetching data. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      ) : pokemonList.length > 0 ? (
        // Paginated Grid View
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 flex-1">
            {pokemonList.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          {/* Simple Clean Responsive Pagination */}
          <div className="mt-10 mb-6 flex items-center justify-between border-t-3 border-black pt-8 select-none">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevious}
              className="cursor-pointer"
            >
              Previous
            </Button>

            <span className="text-xs font-black text-foreground border-2 border-black bg-card shadow-[2px_2px_0px_#000] px-3 py-1.5 rounded-lg select-none">
              Page {currentPage} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        // Empty State
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
            <Compass className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="font-heading text-base font-bold text-foreground">
            No Pokemon Available
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            No Pokemon species found. Please refresh or try again.
          </p>
        </div>
      )}
    </div>
  );
}
