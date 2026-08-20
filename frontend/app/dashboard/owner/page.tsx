"use client";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  MessageSquare,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { getPropertiesByOwner } from "@/lib/propertyStore";
import { getOwnerEnquiries } from "@/lib/enquiryStore";
import { Property } from "@/types/property";

export default function OwnerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiryCount, setEnquiryCount] = useState(0);

  const loadDashboardData = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setProperties([]);
      setEnquiryCount(0);
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      const ownerId = String(user.id);

      
      const ownerProperties = await getPropertiesByOwner(ownerId);

      
      const ownerEnquiries = getOwnerEnquiries(ownerId);

      
      const safeProperties = Array.isArray(ownerProperties)
        ? ownerProperties
        : [];

      const safeEnquiries = Array.isArray(ownerEnquiries)
        ? ownerEnquiries
        : [];

      setProperties(safeProperties);
      setEnquiryCount(safeEnquiries.length);
    } catch (error) {
      console.error(
        "Failed to load owner dashboard data:",
        error
      );

      setProperties([]);
      setEnquiryCount(0);
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
      "storage",
      loadDashboardData
    );

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
        "storage",
        loadDashboardData
      );
    };
  }, []);

  const totalProperties = properties.length;

  const activeListings = properties.filter(
    (property) =>
      String(property.status ?? "").toUpperCase() === "ACTIVE"
  ).length;

  return (
    <DashboardLayout role="owner">
      <div className="mx-auto max-w-7xl space-y-8">

        
        <section className="flex flex-col justify-between gap-6 rounded-[28px] bg-[#061A3A] p-7 text-white shadow-xl shadow-[#061A3A]/10 sm:p-10 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4DA3FF]">
              Owner Workspace
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Manage your properties with confidence.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
              Add properties, manage enquiries, track site visits,
              and monitor your real estate activity from one place.
            </p>
          </div>

          <Link
            href="/dashboard/owner/properties/add"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </section>

        
            
        
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <Metric
            icon={Building2}
            title="My Properties"
            value={totalProperties}
            description={
              totalProperties === 1
                ? "Property in your portfolio"
                : "Properties in your portfolio"
            }
          />

          <Metric
            icon={MessageSquare}
            title="New Enquiries"
            value={enquiryCount}
            description={
              enquiryCount === 1
                ? "Customer enquiry"
                : "Customer enquiries"
            }
          />

          <Metric
            icon={CalendarDays}
            title="Site Visits"
          />

          <Metric
            icon={Building2}
            title="Active Listings"
            value={activeListings}
            description={
              activeListings === 1
                ? "Active property listing"
                : "Active property listings"
            }
          />

        </section>

        
            
        
        <section className="grid gap-6 lg:grid-cols-2">

          <DashboardPanel
            icon={Building2}
            title="Property Portfolio"
            description={
              totalProperties > 0
                ? `You currently have ${totalProperties} ${
                    totalProperties === 1
                      ? "property"
                      : "properties"
                  } in your portfolio.`
                : "Your properties will appear here after you add them."
            }
            action="/dashboard/owner/properties"
            actionText="Manage Properties"
          />

          <DashboardPanel
            icon={MessageSquare}
            title="Recent Enquiries"
            description={
              enquiryCount > 0
                ? `You have ${enquiryCount} ${
                    enquiryCount === 1
                      ? "customer enquiry"
                      : "customer enquiries"
                  } from your properties.`
                : "Customer enquiries related to your properties will appear here."
            }
            action="/dashboard/owner/enquiries"
            actionText="View Enquiries"
          />

        </section>

        
        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Upcoming Site Visits
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Keep track of your scheduled property visits.
              </p>
            </div>

            <Link
              href="/dashboard/owner/visits"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          <Empty />

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
  icon: typeof Building2;
  title: string;
  value?: number;
  description?: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value !== undefined ? value : "—"}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description || "Waiting for live data"}
      </p>

    </div>
  );
}



function DashboardPanel({
  icon: Icon,
  title,
  description,
  action,
  actionText,
}: {
  icon: typeof Building2;
  title: string;
  description: string;
  action: string;
  actionText: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">

      <Icon className="h-6 w-6 text-blue-600" />

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <Link
        href={action}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
      >
        {actionText}

        <ArrowRight className="h-4 w-4" />
      </Link>

    </div>
  );
}



function Empty() {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">

      <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />

      <p className="mt-4 text-sm font-semibold text-slate-600">
        No scheduled visits
      </p>

      <p className="mt-1 text-sm text-slate-400">
        Visit information will appear here once available.
      </p>

    </div>
  );
}