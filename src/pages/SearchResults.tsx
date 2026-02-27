import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadCse } from "@/lib/loadCse";

function getEnv(name: string) {
  return (import.meta as any).env?.[name] as string | undefined;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function executeCseQuery(query: string) {
  const w = window as any;
  // Wait for the CSE API to become available
  for (let i = 0; i < 60; i++) {
    const api = w?.google?.search?.cse?.element;
    if (api?.getElement) {
      const el = api.getElement("cse-results");
      if (el?.execute) {
        el.execute(query);
      }
      return;
    }
    // ~1s max
    await sleep(16);
  }
}

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") ?? "").trim();

  const [ready, setReady] = useState(false);
  const cx = getEnv("VITE_GOOGLE_CSE_ID") ?? "";
  const mode = (getEnv("VITE_GOOGLE_CSE_MODE") ?? "resultsOnly") as
    | "resultsOnly"
    | "standard"
    | string;

  const containerClass = useMemo(() => {
    return mode === "standard" ? "gcse-search" : "gcse-searchresults-only";
  }, [mode]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadCse(cx);
        if (cancelled) return;
        setReady(true);
        if (q) {
          // Ensure results update on SPA navigation
          await executeCseQuery(q);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cx, q]);

  return (
    <div className="min-h-screen bg-background">
      <header className="pt-6 sm:pt-10 pb-4 sm:pb-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                Search
              </h1>
              <p className="text-sm text-muted-foreground">
                Google results (Programmable Search Engine)
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/">Back</Link>
            </Button>
          </div>

          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.elements.namedItem("q") as HTMLInputElement | null;
              const next = (input?.value ?? "").trim();
              if (!next) return;
              setParams({ q: next });
            }}
          >
            <div className="max-w-xl">
              <Input
                name="q"
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Search…"
                defaultValue={q}
                className="h-11 rounded-full border-white/10 bg-white/5 px-4 text-foreground placeholder:text-muted-foreground/80 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label="Search"
              />
            </div>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {!cx && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted-foreground">
            Missing <code>VITE_GOOGLE_CSE_ID</code>. Add it to{" "}
            <code>.env.local</code> and restart the dev server.
          </div>
        )}

        {!!cx && (
          <>
            {!ready && (
              <div className="text-sm text-muted-foreground">Loading results…</div>
            )}
            <div
              className={containerClass}
              data-gname="cse-results"
              data-queryParameterName="q"
            />
          </>
        )}
      </main>
    </div>
  );
}

