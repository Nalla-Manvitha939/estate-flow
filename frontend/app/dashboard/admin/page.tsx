"use client";

import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Home,
  MessageSquare,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getEnquiries } from "@/lib/enquiryStore";

type Property = {
  id: string;
  status?: string;
  availability?: string;
};

type StoredUser = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function AdminDashboard() {
  const [totalProperties, setTotalProperties] = useState(0);
  const [activeProperties, setActiveProperties] = useState(0);
  const [soldProperties, setSoldProperties] = useState(0);
  const [rentedProperties, setRentedProperties] = useState(0);
  const [totalOwners, setTotalOwners] = useState(0);
  const [totalAgents, setTotalAgents] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalEnquiries, setTotalEnquiries] = useState(0);

  const loadDashboardData = async () => {
    try {
      const [
        propertiesResponse,
        ownersResponse,
        agentsResponse,
        customersResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/properties?skip=0&limit=100`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }),
        fetch(`${API_BASE_URL}/users?role=owner&skip=0&limit=100`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }),
        fetch(`${API_BASE_URL}/users?role=agent&skip=0&limit=100`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }),
        fetch(`${API_BASE_URL}/users?role=customer&skip=0&limit=100`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }),
      ]);

      if (propertiesResponse.ok) {
        const properties: Property[] = await propertiesResponse.json();

        setTotalProperties(properties.length);

        setActiveProperties(
          properties.filter((property) => {
            const status = String(property.status || "").toUpperCase();
            const availability = String(
              property.availability || ""
            ).toUpperCase();

            return (
              status === "ACTIVE" ||
              status === "AVAILABLE" ||
              availability === "AVAILABLE"
            );
          }).length
        );

        setSoldProperties(
          properties.filter(
            (property) =>
              String(property.status || "").toUpperCase() === "SOLD"
          ).length
        );

        setRentedProperties(
          properties.filter(
            (property) =>
              String(property.status || "").toUpperCase() === "RENTED"
          ).length
        );
      } else {
        setTotalProperties(0);
        setActiveProperties(0);
        setSoldProperties(0);
        setRentedProperties(0);
      }

      if (ownersResponse.ok) {
        const owners: StoredUser[] = await ownersResponse.json();
        setTotalOwners(owners.length);
      } else {
        setTotalOwners(0);
      }

      if (agentsResponse.ok) {
        const agents: StoredUser[] = await agentsResponse.json();
        setTotalAgents(agents.length);
      } else {
        setTotalAgents(0);
      }

      if (customersResponse.ok) {
        const customers: StoredUser[] = await customersResponse.json();
        setTotalCustomers(customers.length);
      } else {
        setTotalCustomers(0);
      }

      const enquiries = getEnquiries();
      setTotalEnquiries(enquiries.length);
    } catch {
      setTotalProperties(0);
      setActiveProperties(0);
      setSoldProperties(0);
      setRentedProperties(0);
      setTotalOwners(0);
      setTotalAgents(0);
      setTotalCustomers(0);

      const enquiries = getEnquiries();
      setTotalEnquiries(enquiries.length);
    }
  };

  useEffect(() => {
    loadDashboardData();

    window.addEventListener(
      "estateflow-properties-updated",
      loadDashboardData
    );

    window.addEventListener(
      "estateflow-enquiries-updated",
      loadDashboardData
    );

    window.addEventListener(
      "estateflow-users-updated",
      loadDashboardData
    );

    window.addEventListener("storage", loadDashboardData);

    return () => {
      window.removeEventListener(
        "estateflow-properties-updated",
        loadDashboardData
      );

      window.removeEventListener(
        "estateflow-enquiries-updated",
        loadDashboardData
      );

      window.removeEventListener(
        "estateflow-users-updated",
        loadDashboardData
      );

      window.removeEventListener("storage", loadDashboardData);
    };
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[28px] bg-[#061A3A] p-7 text-white shadow-xl shadow-[#061A3A]/10 sm:p-10">
          <div className="relative">
            <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#0B63F6]/20 blur-3xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2F8CFF]/30 bg-[#0B2148]">
                <ShieldCheck className="h-6 w-6 text-[#4DA3FF]" />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#4DA3FF]">
                Administration
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Manage the EstateFlow platform.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
                Monitor users, properties, enquiries, site visits, and platform
                activity from one centralized workspace.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={Building2}
            title="Total Properties"
            value={totalProperties}
            description="All properties on the platform"
          />

          <Metric
            icon={CheckCircle2}
            title="Active Properties"
            value={activeProperties}
            description="Currently active properties"
          />

          <Metric
            icon={Home}
            title="Sold Properties"
            value={soldProperties}
            description="Properties marked as sold"
          />

          <Metric
            icon={Building2}
            title="Rented Properties"
            value={rentedProperties}
            description="Properties marked as rented"
          />

          <Metric
            icon={Users}
            title="Total Owners"
            value={totalOwners}
            description="Registered property owners"
          />

          <Metric
            icon={UserRound}
            title="Total Agents"
            value={totalAgents}
            description="Registered real estate agents"
          />

          <Metric
            icon={Users}
            title="Total Customers"
            value={totalCustomers}
            description="Registered customers"
          />

          <Metric
            icon={MessageSquare}
            title="Total Enquiries"
            value={totalEnquiries}
            description="Customer enquiries"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <AdminPanel
            icon={Users}
            title="User Management"
            description="Manage platform users and their assigned roles."
            href="/dashboard/admin/users"
            action="Manage Users"
          />

          <AdminPanel
            icon={Building2}
            title="Property Management"
            description="Review and manage properties registered on EstateFlow."
            href="/dashboard/admin/properties"
            action="Manage Properties"
          />

          <AdminPanel
            icon={MessageSquare}
            title="Enquiries"
            description="Monitor customer enquiries across the platform."
            href="/dashboard/admin/enquiries"
            action="View Enquiries"
          />

          <AdminPanel
            icon={CalendarDays}
            title="Site Visits"
            description="Monitor property visit activity and schedules."
            href="/dashboard/admin/visits"
            action="View Visits"
          />
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600" />

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Platform Analytics
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Analytics will populate automatically once the platform modules
                start receiving real data.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <BarChart3 className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-4 text-sm font-semibold text-slate-600">
              Analytics data is not available yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Connect the dashboard API to display live platform statistics.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function Metric({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: typeof Users;
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function AdminPanel({
  icon: Icon,
  title,
  description,
  href,
  action,
}: {
  icon: typeof Users;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Icon className="h-6 w-6 text-blue-600" />

      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>

      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
      >
        {action}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}