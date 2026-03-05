import React, { useMemo, useState } from "react";
import { LinkData } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SearchChip } from './SearchChip';
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

// Map draggable links to quick category tabs
const DAILY_LINK_TO_TAB: Record<string, string> = {
  'ChatGPT': 'ai', 'Gemini': 'ai', 'Midjourney': 'ai', 'Leonardo': 'ai',
  'Perplexity': 'ai', 'Claude': 'ai',
  'Amazon': 'shopping', 'Walmart': 'shopping', 'eBay': 'shopping',
  'Etsy': 'shopping', 'AliExpress': 'shopping',
  'Yahoo': 'news', 'NY Times': 'news', 'CNN': 'news',
  'Fox News': 'news', 'Google News': 'news',
  'Netflix': 'entertainment', 'SoundCloud': 'entertainment',
  'IMDb': 'entertainment', 'Spotify': 'entertainment',
  'Ticketmaster': 'entertainment', 'YouTube Music': 'entertainment',
  'Grammarly': 'productivity', 'Office': 'productivity', 'Canva': 'productivity',
  'Google': 'productivity', 'Google Drive': 'productivity', 'Wikipedia': 'productivity',
  'Google Calendar': 'productivity', 'Google Maps': 'productivity',
  'Google Photos': 'productivity', 'Gmail': 'productivity',
  'Google Translate': 'productivity', 'Google Keep': 'productivity',
  'Google Meet': 'productivity', 'Google Chat': 'productivity',
  'Google Docs': 'productivity', 'Bing': 'productivity',
  'Google Sheets': 'productivity', 'Google Slides': 'productivity',
  'iCloud': 'productivity', 'Dropbox': 'productivity',
  'Google Play': 'productivity', 'App Store': 'productivity',
  'Weather': 'productivity', 'Waze': 'productivity',
  'PayPal': 'finance',
  'Airbnb': 'shopping', 'Booking': 'shopping', 'Uber': 'shopping',
};

const CATEGORY_TO_TAB: Record<string, string> = {
  'society': 'social',
  'tools': 'productivity',
  'ai': 'ai',
  'adults': 'adults',
};

function getLinkTabCategory(link: { name?: string; category?: string }): string {
  if (link.category === 'daily' && link.name && DAILY_LINK_TO_TAB[link.name]) {
    return DAILY_LINK_TO_TAB[link.name];
  }
  if (link.category && CATEGORY_TO_TAB[link.category]) {
    return CATEGORY_TO_TAB[link.category];
  }
  return link.category || 'all';
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
        : links.filter((l) => getLinkTabCategory(l) === selectedCategory);
    if (!q) return base;
    return base.filter((l) => {
      const name = l.name?.toLowerCase() ?? "";
      const url = (l.url || l.defaultUrl || "").toLowerCase();
      const cat = (l.category || "").toLowerCase();
      return name.includes(q) || url.includes(q) || cat.includes(q);
    });
  }, [links, q, selectedCategory]);

    const [categoryFontSize, setCategoryFontSize] = useState(13);
  const [categoryOpacity, setCategoryOpacity] = useState(0.55);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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
    <section className="flex items-center justify-center pt-24 sm:pt-28 pb-0">
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
              className="h-14 sm:h-16 w-full rounded-md border-2 border-border bg-card px-6 pr-14 text-base text-foreground placeholder:text-muted-foreground/60 shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                  style={{opacity: categoryOpacity, fontSize: categoryFontSize + 'px'}}
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
              <SearchChip query={searchTerm} links={filtered} onClear={() => onSearchTermChange('')} />

        <div
          className="mt-3 flex flex-wrap items-center justify-center gap-1.5 bg-muted/50 rounded-xl p-1.5 border border-border/50"
          role="group"
          aria-label="Quick categories"
        >
          <div className="flex items-center gap-4 px-2 mb-2">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Size</span>
                <input type="range" min={10} max={20} step={1} value={categoryFontSize} onChange={(e) => setCategoryFontSize(Number(e.target.value))} className="w-20 h-1 accent-primary" />
                <span className="w-8 text-center font-mono" style={{opacity: categoryOpacity}}>{categoryFontSize}px</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Opacity</span>
                <input type="range" min={0.2} max={1} step={0.05} value={categoryOpacity} onChange={(e) => setCategoryOpacity(Number(e.target.value))} className="w-20 h-1 accent-primary" />
                <span className="w-8 text-center font-mono" style={{opacity: categoryOpacity}}>{Math.round(categoryOpacity * 100)}%</span>
              </label>
            </div>
            <div className="flex items-center justify-between bg-muted/50 rounded-xl p-1.5 border border-border/50" role="tablist" aria-label="Quick categories" style={{opacity: categoryOpacity}}>
              <Button
                variant="default"
                size="sm"
                className="text-xs px-3 py-1 rounded-lg capitalize font-medium"
                style={{fontSize: categoryFontSize + 'px'}}
              >
                {selectedCategory === "all" ? "All" : selectedCategory}
              </Button>
              <div className="relative"
                onMouseEnter={() => setShowCategoryDropdown(true)}
                onMouseLeave={() => setShowCategoryDropdown(false)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs px-3 py-1 rounded-lg"
                  style={{fontSize: categoryFontSize + 'px'}}
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  More ▾
                </Button>
                {showCategoryDropdown && (
                  <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg p-1.5 flex flex-col gap-0.5 min-w-[140px]">
                    {["all", "ai", "social", "shopping", "news", "entertainment", "productivity", "finance", "adults"].filter(cat => cat !== selectedCategory).map((cat) => (
                      <Button
                        key={cat}
                        variant="ghost"
                        size="sm"
                        onClick={() => { onSelectedCategoryChange(cat); setShowCategoryDropdown(false); }}
                        className="text-xs px-3 py-1 rounded-lg capitalize w-full justify-start"
                        style={{fontSize: categoryFontSize + 'px'}}
                      >
                        {cat === "all" ? "All" : cat}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </div>

        <div className="mt-10 sm:mt-12" style={{display: "none"}}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-10">
            {false && quickLinks.map((link) => (
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
                <span className="w-full truncate text-[13px] sm:text-[14px] leading-tight text-muted-foreground group-hover:text-primary">
                  {link.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground" style={{display: "none"}}>
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

