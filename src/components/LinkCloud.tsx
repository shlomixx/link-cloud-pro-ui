import React, { useMemo, useState } from "react";
import { LinkData } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getFaviconUrl, handleFaviconError } from "@/components/link-card/utils";

type Props = {
  links: LinkData[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  onSubmit: () => void;
  onLinkClick: (link: LinkData) => void;
};

function scoreLink(l: LinkData): number {
  const fav = l.isFavorite ? 1 : 0;
  const clicks = l.clicks ?? 0;
  const last = l.lastClicked ? new Date(l.lastClicked).getTime() : 0;
  const created = l.createdAt ? new Date(l.createdAt).getTime() : 0;
  return fav * 1_000_000_000_000 + clicks * 1_000_000_000 + last + created / 10;
}

export function LinkCloud({
  links,
  searchTerm,
  onSearchTermChange,
  searchInputRef,
  onSubmit,
  onLinkClick,
}: Props) {
  const q = searchTerm.trim().toLowerCase();
  const [showMore, setShowMore] = useState(false);

  const filtered = useMemo(() => {
    if (!q) return links;
    return links.filter((l) => {
      const name = l.name?.toLowerCase() ?? "";
      const url = (l.url || l.defaultUrl || "").toLowerCase();
      const cat = (l.category || "").toLowerCase();
      return name.includes(q) || url.includes(q) || cat.includes(q);
    });
  }, [links, q]);

  const quickLinks = useMemo(() => {
    const base = filtered;
    const sorted = [...base].sort((a, b) => {
      const d = scoreLink(b) - scoreLink(a);
      if (d !== 0) return d;
      return a.name.localeCompare(b.name);
    });
    const limit = q ? 72 : showMore ? 96 : 48;
    return sorted.slice(0, limit);
  }, [filtered, q, showMore]);

  return (
    <section className="min-h-[calc(100svh-var(--app-header-h,0px))] flex items-center justify-center py-10 sm:py-14">
      <div className="w-full max-w-5xl px-4 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="relative">
            <Input
              ref={searchInputRef}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="h-14 sm:h-16 w-full rounded-full border border-white/15 bg-white/[0.04] px-6 pr-14 text-lg text-foreground placeholder:text-muted-foreground/70 shadow-sm backdrop-blur-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/35"
              aria-label="Search"
            />
            {searchTerm.trim().length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onSearchTermChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="truncate">
            {q ? `Matches: ${filtered.length}` : "Quick launch"}
          </span>
          <div className="flex items-center gap-2">
            {!q && (
              <Button
                type="button"
                variant="ghost"
                className="h-8 px-2 rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                onClick={() => setShowMore((v) => !v)}
              >
                {showMore ? "Show less" : "Show more"}
              </Button>
            )}
            <a
              href="#categories"
              className="h-8 inline-flex items-center rounded-full px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Categories
            </a>
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-10">
            {quickLinks.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => onLinkClick(link)}
                className="group flex flex-col items-center gap-2 rounded-2xl px-2 py-2.5 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label={link.name}
                title={link.name}
              >
                <img
                  src={getFaviconUrl(link.url || link.defaultUrl || "")}
                  alt=""
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-md object-contain"
                  loading="lazy"
                  decoding="async"
                  onError={handleFaviconError}
                />
                <span className="w-full truncate text-[13px] sm:text-sm leading-tight text-muted-foreground group-hover:text-foreground">
                  {link.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="truncate">
              {q
                ? `Showing ${Math.min(quickLinks.length, filtered.length)} of ${filtered.length}`
                : `Showing ${Math.min(quickLinks.length, links.length)} of ${links.length}`}
            </span>
            <span className="truncate">Press Enter to search Google results</span>
          </div>
        </div>
      </div>
    </section>
  );
}

