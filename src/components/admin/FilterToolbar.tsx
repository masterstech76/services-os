"use client";

import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FilterTab {
  id?: string;
  key?: string;
  label: string;
  count?: number;
}

export interface FilterToolbarProps {
  searchQuery?: string;
  searchValue?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  tabs?: FilterTab[];
  statusTabs?: FilterTab[];
  activeTab?: string;
  activeStatusTab?: string;
  onTabChange?: (tabId: string) => void;
  onStatusTabChange?: (tabId: string) => void;
  filtersSlot?: React.ReactNode;
  children?: React.ReactNode;
  totalResults?: number;
  onReset?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export function FilterToolbar({
  searchQuery,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search records...",
  tabs,
  statusTabs,
  activeTab,
  activeStatusTab,
  onTabChange,
  onStatusTabChange,
  filtersSlot,
  children,
  totalResults,
  onReset,
  hasActiveFilters = false,
  className = "",
}: FilterToolbarProps) {
  const currentSearch = searchQuery !== undefined ? searchQuery : searchValue || "";
  const currentTabs = tabs || statusTabs;
  const currentActiveTab = activeTab !== undefined ? activeTab : activeStatusTab;
  const currentTabChange = onTabChange || onStatusTabChange;
  const currentFiltersSlot = children || filtersSlot;

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-3.5 sm:p-4 shadow-xl space-y-3 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar matching Landing Page input style */}
        {onSearchChange ? (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={currentSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-10 pr-9 h-10 rounded-lg border-white/20 bg-white/5 text-xs text-white placeholder-slate-400 focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30 transition-all"
            />
            {currentSearch ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        ) : null}

        {/* Right Slot: Custom Filters / Dropdowns / Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentFiltersSlot}

          {onReset ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-10 rounded-lg border-white/20 bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 text-xs font-semibold gap-1.5 cursor-pointer transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span>Reset</span>
            </Button>
          ) : null}

          {totalResults !== undefined ? (
            <span className="text-xs text-slate-400 font-semibold pl-2">
              <strong className="text-white font-mono">{totalResults}</strong> results
            </span>
          ) : null}
        </div>
      </div>

      {/* Tabs Row */}
      {currentTabs && currentTabs.length > 0 ? (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-white/5">
          {currentTabs.map((tab) => {
            const tabKey = tab.id || tab.key || "";
            const isActive = currentActiveTab === tabKey;
            return (
              <button
                key={tabKey}
                type="button"
                onClick={() => currentTabChange?.(tabKey)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#F97316] text-white shadow-md shadow-[#F97316]/25 font-bold"
                    : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined ? (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                      isActive ? "bg-black/20 text-white font-bold" : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default FilterToolbar;
