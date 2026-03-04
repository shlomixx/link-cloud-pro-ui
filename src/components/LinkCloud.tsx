import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, ChevronDown } from "lucide-react";

type Props = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  onSubmit: () => void;
  selectedCategory: string | null;
  onSelectedCategoryChange: (category: string | null) => void;
  onAddTemplateCategory?: (template: "adults" | "ai") => void;
  /** Category ids from data (e.g. keys of groupedLinks). Pills show "All" + these. */
  categoryIds?: string[];
  /** Display labels for category ids. */
  categoryLabels?: Record<string, string>;
};

/* Custom geometric SVG logo mark — interlocking nodes/links */
export function PokiLogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Node top-right */}
      <circle cx="17" cy="6" r="3" fill="currentColor" opacity="0.9" />
      {/* Node bottom-left */}
      <circle cx="7" cy="18" r="3" fill="currentColor" opacity="0.9" />
      {/* Node center */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.6" />
      {/* Link from center to top-right */}
      <line x1="14.1" y1="10.1" x2="15.1" y2="8.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      {/* Link from center to bottom-left */}
      <line x1="9.9" y1="13.9" x2="8.9" y2="15.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      {/* Subtle arc connector */}
      <path
        d="M 7 15 Q 12 9 17 9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.25"
      />
    </svg>
  );
}

/* ── Fixed tab definitions ── */
const INLINE_TABS = [
  { id: "__all__", label: "All" },
  { id: "ai-tools", label: "\u{1F916} AI Tools" },
  { id: "google", label: "\u{1F4E7} Google Workspace" },
  { id: "search", label: "\u{1F50D} Search & Browse" },
  { id: "media", label: "\u{1F3AC} Media & Entertainment" },
];

const MORE_TABS = [
  { id: "news", label: "\u{1F4F0} News" },
  { id: "shopping", label: "\u{1F6D2} Shopping" },
  { id: "travel", label: "\u{1F3E0} Travel & Services" },
  { id: "apps", label: "\u{2601}\u{FE0F} Apps & Cloud" },
];

export function LinkCloud({
  searchTerm,
  onSearchTermChange,
  searchInputRef,
  onSubmit,
  selectedCategory,
  onSelectedCategoryChange,
  onAddTemplateCategory,
  categoryIds = [],
  categoryLabels = {},
}: Props) {
  // Build dynamic extra tabs: "adults" and "ai" template triggers
  const hasAi = categoryIds.includes("ai");
  const hasAdults = categoryIds.includes("adults");

  // Extra dynamic pills that go in the MORE dropdown
  const dynamicMore = [
    ...MORE_TABS,
    ...(!hasAi ? [{ id: "ai", label: "AI" }] : []),
    ...(!hasAdults ? [{ id: "adults", label: "Adults (18+)" }] : []),
  ];

  // Check if currently selected tab is in the "MORE" dropdown (to highlight MORE button)
  const moreIds = new Set(dynamicMore.map((t) => t.id));
  const isMoreActive = moreIds.has(selectedCategory);

  // Get display label for currently selected "more" tab
  const activeMoreLabel = isMoreActive
    ? dynamicMore.find((t) => t.id === selectedCategory)?.label || "More"
    : null;

  // Is ALL tab active? (selectedCategory === null)
  const isAllActive = selectedCategory === null;

  return (
    <section
      className={`hero-section${isAllActive ? "" : " hero-section--compact"}`}
      aria-label="Search and navigation"
    >
      {/* Greeting — only when ALL is active */}
      {isAllActive && (
        <>
          <h1 className="hero-greeting">
            Good night, <span className="hero-greeting-name">pokilo</span>
          </h1>
          <p className="hero-subtitle">What would you like to open?</p>
        </>
      )}

      {/* Search bar — pill with floating shadow + magnifying glass icon */}
      <div className="search-wrapper">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={searchInputRef}
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Search your links..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="hero-search"
            aria-label="Search"
          />
          {searchTerm.trim().length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onSearchTermChange("")}
              className="absolute right-7 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-[#9CA3AF] hover:text-[#6B6B6B] dark:hover:text-[#8B8B8B] hover:bg-black/5 dark:hover:bg-white/10 transition-all z-10"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>

      {/* Category tabs — centered pills, no container bg */}
      <div
        className="hero-tabs"
        role="tablist"
        aria-label="Filter by category"
      >
        {/* Inline tabs: ALL, AI Tools, Google Workspace, Search & Browse, Media */}
        {INLINE_TABS.map(({ id, label }) => (
          <Button
            key={id}
            type="button"
            variant="ghost"
            size="sm"
            role="tab"
            aria-selected={id === "__all__" ? selectedCategory === null || selectedCategory === "" : selectedCategory === id}
            className={`category-pill flex-shrink-0 ${
              (id === "__all__" ? selectedCategory === null || selectedCategory === "" : selectedCategory === id)
                ? "active"
                : ""
            }`}
            onClick={() => {
              onSelectedCategoryChange(id === "__all__" ? null : id);
            }}
          >
            {label}
          </Button>
        ))}

        {/* MORE dropdown — News, Shopping, Travel & Services, Apps & Cloud + dynamic extras */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`category-pill flex-shrink-0 gap-1 ${
                isMoreActive
                  ? "active"
                  : ""
              }`}
            >
              {activeMoreLabel || "More"}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-52 rounded-xl shadow-xl border border-[#E9E9E7] dark:border-white/8 bg-white dark:bg-[#141416] p-1"
          >
            {dynamicMore.map(({ id, label }) => (
              <DropdownMenuItem
                key={id}
                className={`rounded-lg text-[13px] cursor-pointer ${
                  selectedCategory === id
                    ? "font-semibold text-[#6366f1] dark:text-[#818cf8] bg-[#F0F0EE] dark:bg-white/[0.06]"
                    : "text-[#18181B] dark:text-[#FAFAFA]"
                }`}
                onClick={() => {
                  if (id === "ai") onAddTemplateCategory?.("ai");
                  if (id === "adults") onAddTemplateCategory?.("adults");
                  onSelectedCategoryChange(id);
                }}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}
