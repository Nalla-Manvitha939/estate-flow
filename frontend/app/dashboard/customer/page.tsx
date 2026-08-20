"use client";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  Heart,
  MessageSquare,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getProperties } from "@/lib/propertyStore";
import {
  isFavorite,
} from "@/lib/favoriteStore";

export default function CustomerDashboard() {
  const [availableProperties, setAvailableProperties] =
    useState("—");

  const [favorites, setFavorites] =
    useState("0");

  const [enquiries, setEnquiries] =
    useState("—");

  const [siteVisits, setSiteVisits] =
    useState("—");

  useEffect(() => {
    const loadDashboardData = async () => {
      
       

      try {
        
        const properties = await getProperties();

        const activeProperties = properties.filter(
          (property) => {
            const status = String(
              property.status ?? ""
            ).toUpperCase();

            const availability = String(
              property.availability ?? ""
            ).toUpperCase();

            return (
              status === "ACTIVE" ||
              status === "AVAILABLE" ||
              availability === "AVAILABLE"
            );
          }
        );

        setAvailableProperties(
          String(activeProperties.length)
        );

        

        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {
          setFavorites("0");
          setEnquiries("0");
          setSiteVisits("0");
          return;
        }

        try {
          const user = JSON.parse(storedUser);

          const customerId = String(
            user.id ?? user.user_id ?? ""
          );

          

          const favoriteProperties =
            properties.filter((property) =>
              isFavorite(
                String(property.id),
                customerId
              )
            );

          setFavorites(
            String(favoriteProperties.length)
          );

          

          const storedEnquiries =
            localStorage.getItem(
              "estateflow_enquiries"
            );

          if (storedEnquiries) {
            const enquiryData =
              JSON.parse(storedEnquiries);

            if (Array.isArray(enquiryData)) {
              const customerEnquiries =
                enquiryData.filter(
                  (enquiry) =>
                    String(enquiry.customerId) ===
                    customerId
                );

              setEnquiries(
                String(customerEnquiries.length)
              );
            } else {
              setEnquiries("0");
            }
          } else {
            setEnquiries("0");
          }

          

          const storedVisits =
            localStorage.getItem(
              "estateflow_site_visits"
            );

          if (storedVisits) {
            const visitData =
              JSON.parse(storedVisits);

            if (Array.isArray(visitData)) {
              const customerVisits =
                visitData.filter(
                  (visit) =>
                    String(visit.customerId) ===
                      customerId &&
                    visit.status !== "CANCELLED"
                );

              setSiteVisits(
                String(customerVisits.length)
              );
            } else {
              setSiteVisits("0");
            }
          } else {
            setSiteVisits("0");
          }
        } catch (error) {
          console.error(
            "Failed to load customer data:",
            error
          );

          setFavorites("0");
          setEnquiries("0");
          setSiteVisits("0");
        }
      } catch (error) {
        console.error(
          "Failed to load properties:",
          error
        );

        setAvailableProperties("0");
        setFavorites("0");
      }
    };

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
      "estateflow-visits-updated",
      loadDashboardData
    );

    
    window.addEventListener(
      "estateflow-favorites-updated",
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
        "estateflow-visits-updated",
        loadDashboardData
      );

      window.removeEventListener(
        "estateflow-favorites-updated",
        loadDashboardData
      );
    };
  }, []);

  return (
    <DashboardLayout role="customer">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HERO */}
        <section className="overflow-hidden rounded-[28px] bg-[#061A3A] p-7 text-white shadow-xl shadow-[#061A3A]/10 sm:p-10">
          <div className="relative">
            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-[#2F8CFF]/20 blur-3xl" />

            <div className="relative max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#4DA3FF]">
                Customer Workspace
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Find a property that feels like home.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
                Explore available properties, save
                your favorites, send enquiries, and
                manage your upcoming site visits.
              </p>

              <Link
                href="/properties"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
              >
                Explore Properties
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* DASHBOARD CARDS */}
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <DashboardCard
            icon={Building2}
            title="Available Properties"
            value={availableProperties}
            description="Live property listings"
          />

          <DashboardCard
            icon={Heart}
            title="Favorites"
            value={favorites}
            description="Your saved properties"
          />

          <DashboardCard
            icon={MessageSquare}
            title="Enquiries"
            value={enquiries}
            description="Your property enquiries"
          />

          <DashboardCard
            icon={CalendarDays}
            title="Site Visits"
            value={siteVisits}
            description="Upcoming property visits"
          />

        </section>

        {/* EXPLORE + QUICK ACTIONS */}
        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Explore Properties
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Find properties that match your
                  requirements.
                </p>
              </div>

              <Search className="h-5 w-5 text-blue-500" />

            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">

              <Building2 className="mx-auto h-8 w-8 text-slate-300" />

              {Number(availableProperties) > 0 ? (
                <>
                  <h4 className="mt-4 text-sm font-semibold text-slate-700">
                    {availableProperties} properties available
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Explore available properties and
                    find one that matches your
                    requirements.
                  </p>

                  <Link
                    href="/properties"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Explore Properties
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <h4 className="mt-4 text-sm font-semibold text-slate-700">
                    No properties available yet
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Properties added by owners and
                    agents will appear here once the
                    property module is connected.
                  </p>
                </>
              )}

            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="text-lg font-semibold text-slate-900">
              Quick Actions
            </h3>

            <div className="mt-5 space-y-3">

              <QuickAction
                href="/properties"
                icon={Search}
                title="Search Properties"
              />

              <QuickAction
                href="/dashboard/customer/favorites"
                icon={Heart}
                title="View Favorites"
              />

              <QuickAction
                href="/dashboard/customer/enquiries"
                icon={MessageSquare}
                title="My Enquiries"
              />

              <QuickAction
                href="/dashboard/customer/visits"
                icon={CalendarDays}
                title="My Site Visits"
              />

            </div>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}




function DashboardCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: typeof Building2;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>

      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}




function QuickAction({
  href,
  icon: Icon,
  title,
}: {
  href: string;
  icon: typeof Search;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition hover:border-blue-100 hover:bg-blue-50"
    >

      <div className="flex items-center gap-3">

        <Icon className="h-4 w-4 text-blue-600" />

        <span className="text-sm font-medium text-slate-700">
          {title}
        </span>

      </div>

      <ArrowRight className="h-4 w-4 text-slate-300" />

    </Link>
  );
}