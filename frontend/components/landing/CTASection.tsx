"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  "Manage properties from one place",
  "Connect owners, agents and customers",
  "Track enquiries and site visits",
  "Make smarter decisions with useful insights",
];

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#EEF5FC] px-6 py-20 lg:px-8 lg:py-24">
      
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        
        <div className="absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#0B63F6]/10 blur-[130px]" />

        
        <div className="absolute -right-32 bottom-[-120px] h-[400px] w-[400px] rounded-full bg-[#06255C]/[0.06] blur-[120px]" />

      </div>

      
      <div className="relative z-10 mx-auto max-w-7xl">

        <div className="relative overflow-hidden rounded-[36px] bg-[#06255C] px-7 py-14 shadow-2xl shadow-[#06255C]/20 sm:px-10 sm:py-16 lg:px-16 lg:py-20">

          
          <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#0B63F6]/15 blur-[120px]" />

          <div className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-[#2F8CFF]/10 blur-[120px]" />

          
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">

            
            <div>

              
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2F8CFF]/25 bg-[#0B63F6]/10 px-4 py-2">

                <Sparkles className="h-4 w-4 text-[#7EC8FF]" />

                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7EC8FF]">
                  Get Started with EstateFlow
                </span>

              </div>

              
              <h2 className="mt-7 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">

                Ready to manage your
                <br />

                <span className="bg-gradient-to-r from-[#7EC8FF] via-[#3D9CFF] to-[#0B63F6] bg-clip-text text-transparent">
                  real estate smarter?
                </span>

              </h2>

              
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
                Bring your properties, people, enquiries, and daily operations
                together with EstateFlow — a modern platform built for growing
                real estate teams.
              </p>

              
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#0B63F6] to-[#2F8CFF] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#0B63F6]/20 transition-all duration-300 hover:-translate-y-1 hover:from-[#0957D6] hover:to-[#2384F5] hover:shadow-xl hover:shadow-[#0B63F6]/30"
                >
                  Get Started

                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/properties"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#6AAEFF]/20 bg-white/[0.05] px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#3D9CFF]/50 hover:bg-white/[0.09]"
                >
                  Explore Properties

                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

              </div>

            </div>

            
            <div className="relative">

              <div className="rounded-[28px] border border-[#6AAEFF]/20 bg-[#0B3B78]/55 p-7 backdrop-blur-sm sm:p-8">

                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7EC8FF]">
                  Everything connected
                </p>

                <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
                  One platform.
                  <br />
                  Complete control.
                </h3>

                
                <div className="mt-7 space-y-4">

                  {benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-start gap-3"
                    >

                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B63F6]/20">
                        <Check className="h-3 w-3 text-[#7EC8FF]" />
                      </div>

                      <span className="text-sm leading-6 text-white/65">
                        {benefit}
                      </span>

                    </div>
                  ))}

                </div>

                
                <div className="mt-7 border-t border-[#6AAEFF]/15 pt-6">

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      EstateFlow SaaS
                    </span>

                    <span className="flex items-center gap-2 text-xs font-semibold text-[#7EC8FF]">
                      Built for modern teams
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

          
          <div className="relative z-10 mt-12 flex flex-col items-center justify-center gap-3 border-t border-[#6AAEFF]/15 pt-7 text-center sm:flex-row sm:gap-5">

            <div className="flex items-center gap-2">

              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B63F6]/20">
                <Check className="h-3 w-3 text-[#7EC8FF]" />
              </div>

              <span className="text-xs font-medium text-white/45">
                Simple to use
              </span>

            </div>

            <span className="hidden h-3 w-px bg-[#6AAEFF]/20 sm:block" />

            <div className="flex items-center gap-2">

              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B63F6]/20">
                <Check className="h-3 w-3 text-[#7EC8FF]" />
              </div>

              <span className="text-xs font-medium text-white/45">
                Built for real estate
              </span>

            </div>

            <span className="hidden h-3 w-px bg-[#6AAEFF]/20 sm:block" />

            <div className="flex items-center gap-2">

              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B63F6]/20">
                <Check className="h-3 w-3 text-[#7EC8FF]" />
              </div>

              <span className="text-xs font-medium text-white/45">
                Modern SaaS experience
              </span>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}