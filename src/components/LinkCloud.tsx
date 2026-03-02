import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, MoreHorizontal, Search } from "lucide-react";

type Props = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  onSubmit: () => void;
  selectedCategory: string;
  onSelectedCategoryChange: (category: string) => void;
  onAddTemplateCategory?: (template: "adults" | "ai") => void;
  /** Category ids from data (e.g. keys of groupedLinks). Pills show "All" + these. */
  categoryIds?: string[];
  /** Display labels for category ids. */
  categoryLabels?: Record<string, string>;
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty("--linkcloud-h", `${el.offsetHeight}px`);
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("resize", setVar);

    const pillsScroller = el.querySelector("[data-pill-scroller]") as HTMLDivElement | null;
    const checkOverflow = () => {
      if (!pillsScroller) return;
      setHasOverflow(pillsScroller.scrollWidth > pillsScroller.clientWidth + 8);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", setVar);
      window.removeEventListener("resize", checkOverflow);
      ro.disconnect();
    };
  }, []);

  const hasAi = categoryIds.includes("ai");
  const hasAdults = categoryIds.includes("adults");
  const pillOptions: { id: string; label: string }[] = [
    { id: "all", label: "All" },
    ...categoryIds.map((id) => ({ id, label: categoryLabels[id] || id })),
    ...(!hasAi ? [{ id: "ai", label: "AI" }] : []),
    ...(!hasAdults ? [{ id: "adults", label: "Adults (18+)" }] : []),
  ];

  const MAX_INLINE_PILLS = 8;
  const inlinePills = pillOptions.slice(0, MAX_INLINE_PILLS);
  const overflowPills = pillOptions.slice(MAX_INLINE_PILLS);
  return (
    <section className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div
        ref={containerRef}
        className="w-full mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-3 border-b border-transparent"
      >
        <div className="w-full max-w-3xl mx-auto">
          <div className="mb-2 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-blue-500 to-pink-500 shadow-sm flex items-center justify-center">
                <span className="text-white text-lg font-semibold leading-none">p</span>
              </div>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  pokilo
                </span>
              </div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="h-14 sm:h-16 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-14 text-lg text-gray-900 placeholder:text-gray-500 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-400 focus:bg-white"
                aria-label="Search"
              />
              {searchTerm.trim().length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onSearchTermChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200/80"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-3 w-full max-w-7xl mx-auto relative">
          {hasOverflow && (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
            </>
          )}
          <div
            className="overflow-x-auto pb-2 no-scrollbar"
            role="tablist"
            aria-label="Filter by category"
            data-pill-scroller
          >
            <div className="flex items-center gap-2 flex-nowrap pr-4">
              {inlinePills.map(({ id, label }) => (
              <motion.div
                key={id}
                layout
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  role="tab"
                  aria-selected={selectedCategory === id}
                  className={`h-8 rounded-full px-4 text-[13px] transition-colors border ${
                    selectedCategory === id
                      ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                      : "border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (id === "ai") onAddTemplateCategory?.("ai");
                    if (id === "adults") onAddTemplateCategory?.("adults");
                    onSelectedCategoryChange(id);
                  }}
                >
                  {label}
                </Button>
              </motion.div>
              ))}

              {overflowPills.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full px-4 text-[13px] border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <MoreHorizontal className="h-4 w-4 mr-1" />
                      More ({overflowPills.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {overflowPills.map(({ id, label }) => (
                      <DropdownMenuItem
                        key={id}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

