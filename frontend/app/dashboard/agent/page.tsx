"use client";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  MessageSquare,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AgentDashboard() {
  return (
    <DashboardLayout role="agent">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[28px] bg-[#061A3A] p-7 text-white shadow-xl shadow-[#061A3A]/10 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4DA3FF]">
            Agent Workspace
          </p>

          <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Turn property enquiries into successful connections.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
                Manage property listings, customer enquiries, site visits, and
                your real estate pipeline from one workspace.
              </p>
            </div>

            <Link
              href="/dashboard/agent/properties/add"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </Link>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={Building2} title="Managed Properties" />
          <Metric icon={Users} title="Customers" />
          <Metric icon={MessageSquare} title="Enquiries" />
          <Metric icon={CalendarDays} title="Site Visits" />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Pipeline
            icon={MessageSquare}
            title="Enquiry Pipeline"
            description="Customer enquiries and their progress will appear here."
            href="/dashboard/agent/enquiries"
          />

          <Pipeline
            icon={CalendarDays}
            title="Scheduled Visits"
            description="Your upcoming property visits will appear here."
            href="/dashboard/agent/visits"
          />

          <Pipeline
            icon={TrendingUp}
            title="Performance"
            description="Sales and engagement analytics will appear here."
            href="/dashboard/agent"
          />
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h3>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-4 text-sm font-semibold text-slate-600">
              No activity available yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Real activity will appear here after the property and enquiry
              modules are connected.
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
}: {
  icon: typeof Building2;
  title: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">—</p>
      <p className="mt-1 text-xs text-slate-400">Waiting for live data</p>
    </div>
  );
}

function Pipeline({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: typeof MessageSquare;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <Icon className="h-6 w-6 text-blue-600" />

      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>

      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
      >
        Open section
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}