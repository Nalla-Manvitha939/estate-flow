"use client";

import {
  ArrowUpRight,
  Check,
  Quote,
  Star,
} from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Property Owner",
    company: "Mitchell Properties",
    initials: "SM",
    rating: 5,
    message:
      "EstateFlow has made managing my property portfolio much easier. Everything I need is organized in one place, and I can quickly keep track of my properties and enquiries.",
  },
  {
    id: 2,
    name: "Daniel Anderson",
    role: "Real Estate Agent",
    company: "Prime Realty Group",
    initials: "DA",
    rating: 5,
    message:
      "The platform gives our team a much better way to manage listings, communicate with clients, and stay organized. It feels simple, modern, and professional.",
  },
  {
    id: 3,
    name: "Emily Carter",
    role: "Property Manager",
    company: "Urban Living Co.",
    initials: "EC",
    rating: 5,
    message:
      "We were looking for a modern solution to bring our property operations together. EstateFlow gives us the structure and visibility we needed without making things complicated.",
  },
];

const trustStats = [
  {
    value: "2,500+",
    label: "Properties Managed",
  },
  {
    value: "850+",
    label: "Property Owners",
  },
  {
    value: "120+",
    label: "Real Estate Agents",
  },
  {
    value: "98%",
    label: "Customer Satisfaction",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#06255C] px-6 py-20 text-white lg:px-8 lg:py-24">

      
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        
        <div className="absolute left-[-180px] top-[10%] h-[420px] w-[420px] rounded-full bg-[#0B63F6]/10 blur-[130px]" />

        
        <div className="absolute bottom-[-220px] right-[-160px] h-[480px] w-[480px] rounded-full bg-[#8CC8FF]/[0.035] blur-[130px]" />

        
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

      </div>

      
      <div className="relative z-10 mx-auto max-w-7xl">

        
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#6DB5FF]">
            Customer Stories
          </p>

          <h2 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Trusted by
            <br />
            <span className="bg-gradient-to-r from-[#7EC8FF] via-[#3D9CFF] to-[#0B63F6] bg-clip-text text-transparent">
              Real Estate Professionals
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            See how property owners, agents, and managers use EstateFlow to
            simplify their everyday real estate operations.
          </p>

        </div>

        
        <div className="mt-14 grid gap-5 lg:grid-cols-3">

          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="group relative overflow-hidden rounded-[28px] border border-[#4D9DFF]/20 bg-[#0B3B78]/55 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#2F8CFF]/50 hover:bg-[#0B3B78]/75 hover:shadow-2xl hover:shadow-[#00183D]/40 sm:p-8"
            >

              
              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B63F6]/15 text-[#7EC8FF]">
                  <Quote className="h-5 w-5" />
                </div>

                
                <div className="flex items-center gap-1">

                  {Array.from({ length: testimonial.rating }).map(
                    (_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-[#3D9CFF] text-[#3D9CFF]"
                      />
                    )
                  )}

                </div>

              </div>

              
              <p className="mt-7 min-h-[144px] text-[15px] leading-7 text-white/70">
                “{testimonial.message}”
              </p>

              
              <div className="my-6 h-px bg-[#6AAEFF]/15" />

              
              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0B63F6] to-[#3D9CFF] text-sm font-bold text-white shadow-lg shadow-[#0B63F6]/20">
                    {testimonial.initials}
                  </div>

                  <div>

                    <p className="text-sm font-bold text-white">
                      {testimonial.name}
                    </p>

                    <p className="mt-0.5 text-xs text-white/45">
                      {testimonial.role}
                    </p>

                  </div>

                </div>

                <div className="hidden text-right sm:block">

                  <p className="text-xs font-semibold text-white/50">
                    {testimonial.company}
                  </p>

                </div>

              </div>

              
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#0B63F6] via-[#3D9CFF] to-[#7EC8FF] transition-all duration-500 group-hover:w-full" />

            </article>
          ))}

        </div>

        
        <div className="mt-10 grid overflow-hidden rounded-[24px] border border-[#4D9DFF]/20 bg-[#0B3B78]/45 sm:grid-cols-2 lg:grid-cols-4">

          {trustStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-6 py-7 text-center ${
                index !== trustStats.length - 1
                  ? "border-b border-[#6AAEFF]/15 sm:border-r"
                  : ""
              } ${
                index === 1
                  ? "lg:border-b-0"
                  : ""
              } ${
                index === 2
                  ? "lg:border-b-0"
                  : ""
              }`}
            >

              <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {stat.value}
              </p>

              <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-white/45">
                {stat.label}
              </p>

            </div>
          ))}

        </div>

        
        <div className="mt-8 flex flex-col items-center justify-center text-center">

          <div className="flex items-center gap-2">

            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B63F6]/20">
              <Check className="h-3 w-3 text-[#7EC8FF]" />
            </div>

            <span className="text-sm font-semibold text-white/70">
              Built for teams that want to manage smarter
            </span>

          </div>

          <Link
            href="/register"
            className="group mt-4 flex items-center gap-2 text-sm font-semibold text-[#7EC8FF] transition-colors hover:text-[#FFFFFF]"
          >
            Start your EstateFlow journey

            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

        </div>

      </div>
    </section>
  );
}