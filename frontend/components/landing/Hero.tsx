"use client";

import { ChevronDown, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState("Buy");

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[760px] overflow-hidden bg-[#061A3A] text-white"
    >
      <div className="absolute inset-0">
        <Image
          src="/hero/hero-property.jpg"
          alt="Luxury waterfront properties and city"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_45%]"
        />

        <div className="absolute inset-0 bg-[#061A3A]/50" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,26,58,0.72)_0%,rgba(6,26,58,0.52)_30%,rgba(11,71,184,0.24)_58%,rgba(3,19,43,0.18)_100%)]" />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#03132B]/90 via-[#061A3A]/55 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#03132B]/95 via-[#061A3A]/50 to-transparent" />
      </div>

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <Link href="#home" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2F8CFF]/80 bg-[#061A3A]/45 backdrop-blur-sm">
            <div className="h-4 w-4 rotate-45 border border-[#4DA3FF]" />
          </div>

          <span className="text-xl font-semibold tracking-tight text-white drop-shadow-lg">
            Estate<span className="text-[#EAF3FF]">Flow</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          <Link
            href="#home"
            className="text-sm font-medium text-white transition-all duration-200 hover:text-[#4DA3FF]"
          >
            Home
          </Link>

          <Link
            href="#features"
            className="text-sm font-medium text-white drop-shadow-md transition-all duration-200 hover:text-[#4DA3FF]"
          >
            Features
          </Link>

          <button
            type="button"
            onClick={() => scrollToSection("pricing")}
            className="text-sm font-medium text-white drop-shadow-md transition-all duration-200 hover:text-[#4DA3FF]"
          >
            Pricing
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
            className="text-sm font-medium text-white drop-shadow-md transition-all duration-200 hover:text-[#4DA3FF]"
          >
            About
          </button>

          <Link
            href="#contact"
            className="text-sm font-medium text-white drop-shadow-md transition-all duration-200 hover:text-[#4DA3FF]"
          >
            Contact
          </Link>
        </nav>

        {/* Login + Get Started */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[#2563EB] hover:bg-[#2563EB]"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#1D4ED8]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="rounded-lg border border-white/20 bg-[#061A3A]/50 p-2 backdrop-blur-md md:hidden"
        >
          <div className="flex w-5 flex-col gap-1">
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
          </div>
        </button>
      </header>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-24 text-center lg:px-8 lg:pt-28">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4DA3FF] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-sm">
            Modern Real Estate Management
          </p>
        </div>

        <div className="max-w-5xl">
          <h1 className="text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white drop-shadow-[0_5px_20px_rgba(0,0,0,0.85)] sm:text-6xl lg:text-[76px]">
            Manage Your Properties
            <br />
            <span className="bg-gradient-to-r from-white via-[#EAF3FF] to-[#4DA3FF] bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#F4F8FF] drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)] sm:text-lg">
            The original platform for managing properties, discovering
            opportunities, connecting customers, and growing your real estate
            business.
          </p>
        </div>

        <div className="mt-12 w-full max-w-5xl">
          <div className="rounded-[20px] border border-[#7FB8F5]/40 bg-[#061A3A]/70 p-2 shadow-2xl shadow-[#03132B]/70 backdrop-blur-md">
            <div className="flex items-center border-b border-[#BFD9F7]/20 px-3">
              {["Buy", "Rent", "Commercial"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 py-3.5 text-sm font-medium transition ${
                    activeTab === tab
                      ? "text-white"
                      : "text-[#BFD0E6] hover:text-white"
                  }`}
                >
                  {tab}

                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-9 -translate-x-1/2 bg-[#4DA3FF]" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-[1.25fr_1fr_1fr_auto]">
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl border border-[#BFD9F7]/15 bg-[#0B2148]/45 px-4 py-4 text-left transition hover:border-[#4DA3FF]/40 hover:bg-[#0B2148]/75"
              >
                <MapPin className="h-5 w-5 shrink-0 text-[#4DA3FF]" />

                <div>
                  <p className="text-xs text-[#9DB3D1]">Location</p>

                  <p className="mt-0.5 text-sm font-medium text-white">
                    Select location
                  </p>
                </div>

                <ChevronDown className="ml-auto h-4 w-4 text-[#9DB3D1]" />
              </button>

              <button
                type="button"
                className="flex items-center gap-3 rounded-xl border border-[#BFD9F7]/15 bg-[#0B2148]/45 px-4 py-4 text-left transition hover:border-[#4DA3FF]/40 hover:bg-[#0B2148]/75"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#9DB3D1]">
                  <div className="h-2 w-2 rounded-sm bg-[#4DA3FF]" />
                </div>

                <div>
                  <p className="text-xs text-[#9DB3D1]">Property Type</p>

                  <p className="mt-0.5 text-sm font-medium text-white">
                    All Properties
                  </p>
                </div>

                <ChevronDown className="ml-auto h-4 w-4 text-[#9DB3D1]" />
              </button>

              <button
                type="button"
                className="flex items-center gap-3 rounded-xl border border-[#BFD9F7]/15 bg-[#0B2148]/45 px-4 py-4 text-left transition hover:border-[#4DA3FF]/40 hover:bg-[#0B2148]/75"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#9DB3D1] text-[10px] font-bold text-[#EAF3FF]">
                  ₹
                </div>

                <div>
                  <p className="text-xs text-[#9DB3D1]">Price Range</p>

                  <p className="mt-0.5 text-sm font-medium text-white">
                    Any Price
                  </p>
                </div>

                <ChevronDown className="ml-auto h-4 w-4 text-[#9DB3D1]" />
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B63F6] via-[#2F8CFF] to-[#1683FF] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#0B63F6]/30 transition hover:from-[#0847B8] hover:via-[#0B63F6] hover:to-[#2F8CFF]"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-[#EAF3FF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          <div>
            <span className="font-semibold text-white">2,500+</span>{" "}
            Properties
          </div>

          <div className="hidden h-4 w-px bg-[#7FB8F5]/50 sm:block" />

          <div>
            <span className="font-semibold text-white">850+</span> Owners
          </div>

          <div className="hidden h-4 w-px bg-[#7FB8F5]/50 sm:block" />

          <div>
            <span className="font-semibold text-white">120+</span> Agents
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full bg-[#2F8CFF]/20 blur-3xl" />
    </section>
  );
}