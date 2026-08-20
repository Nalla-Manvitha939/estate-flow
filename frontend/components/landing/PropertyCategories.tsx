"use client";

import {
  ArrowUpRight,
  Building2,
  Home,
  Hotel,
  LandPlot,
  Waves,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "Residential",
    description:
      "Comfortable homes, apartments, and residences for modern living.",
    icon: Home,
    count: "1,250+ Properties",
  },
  {
    id: 2,
    title: "Commercial",
    description:
      "Professional spaces designed for businesses, offices, and companies.",
    icon: Building2,
    count: "680+ Properties",
  },
  {
    id: 3,
    title: "Luxury Properties",
    description:
      "Premium properties with exceptional locations, design, and amenities.",
    icon: Hotel,
    count: "320+ Properties",
  },
  {
    id: 4,
    title: "Apartments",
    description:
      "Modern apartments with flexible options for individuals and families.",
    icon: Building2,
    count: "920+ Properties",
  },
  {
    id: 5,
    title: "Plots & Land",
    description:
      "Land and development opportunities for your next investment.",
    icon: LandPlot,
    count: "410+ Properties",
  },
  {
    id: 6,
    title: "Waterfront",
    description:
      "Beautiful properties located near beaches, lakes, rivers, and marinas.",
    icon: Waves,
    count: "180+ Properties",
  },
];

export default function PropertyCategories() {
  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden bg-[#EEF5FC] px-6 py-20 lg:px-8 lg:py-24"
    >
      
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-160px] top-[15%] h-[380px] w-[380px] rounded-full bg-[#0B63F6]/[0.055] blur-[120px]" />

        <div className="absolute bottom-[-180px] left-[-140px] h-[400px] w-[400px] rounded-full bg-[#06255C]/[0.04] blur-[120px]" />
      </div>

      
      <div className="relative z-10 mx-auto max-w-7xl">
        
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#0B63F6]">
              Property Categories
            </p>

            <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#06255C] sm:text-5xl lg:text-6xl">
              Explore Properties
              <br />
              <span className="bg-gradient-to-r from-[#0B63F6] via-[#2F8CFF] to-[#4DA3FF] bg-clip-text text-transparent">
                Built for Every Need
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#526A88] sm:text-lg">
              Discover different property types and find the right space for
              your lifestyle, business, or next investment.
            </p>
          </div>

          
          <Link
            href="/properties"
            className="group flex w-fit shrink-0 items-center gap-3 rounded-xl border border-[#BFD9F7] bg-[#FFFFFF] px-6 py-4 text-sm font-semibold text-[#06255C] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2F8CFF] hover:shadow-lg hover:shadow-[#0B63F6]/10"
          >
            Explore Properties

            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </div>

        
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.id}
                href={`/properties?category=${category.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="group relative overflow-hidden rounded-[26px] border border-[#D6E5F5] bg-[#FFFFFF] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[#8CBFFF] hover:bg-white hover:shadow-xl hover:shadow-[#0B63F6]/10 sm:p-8"
              >
                
                <div className="flex items-start justify-between">
                  
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06255C] via-[#0B3B78] to-[#0B63F6] text-[#9CCBFF] shadow-sm transition-all duration-300 group-hover:from-[#0B63F6] group-hover:to-[#2F8CFF] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#0B63F6]/25">
                    <Icon className="h-6 w-6" />
                  </div>

                  
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D6E5F5] bg-[#F8FBFF] text-[#526A88] transition-all duration-300 group-hover:border-[#2F8CFF] group-hover:bg-gradient-to-br group-hover:from-[#0B63F6] group-hover:to-[#2F8CFF] group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>

                
                <div className="mt-7">
                  <h3 className="text-2xl font-bold tracking-tight text-[#06255C] transition-colors duration-300 group-hover:text-[#0B63F6]">
                    {category.title}
                  </h3>

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#526A88]">
                    {category.description}
                  </p>
                </div>

                
                <div className="mt-6 flex items-center justify-between border-t border-[#D6E5F5] pt-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#526A88] transition-colors duration-300 group-hover:text-[#0B63F6]">
                    {category.count}
                  </span>

                  <span className="text-xs font-semibold text-[#06255C]">
                    Explore
                  </span>
                </div>

                
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#0B63F6] to-[#2F8CFF] transition-all duration-500 group-hover:w-full" />
              </Link>
            );
          })}
        </div>

        
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0B63F6]" />

            <span className="text-sm font-semibold text-[#06255C]">
              Find the right property for your next move
            </span>
          </div>

          <p className="mt-2 text-sm text-[#526A88]">
            Residential • Commercial • Luxury • Apartments • Land • Waterfront
          </p>
        </div>
      </div>
    </section>
  );
}