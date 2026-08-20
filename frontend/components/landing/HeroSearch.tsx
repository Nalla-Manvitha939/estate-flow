"use client";

import { ChevronDown, MapPin, Search } from "lucide-react";
import { useState } from "react";

export default function HeroSearch() {
  const [activeTab, setActiveTab] = useState("Buy");

  return (
    <div className="w-full rounded-2xl bg-white p-2 shadow-2xl">
      <div className="flex border-b border-slate-200 px-3">
        {["Buy", "Rent", "Commercial"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-3 text-sm font-medium ${
              activeTab === tab
                ? "text-slate-900"
                : "text-slate-400"
            }`}
          >
            {tab}

            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-[#d4a84f]" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <button className="flex items-center gap-3 rounded-xl p-4 text-left hover:bg-slate-50">
          <MapPin className="h-5 w-5 text-[#d4a84f]" />

          <div>
            <p className="text-xs text-slate-400">Location</p>
            <p className="text-sm font-medium text-slate-800">
              Select location
            </p>
          </div>

          <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
        </button>

        <button className="flex items-center gap-3 rounded-xl p-4 text-left hover:bg-slate-50">
          <div>
            <p className="text-xs text-slate-400">Property Type</p>
            <p className="text-sm font-medium text-slate-800">
              All Properties
            </p>
          </div>

          <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
        </button>

        <button className="flex items-center gap-3 rounded-xl p-4 text-left hover:bg-slate-50">
          <div>
            <p className="text-xs text-slate-400">Price Range</p>
            <p className="text-sm font-medium text-slate-800">
              Any Price
            </p>
          </div>

          <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
        </button>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-[#d4a84f] px-7 py-4 text-sm font-semibold text-slate-900 hover:bg-[#e3bd68]">
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </div>
  );
}