"use client";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Enquiry = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function CustomerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnquiries();

    const handleUpdate = () => {
      loadEnquiries();
    };

    window.addEventListener(
      "estateflow-enquiries-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "estateflow-enquiries-updated",
        handleUpdate
      );
    };
  }, []);

  const loadEnquiries = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setEnquiries([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      const storedEnquiries =
        localStorage.getItem(
          "estateflow_enquiries"
        );

      if (!storedEnquiries) {
        setEnquiries([]);
        setLoading(false);
        return;
      }

      const allEnquiries =
        JSON.parse(storedEnquiries);

      if (!Array.isArray(allEnquiries)) {
        setEnquiries([]);
        setLoading(false);
        return;
      }

      const customerEnquiries =
        allEnquiries.filter(
          (enquiry: Enquiry) =>
            enquiry.customerId === user.id
        );

      setEnquiries(customerEnquiries);
    } catch {
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F8FC]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard/customer"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Customer Workspace
          </p>

          <div className="mt-2 flex items-center gap-3">
            <MessageSquare className="h-7 w-7 text-blue-600" />

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              My Enquiries
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            View the enquiries you have sent for properties.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Loading enquiries...
            </p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MessageSquare className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No enquiries yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              When you send an enquiry about a property,
              it will appear here.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Building2 className="h-4 w-4" />
              Explore Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {enquiries.map((enquiry) => (
              <EnquiryCard
                key={enquiry.id}
                enquiry={enquiry}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function EnquiryCard({
  enquiry,
}: {
  enquiry: Enquiry;
}) {
  const formattedDate = new Date(
    enquiry.createdAt
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const status =
    enquiry.status?.toUpperCase() || "PENDING";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {enquiry.propertyTitle}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Enquiry ID: {enquiry.id}
              </p>
            </div>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Your Message
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {enquiry.message}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {formattedDate}
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {status === "PENDING"
            ? "Waiting for response"
            : "Enquiry updated"}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "RESPONDED" || status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        {status}
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
      <Clock3 className="h-4 w-4" />
      {status}
    </span>
  );
}