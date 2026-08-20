"use client";

import {
  CalendarDays,
  Heart,
  Home,
  LogOut,
  MessageSquare,
  Search,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard/customer",
    icon: Home,
  },
  {
    label: "Properties",
    href: "/properties",
    icon: Search,
  },
  {
    label: "Favorites",
    href: "/dashboard/customer/favorites",
    icon: Heart,
  },
  {
    label: "Enquiries",
    href: "/dashboard/customer/enquiries",
    icon: MessageSquare,
  },
  {
    label: "Site Visits",
    href: "/dashboard/customer/visits",
    icon: CalendarDays,
  },
];

export default function MobileSidebar({
  open,
  onClose,
}: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    onClose();
    router.push("/login");
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close menu"
      />

      <aside className="relative flex h-full w-[280px] flex-col border-r border-white/[0.08] bg-[#04152F] shadow-2xl">
        <div className="flex h-[72px] items-center justify-between border-b border-white/[0.08] px-5">
          <Link
            href="/dashboard/customer"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2F8CFF]/50 bg-[#0B2148]">
              <div className="h-4 w-4 rotate-45 border border-[#4DA3FF]" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              Estate<span className="text-[#4DA3FF]">Flow</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/40 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/dashboard/customer" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                    active
                      ? "bg-[#0B63F6]/15 text-white"
                      : "text-white/50 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-[19px] w-[19px] ${
                      active
                        ? "text-[#4DA3FF]"
                        : "text-white/40"
                    }`}
                  />

                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Account
          </p>

          <Link
            href="/dashboard/customer/profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-white/50 transition hover:bg-white/[0.05] hover:text-white"
          >
            <User className="h-[19px] w-[19px]" />

            <span className="text-sm font-medium">
              Profile
            </span>
          </Link>
        </div>

        <div className="border-t border-white/[0.08] p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-white/45 transition hover:bg-red-500/[0.08] hover:text-red-300"
          >
            <LogOut className="h-[19px] w-[19px]" />

            <span className="text-sm font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
}