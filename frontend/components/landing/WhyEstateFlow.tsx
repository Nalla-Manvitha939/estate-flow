"use client";

import {
  ArrowUpRight,
  BarChart3,
  Building2,
  Check,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const benefits = [
  {
    icon: Building2,
    title: "Centralized Property Management",
    description:
      "Manage properties, units, availability, and important property information from one organized workspace.",
  },
  {
    icon: Users,
    title: "Connected Property Network",
    description:
      "Keep owners, tenants, agents, and property relationships connected through one seamless platform.",
  },
  {
    icon: BarChart3,
    title: "Clear Business Insights",
    description:
      "Understand your property portfolio with simple dashboards, useful metrics, and actionable insights.",
  },
  {
    icon: Zap,
    title: "Faster Daily Operations",
    description:
      "Reduce repetitive work and manage everyday real estate operations with faster, smarter workflows.",
  },
];

const highlights = [
  "Manage your complete property portfolio",
  "Keep owners, tenants and agents organized",
  "Track important business information",
  "Make better decisions with useful insights",
];

export default function WhyEstateFlow() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#EEF5FC] px-6 py-28 lg:px-8 lg:py-36"
    >
      
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-180px] top-[20%] h-[420px] w-[420px] rounded-full bg-[#0B63F6]/[0.07] blur-[120px]" />

        <div className="absolute bottom-[-200px] right-[-150px] h-[450px] w-[450px] rounded-full bg-[#06255C]/[0.05] blur-[120px]" />
      </div>

      
      <div className="relative z-10 mx-auto max-w-7xl">

        
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-[#0B63F6]">
            Why EstateFlow
          </p>

          <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#06255C] sm:text-5xl lg:text-6xl">
            Everything Your
            <br />
            <span className="bg-gradient-to-r from-[#0B63F6] via-[#2F8CFF] to-[#4DA3FF] bg-clip-text text-transparent">
              Real Estate Business Needs
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#526A88] sm:text-lg">
            EstateFlow brings property management, people, insights, and
            everyday operations together in one modern SaaS platform.
          </p>

        </div>

        
        <div className="mt-20 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">

          
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#03132B] via-[#06255C] to-[#0B3B78] p-8 text-white shadow-2xl shadow-[#06255C]/20 sm:p-10 lg:p-12">

            
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0B63F6]/20 blur-[90px]" />

            <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#2F8CFF]/10 blur-[100px]" />

            
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "55px 55px",
              }}
            />

            <div className="relative z-10">

              
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2F8CFF]/30 bg-[#0B63F6]/10 text-[#9CCBFF]">
                <ShieldCheck className="h-7 w-7" />
              </div>

              
              <h3 className="mt-8 max-w-md text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Built for modern
                <br />
                <span className="text-[#9CCBFF]">
                  property teams.
                </span>
              </h3>

              <p className="mt-5 max-w-md text-base leading-7 text-white/70">
                Stop managing scattered property information across different
                tools. EstateFlow gives your team one place to manage and grow
                your real estate business.
              </p>

              
              <div className="mt-9 space-y-4">

                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B63F6]/15">
                      <Check className="h-3 w-3 text-[#9CCBFF]" />
                    </div>

                    <span className="text-sm leading-6 text-white/75">
                      {highlight}
                    </span>
                  </div>
                ))}

              </div>

              
              <Link
                href="/register"
                className="group mt-10 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#0B63F6] to-[#2F8CFF] px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:from-[#0954D9] hover:to-[#0B63F6] hover:shadow-xl hover:shadow-[#0B63F6]/25"
              >
                Start Managing Smarter

                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

            </div>
          </div>

          
          <div className="grid gap-5 sm:grid-cols-2">

            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="group relative overflow-hidden rounded-[28px] border border-[#D6E5F5] bg-[#FFFFFF] p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#8CBFFF] hover:shadow-xl hover:shadow-[#0B63F6]/10 sm:p-8"
                >

                  
                  <div className="absolute right-7 top-7 text-xs font-bold tracking-[0.2em] text-[#D6E5F5] transition-colors duration-300 group-hover:text-[#0B63F6]/30">
                    0{index + 1}
                  </div>

                  
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7F2FF] text-[#0B63F6] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#0B63F6] group-hover:to-[#2F8CFF] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  
                  <h3 className="mt-7 max-w-[250px] text-xl font-bold tracking-tight text-[#06255C]">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#526A88]">
                    {benefit.description}
                  </p>

                  
                  <div className="mt-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#A9BED6] transition-colors duration-300 group-hover:text-[#0B63F6]">
                    EstateFlow
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>

                </article>
              );
            })}

          </div>
        </div>

        
        <div className="mt-8 rounded-[24px] border border-[#D6E5F5] bg-[#FFFFFF] px-6 py-6 shadow-sm sm:px-8">

          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7F2FF]">
                <Check className="h-5 w-5 text-[#0B63F6]" />
              </div>

              <div>
                <p className="text-sm font-bold text-[#06255C]">
                  Everything connected in one place
                </p>

                <p className="mt-1 text-xs text-[#526A88]">
                  Properties • Owners • Tenants • Agents • Analytics
                </p>
              </div>

            </div>

            <Link
              href="/properties"
              className="group flex items-center gap-2 text-sm font-semibold text-[#06255C] transition-colors hover:text-[#0B63F6]"
            >
              Explore EstateFlow

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}