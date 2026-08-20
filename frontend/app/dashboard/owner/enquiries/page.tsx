"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Trash2,
  User,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  deleteEnquiry,
  getOwnerEnquiries,
  updateEnquiryStatus,
  type Enquiry,
} from "@/lib/enquiryStore";

export default function OwnerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(
    []
  );

  const [loading, setLoading] = useState(true);

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

      if (!user.id) {
        setEnquiries([]);
        setLoading(false);
        return;
      }

      const ownerEnquiries =
        getOwnerEnquiries(user.id);

      const sortedEnquiries = [
        ...ownerEnquiries,
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setEnquiries(sortedEnquiries);
    } catch (error) {
      console.error(
        "Failed to load enquiries:",
        error
      );

      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();

    window.addEventListener(
      "estateflow-enquiries-updated",
      loadEnquiries
    );

    return () => {
      window.removeEventListener(
        "estateflow-enquiries-updated",
        loadEnquiries
      );
    };
  }, []);

  const handleRespond = (
    enquiryId: string
  ) => {
    updateEnquiryStatus(
      enquiryId,
      "RESPONDED"
    );

    loadEnquiries();
  };

  const handleDelete = (
    enquiryId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) {
      return;
    }

    deleteEnquiry(enquiryId);

    loadEnquiries();
  };

  return (
    <DashboardLayout role="owner">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/dashboard/owner"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Owner Workspace
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Customer Enquiries
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            View questions and enquiries sent by
            customers about your properties.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading enquiries...
            </p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MessageSquare className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No enquiries yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              When customers send enquiries about
              your properties, their questions will
              appear here.
            </p>

            <Link
              href="/dashboard/owner/properties"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              View My Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {enquiries.length}{" "}
                  {enquiries.length === 1
                    ? "Enquiry"
                    : "Enquiries"}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Latest customer enquiries are shown
                  first.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              {enquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <User className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {enquiry.customerName ||
                            "Customer"}
                        </h2>

                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="h-4 w-4" />

                          <span>
                            {enquiry.customerEmail ||
                              "Email not available"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {enquiry.status ===
                      "RESPONDED" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Responded
                        </span>
                      ) : enquiry.status ===
                        "CLOSED" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          Closed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                          <Clock className="h-4 w-4" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />

                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Property
                      </p>
                    </div>

                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {enquiry.propertyTitle ||
                        "Property"}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Customer Question
                    </p>

                    <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-5">
                      <p className="text-sm leading-7 text-slate-700">
                        {enquiry.message ||
                          "No message provided."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs text-slate-400">
                        Received
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {new Date(
                          enquiry.createdAt
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {enquiry.status ===
                        "PENDING" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRespond(
                              enquiry.id
                            )
                          }
                          className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark Responded
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            enquiry.id
                          )
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}