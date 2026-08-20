"use client";

import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type Role = "admin" | "owner" | "agent" | "customer";

const roleConfig: Record<
  Role,
  {
    label: string;
    description: string;
    icon: typeof ShieldCheck;
    color: string;
  }
> = {
  admin: {
    label: "Administrator",
    description: "Platform Management",
    icon: ShieldCheck,
    color: "text-blue-400",
  },
  owner: {
    label: "Property Owner",
    description: "Property Management",
    icon: Building2,
    color: "text-blue-400",
  },
  agent: {
    label: "Real Estate Agent",
    description: "Sales & Enquiries",
    icon: Users,
    color: "text-blue-400",
  },
  customer: {
    label: "Customer",
    description: "Property Discovery",
    icon: Search,
    color: "text-blue-400",
  },
};

const navigation: Record<
  Role,
  {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
  }[]
> = {
  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "Properties",
      href: "/dashboard/admin/properties",
      icon: Building2,
    },
    {
      label: "Enquiries",
      href: "/dashboard/admin/enquiries",
      icon: MessageSquare,
    },
    {
      label: "Site Visits",
      href: "/dashboard/admin/visits",
      icon: CalendarDays,
    },
  ],

  owner: [
    {
      label: "Overview",
      href: "/dashboard/owner",
      icon: LayoutDashboard,
    },
    {
      label: "My Properties",
      href: "/dashboard/owner/properties",
      icon: Building2,
    },
    {
      label: "Enquiries",
      href: "/dashboard/owner/enquiries",
      icon: MessageSquare,
    },
    {
      label: "Site Visits",
      href: "/dashboard/owner/visits",
      icon: CalendarDays,
    },
  ],

  agent: [
    {
      label: "Overview",
      href: "/dashboard/agent",
      icon: LayoutDashboard,
    },
    {
      label: "Properties",
      href: "/dashboard/agent/properties",
      icon: Building2,
    },
    {
      label: "Enquiries",
      href: "/dashboard/agent/enquiries",
      icon: MessageSquare,
    },
    {
      label: "Site Visits",
      href: "/dashboard/agent/visits",
      icon: CalendarDays,
    },
  ],

  customer: [
    {
      label: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      label: "Explore Properties",
      href: "/properties",
      icon: Search,
    },
    {
      label: "Favorites",
      href: "/dashboard/customer/favorites",
      icon: Heart,
    },
    {
      label: "My Enquiries",
      href: "/dashboard/customer/enquiries",
      icon: MessageSquare,
    },
    {
      label: "My Visits",
      href: "/dashboard/customer/visits",
      icon: CalendarDays,
    },
  ],
};

export default function DashboardLayout({
  children,
  role: initialRole,
}: {
  children: ReactNode;
  role?: Role;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<Role | null>(initialRole ?? null);
  const [userName, setUserName] = useState("Your Account");
  const [userInitials, setUserInitials] = useState("EF");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      const normalizedRole = String(user?.role || "")
        .toLowerCase()
        .trim();

      const validRoles: Role[] = [
        "admin",
        "owner",
        "agent",
        "customer",
      ];

      if (!validRoles.includes(normalizedRole as Role)) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      const userRole = normalizedRole as Role;

      setRole(userRole);

      if (user?.name) {
        setUserName(user.name);

        const nameParts = user.name
          .trim()
          .split(/\s+/)
          .filter(Boolean);

        if (nameParts.length === 1) {
          setUserInitials(
            nameParts[0].substring(0, 2).toUpperCase()
          );
        } else {
          setUserInitials(
            `${nameParts[0][0]}${
              nameParts[nameParts.length - 1][0]
            }`.toUpperCase()
          );
        }
      }

      const dashboardPaths: Record<Role, string> = {
        admin: "/dashboard/admin",
        owner: "/dashboard/owner",
        agent: "/dashboard/agent",
        customer: "/dashboard/customer",
      };

      const dashboardRoleMatch = pathname.match(
        /^\/dashboard\/(admin|owner|agent|customer)/
      );

      if (dashboardRoleMatch) {
        const currentRole = dashboardRoleMatch[1] as Role;

        if (currentRole !== userRole) {
          router.replace(dashboardPaths[userRole]);
          return;
        }
      }

      setCheckingAuth(false);
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [pathname, router]);

  const logout = () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    setMobileOpen(false);

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    router.replace("/login");
  };

  if (checkingAuth || !role || loggingOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#061A3A] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2F8CFF]/40 bg-[#0B2148]">
            <div className="h-5 w-5 rotate-45 border border-[#4DA3FF]" />
          </div>

          <p className="text-sm text-white/50">
            {loggingOut ? "Signing out..." : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  const config = roleConfig[role];
  const RoleIcon = config.icon;

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#0F172A]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#061A3A] text-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2F8CFF]/80 bg-[#0B2148] transition group-hover:border-[#4DA3FF]">
                <div className="h-4 w-4 rotate-45 border border-[#4DA3FF]" />
              </div>

              <span className="text-xl font-semibold tracking-tight">
                Estate
                <span className="text-[#4DA3FF]">
                  Flow
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
          </div>

          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.05] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0B63F6] to-[#4DA3FF]">
                <RoleIcon className="h-5 w-5 text-white" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {config.label}
                </p>

                <p className="mt-0.5 text-xs text-white/40">
                  {config.description}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Workspace
            </p>

            {navigation[role].map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== `/dashboard/${role}` &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#0B63F6] text-white shadow-lg shadow-[#0B63F6]/20"
                      : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              );
            })}

            <div className="my-6 h-px bg-white/10" />

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Building2 className="h-[18px] w-[18px]" />
              Back to EstateFlow
            </Link>
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/55 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="h-[18px] w-[18px]" />

              {loggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-slate-200 p-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#2563EB]">
                EstateFlow
              </p>

              <h1 className="text-lg font-semibold text-slate-900">
                {config.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
                  {userName}
                </p>

                <p className="text-xs text-slate-400">
                  {config.label}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0B63F6] to-[#4DA3FF] text-sm font-bold text-white">
                {userInitials}
              </div>

              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-80px)] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}