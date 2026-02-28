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
  selectedCategory: string;
  onSelectedCategoryChange: (category: string) => void;
  onAddTemplateCategory: (template: "adults" | "ai") => void;
};

// Similarweb: Top 100 most visited websites in the USA (Dec 2025)
// Source: https://similarweb.com/blog/research/market-research/most-visited-websites-usa
const TOP_US_DOMAINS_DEC_2025 = [
  "google.com",
  "youtube.com",
  "amazon.com",
  "facebook.com",
  "reddit.com",
  "yahoo.com",
  "bing.com",
  "instagram.com",
  "x.com",
  "chatgpt.com",
  "wikipedia.org",
  "walmart.com",
  "ebay.com",
  "espn.com",
  "linkedin.com",
  "usps.com",
  "tiktok.com",
  "nytimes.com",
  "office.com",
  "weather.com",
  "netflix.com",
  "fandom.com",
  "duckduckgo.com",
  "temu.com",
  "target.com",
  "etsy.com",
  "pinterest.com",
  "live.com",
  "zillow.com",
  "instructure.com",
  "cnn.com",
  "paypal.com",
  "microsoft.com",
  "twitch.tv",
  "xvideos.com",
  "pornhub.com",
  "xnxx.com",
  "fedex.com",
  "sharepoint.com",
  "xhamster.com",
  "roblox.com",
  "gemini.google.com",
  "chaturbate.com",
  "foxnews.com",
  "ups.com",
  "aol.com",
  "shop.app",
  "chase.com",
  "discord.com",
  "homedepot.com",
  "duosecurity.com",
  "imdb.com",
  "apple.com",
  "office365.com",
  "nextdoor.com",
  "zoom.us",
  "people.com",
  "onlyfans.com",
  "stripchat.com",
  "msn.com",
  "hbomax.com",
  "indeed.com",
  "bestbuy.com",
  "spotify.com",
  "narvar.com",
  "quora.com",
  "macys.com",
  "canva.com",
  "hulu.com",
  "capitalone.com",
  "citi.com",
  "finance.yahoo.com",
  "brave.com",
  "peacocktv.com",
  "usatoday.com",
  "t-mobile.com",
  "yelp.com",
  "xfinity.com",
  "lowes.com",
  "att.com",
  "accuweather.com",
  "costco.com",
  "bankofamerica.com",
  "archiveofourown.org",
  "bbc.com",
  "craigslist.org",
  "fidelity.com",
  "okta.com",
  "shopify.com",
  "wellsfargo.com",
  "kohls.com",
  "allrecipes.com",
  "clever.com",
  "realtor.com",
  "disneyplus.com",
  "nypost.com",
  "news.google.com",
  "wayfair.com",
  "cvs.com",
  "doordash.com",
] as const;

const TOP_US_LINKS_DEC_2025: LinkData[] = TOP_US_DOMAINS_DEC_2025.map((domain, i) => ({
  key: `us-top-${String(i + 1).padStart(3, "0")}-${domain.replace(/\./g, "-")}`,
  name: domain,
  defaultUrl: `https://${domain}`,
  category: "top-us",
  clicks: 0,
  createdAt: "2025-12-01T00:00:00.000Z",
}));

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
  selectedCategory,
  onSelectedCategoryChange,
  onAddTemplateCategory,
}: Props) {
  const q = searchTerm.trim().toLowerCase();

  const filtered = useMemo(() => {
    const base =
      selectedCategory === "all"
        ? q
          ? [...TOP_US_LINKS_DEC_2025, ...links]
          : TOP_US_LINKS_DEC_2025
        : links.filter((l) => l.category === selectedCategory);
    if (!q) return base;
    return base.filter((l) => {
      const name = l.name?.toLowerCase() ?? "";
      const url = (l.url || l.defaultUrl || "").toLowerCase();
      const cat = (l.category || "").toLowerCase();
      return name.includes(q) || url.includes(q) || cat.includes(q);
    });
  }, [links, q, selectedCategory]);

  const quickLinks = useMemo(() => {
    // Always show the top-100 US list by default.
    if (selectedCategory === "all" && !q) return filtered.slice(0, 100);

    const base = filtered;
    const sorted = [...base].sort((a, b) => {
      const d = scoreLink(b) - scoreLink(a);
      if (d !== 0) return d;
      return a.name.localeCompare(b.name);
    });
    const limit = q ? 72 : 48;
    return sorted.slice(0, limit);
  }, [filtered, q, selectedCategory]);

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
              className="h-14 sm:h-16 w-full rounded-full border border-border bg-card px-6 pr-14 text-lg text-foreground placeholder:text-muted-foreground/60 shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
              aria-label="Search"
            />
            {searchTerm.trim().length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onSearchTermChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </form>

        <div
          className="mt-3 flex flex-wrap items-center justify-center gap-2"
          role="group"
          aria-label="Quick categories"
        >
          {["all", "ai", "adults"].map((cat) => (
            <Button
              key={cat}
              type="button"
              variant="ghost"
              className={`h-8 rounded-full px-4 text-xs font-medium border transition-colors
                ${selectedCategory === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted hover:border-muted-foreground/40"
                }`}
              aria-pressed={selectedCategory === cat}
              onClick={() => {
                if (cat === "ai") onAddTemplateCategory("ai");
                if (cat === "adults") onAddTemplateCategory("adults");
                onSelectedCategoryChange(cat);
              }}
            >
              {cat === "all" ? "All" : cat === "ai" ? "AI" : "Adults (18+)"}
            </Button>
          ))}
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-10">
            {quickLinks.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => onLinkClick(link)}
                className="group flex flex-col items-center gap-2 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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
                <span className="w-full truncate text-[12px] sm:text-[13px] leading-tight text-muted-foreground group-hover:text-primary">
                  {link.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="truncate">
              {q
                ? `Showing ${Math.min(quickLinks.length, filtered.length)} of ${filtered.length}`
                : selectedCategory === "all"
                  ? `Showing ${Math.min(quickLinks.length, 100)} of 100 (Top US sites)`
                  : `Showing ${Math.min(quickLinks.length, filtered.length)} of ${filtered.length}`}
            </span>
            <span className="truncate">Press Enter to search Google results</span>
          </div>
        </div>
      </div>
    </section>
  );
}

