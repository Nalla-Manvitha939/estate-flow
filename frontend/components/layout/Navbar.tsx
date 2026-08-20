"use client";

import {
  Bell,
  Menu,
  Search,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface NavbarProps {
  onMobileMenu: () => void;
}

interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
}

export default function Navbar({
  onMobileMenu,
}: NavbarProps) {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      setUser(null);
    }
  }, []);

  const displayName = user?.name || "Your name";

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-white/[0.08] bg-[#061A3A]/85 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.07] hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 md:flex">
            <Search className="h-4 w-4 text-white/35" />

            <input
              type="text"
              placeholder="Search properties..."
              className="w-48 bg-transparent text-sm text-white outline-none placeholder:text-white/25 lg:w-64"
            />
          </div>

          <div className="md:hidden">
            <span className="text-lg font-bold tracking-tight">
              Estate<span className="text-[#4DA3FF]">Flow</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/50 transition hover:bg-white/[0.07] hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
          </button>

          <div className="hidden h-7 w-px bg-white/10 sm:block" />

          <Link
            href="/dashboard/customer/profile"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-white/[0.05]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2F8CFF]/30 bg-[#0B2148]">
              <User className="h-4 w-4 text-[#4DA3FF]" />
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-[150px] truncate text-sm font-semibold text-white">
                {displayName}
              </p>

              <p className="text-[11px] text-white/35">
                Customer
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}