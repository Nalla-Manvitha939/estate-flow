"use client";

import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";

const productLinks = [
  { label: "Properties", href: "/properties" },
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Dashboard", href: "/dashboard" },
];

const companyLinks = [
  { label: "About Us", href: "#" },
  { label: "Contact", href: "#contact" },
  { label: "Testimonials", href: "#" },
  { label: "Get Started", href: "/register" },
];

const supportLinks = [
  { label: "Help Center", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "FAQs", href: "#" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#06255C] text-white"
    >
      
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

          
          <div className="max-w-sm">

            
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#7EC8FF]/80">
                <div className="h-4 w-4 rotate-45 border border-[#7EC8FF]" />
              </div>

              <span className="text-xl font-semibold tracking-tight">
                Estate<span className="text-[#7EC8FF]">Flow</span>
              </span>
            </Link>

            
            <p className="mt-6 text-sm leading-7 text-white/60">
              A modern real estate management platform designed to connect
              properties, owners, agents, customers, and everyday operations
              in one simple workspace.
            </p>

            
            <div className="mt-7 space-y-3">

              <div className="flex items-center gap-3 text-sm text-white/60">
                <MapPin className="h-4 w-4 shrink-0 text-[#7EC8FF]" />
                <span>Vijayawada, India</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="h-4 w-4 shrink-0 text-[#7EC8FF]" />
                <span>hello@estateflow.com</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="h-4 w-4 shrink-0 text-[#7EC8FF]" />
                <span>+91 90000 00000</span>
              </div>

            </div>

            
            <div className="mt-7 flex items-center gap-3">

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#2F8CFF]/40 hover:bg-[#0B63F6] hover:text-white"
              >
                in
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#2F8CFF]/40 hover:bg-[#0B63F6] hover:text-white"
              >
                ig
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#2F8CFF]/40 hover:bg-[#0B63F6] hover:text-white"
              >
                f
              </a>

            </div>

          </div>

          
          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
              Platform
            </h3>

            <ul className="mt-6 space-y-4">

              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/55 transition-colors duration-200 hover:text-[#7EC8FF]"
                  >
                    {link.label}

                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}

            </ul>

          </div>

          
          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
              Company
            </h3>

            <ul className="mt-6 space-y-4">

              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/55 transition-colors duration-200 hover:text-[#7EC8FF]"
                  >
                    {link.label}

                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}

            </ul>

          </div>

          
          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
              Support
            </h3>

            <ul className="mt-6 space-y-4">

              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/55 transition-colors duration-200 hover:text-[#7EC8FF]"
                  >
                    {link.label}

                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}

            </ul>

          </div>

        </div>

        
        <div className="mt-14 rounded-[24px] border border-[#6AAEFF]/20 bg-white/[0.04] p-6 sm:p-7">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-sm font-bold text-white">
                Stay connected with EstateFlow
              </p>

              <p className="mt-1 text-sm text-white/50">
                Get useful real estate insights and platform updates.
              </p>
            </div>

            <Link
              href="/register"
              className="group flex w-fit items-center gap-3 rounded-xl bg-gradient-to-r from-[#0B63F6] to-[#2F8CFF] px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:from-[#0957D6] hover:to-[#2384F5] hover:shadow-lg hover:shadow-[#0B63F6]/20"
            >
              Get Started

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

          </div>

        </div>

        
        <div className="mt-12 border-t border-[#6AAEFF]/15 pt-7">

          <div className="flex flex-col gap-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} EstateFlow. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-5">

              <Link
                href="#"
                className="transition-colors hover:text-[#7EC8FF]"
              >
                Privacy
              </Link>

              <Link
                href="#"
                className="transition-colors hover:text-[#7EC8FF]"
              >
                Terms
              </Link>

              <Link
                href="#"
                className="transition-colors hover:text-[#7EC8FF]"
              >
                Cookies
              </Link>

            </div>

          </div>

        </div>

      </div>

      
      <div className="h-1 bg-gradient-to-r from-transparent via-[#2F8CFF] to-transparent opacity-80" />

    </footer>
  );
}