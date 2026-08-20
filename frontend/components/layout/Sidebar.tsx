"use client";

import {
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
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

export default function Sidebar({
  collapsed,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen border-r border-white/[0.08] bg-[#04152F]/95 backdrop-blur-xl transition-all duration-300 lg:block ${
        collapsed ? "w-[84px]" : "w-[260px]"
      }`}
    >
      <div className="flex h-full flex-col">
        <div
          className={`flex h-[72px] items-center border-b border-white/[0.08] ${
            collapsed ? "justify-center px-3" : "justify-between px-5"
          }`}
        >
          <Link
            href="/dashboard/customer"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#2F8CFF]/50 bg-[#0B2148]">
              <div className="h-4 w-4 rotate-45 border border-[#4DA3FF]" />
            </div>

            {!collapsed && (
              <span className="text-lg font-bold tracking-tight">
                Estate<span className="text-[#4DA3FF]">Flow</span>
              </span>
            )}
          </Link>

          {!collapsed && (
            <button
              type="button"
              onClick={onToggle}
              className="rounded-lg p-2 text-white/45 transition hover:bg-white/[0.06] hover:text-white"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {collapsed && (
            <button
              type="button"
              onClick={onToggle}
              className="absolute -right-3 top-[27px] flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#0B2148] text-white/60 shadow-lg transition hover:text-white"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6">
          {!collapsed && (
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Workspace
            </p>
          )}

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
                  title={collapsed ? item.label : undefined}
                  className={`group flex items-center rounded-xl transition-all duration-200 ${
                    collapsed
                      ? "justify-center px-3 py-3"
                      : "gap-3 px-3 py-3"
                  } ${
                    active
                      ? "bg-[#0B63F6]/15 text-white shadow-[inset_0_0_0_1px_rgba(47,140,255,0.18)]"
                      : "text-white/50 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-[19px] w-[19px] shrink-0 ${
                      active
                        ? "text-[#4DA3FF]"
                        : "text-white/40 group-hover:text-white/80"
                    }`}
                  />

                  {!collapsed && (
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {!collapsed && (
            <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Account
            </p>
          )}

          <nav className="space-y-1.5">
            <Link
              href="/dashboard/customer/profile"
              title={collapsed ? "Profile" : undefined}
              className={`flex items-center rounded-xl text-white/50 transition hover:bg-white/[0.05] hover:text-white ${
                collapsed
                  ? "justify-center px-3 py-3"
                  : "gap-3 px-3 py-3"
              }`}
            >
              <User className="h-[19px] w-[19px] shrink-0" />

              {!collapsed && (
                <span className="text-sm font-medium">
                  Profile
                </span>
              )}
            </Link>

            <button
              type="button"
              title={collapsed ? "Settings" : undefined}
              className={`flex w-full items-center rounded-xl text-white/50 transition hover:bg-white/[0.05] hover:text-white ${
                collapsed
                  ? "justify-center px-3 py-3"
                  : "gap-3 px-3 py-3"
              }`}
            >
              <Settings className="h-[19px] w-[19px] shrink-0" />

              {!collapsed && (
                <span className="text-sm font-medium">
                  Settings
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="border-t border-white/[0.08] p-3">
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center rounded-xl text-white/45 transition hover:bg-red-500/[0.08] hover:text-red-300 ${
              collapsed
                ? "justify-center px-3 py-3"
                : "gap-3 px-3 py-3"
            }`}
          >
            <LogOut className="h-[19px] w-[19px] shrink-0" />

            {!collapsed && (
              <span className="text-sm font-medium">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}