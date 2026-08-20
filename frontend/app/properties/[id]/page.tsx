"use client";

import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  Heart,
  Home,
  MapPin,
  MessageSquare,
  Ruler,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPropertyById } from "@/lib/propertyStore";
import { addEnquiry } from "@/lib/enquiryStore";
import { addSiteVisit } from "@/lib/visitStore";
import {
  isFavorite,
  toggleFavorite,
} from "@/lib/favoriteStore";
import { Property } from "@/types/property";

function formatPrice(
  price: number,
  listingType: string
) {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  return listingType === "RENT"
    ? `${formatted}/month`
    : formatted;
}

function getCustomerId(user: any) {
  return String(
    user?.id ??
      user?.userId ??
      user?.email ??
      ""
  );
}

function getPropertyImage(property: Property): string {
  const propertyData = property as Property & {
    images?: string[] | string;
    image_url?: string;
    imageUrl?: string;
  };

  if (
    Array.isArray(propertyData.images) &&
    propertyData.images.length > 0
  ) {
    return String(propertyData.images[0] || "");
  }

  if (
    typeof propertyData.images === "string" &&
    propertyData.images.trim()
  ) {
    return propertyData.images.trim();
  }

  if (
    typeof propertyData.imageUrl === "string" &&
    propertyData.imageUrl.trim()
  ) {
    return propertyData.imageUrl.trim();
  }

  if (
    typeof propertyData.image_url === "string" &&
    propertyData.image_url.trim()
  ) {
    return propertyData.image_url.trim();
  }

  return "";
}

export default function PropertyDetailsPage() {
  const params = useParams();

  const [property, setProperty] =
    useState<Property | null>(null);

  const [favorite, setFavorite] =
    useState(false);

  const [showEnquiry, setShowEnquiry] =
    useState(false);

  const [showVisit, setShowVisit] =
    useState(false);

  const [enquiryMessage, setEnquiryMessage] =
    useState("");

  const [visitDate, setVisitDate] =
    useState("");

  const [visitTime, setVisitTime] =
    useState("");

  const [visitMessage, setVisitMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    if (!params?.id) {
      return;
    }

    let cancelled = false;

    const loadProperty = async () => {
      const propertyId = String(params.id);

      try {
        const result =
          await getPropertyById(propertyId);

        if (cancelled) {
          return;
        }

        setProperty(result);

        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);

            const customerId =
              getCustomerId(user);

            if (customerId) {
              setFavorite(
                isFavorite(
                  propertyId,
                  customerId
                )
              );
            }
          } catch {
            setFavorite(false);
          }
        }
      } catch {
        if (!cancelled) {
          setProperty(null);
        }
      }
    };

    loadProperty();

    return () => {
      cancelled = true;
    };
  }, [params]);

  if (!property) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-6">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-slate-300" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Property not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This property may have been removed or is no longer available.
          </p>

          <Link
            href="/properties"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
      </main>
    );
  }

  const propertyImage =
    getPropertyImage(property);

  const handleFavorite = () => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      const customerId =
        getCustomerId(user);

      if (!customerId) {
        setSuccessMessage(
          "Unable to identify your account. Please login again."
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

        return;
      }

      const result = toggleFavorite(
        property.id,
        customerId
      );

      setFavorite(result);

      setSuccessMessage(
        result
          ? "Property added to favorites."
          : "Property removed from favorites."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch {
      setSuccessMessage(
        "Unable to update favorites. Please try again."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  const handleSendEnquiry = () => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      const customerId =
        getCustomerId(user);

      if (!customerId) {
        setSuccessMessage(
          "Unable to identify your account. Please login again."
        );
        return;
      }

      addEnquiry({
        id: crypto.randomUUID(),
        propertyId: property.id,
        propertyTitle: property.title,
        ownerId: property.ownerId,
        ownerName: property.ownerName,
        customerId,
        customerName: user.name ?? "Customer",
        customerEmail: user.email ?? "",
        message:
          enquiryMessage.trim() ||
          "I am interested in this property.",
        status: "PENDING",
        createdAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString(),
      });

      setShowEnquiry(false);
      setEnquiryMessage("");

      setSuccessMessage(
        "Your enquiry has been sent successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch {
      setSuccessMessage(
        "Unable to send enquiry. Please try again."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  const handleScheduleVisit = () => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    if (!visitDate || !visitTime) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      const customerId =
        getCustomerId(user);

      if (!customerId) {
        setSuccessMessage(
          "Unable to identify your account. Please login again."
        );
        return;
      }

      addSiteVisit({
        id: crypto.randomUUID(),
        propertyId: property.id,
        propertyTitle: property.title,
        ownerId: property.ownerId,
        ownerName: property.ownerName,
        customerId,
        customerName: user.name ?? "Customer",
        customerEmail: user.email ?? "",
        visitDate,
        visitTime,
        message:
          visitMessage.trim() ||
          "I would like to visit this property.",
        status: "PENDING",
        createdAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString(),
      });

      setShowVisit(false);
      setVisitDate("");
      setVisitTime("");
      setVisitMessage("");

      setSuccessMessage(
        "Site visit scheduled successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch {
      setSuccessMessage(
        "Unable to schedule visit. Please try again."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Link>

        {successMessage && (
          <div className="fixed right-5 top-5 z-[70] flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 text-sm font-semibold text-emerald-700 shadow-xl">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            {successMessage}
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="min-h-[360px] bg-slate-100 lg:min-h-[520px]">
              {propertyImage ? (
                <img
                  src={propertyImage}
                  alt={property.title}
                  className="h-full min-h-[360px] w-full object-cover lg:min-h-[520px]"
                />
              ) : (
                <div className="flex h-full min-h-[360px] items-center justify-center text-slate-300 lg:min-h-[520px]">
                  <Building2 className="h-24 w-24" />
                </div>
              )}
            </div>

            <div className="p-7 sm:p-10">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                    {property.listingType === "SALE"
                      ? "For Sale"
                      : "For Rent"}
                  </span>

                  <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                    {property.title}
                  </h1>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    {property.address},{" "}
                    {property.city},{" "}
                    {property.state}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFavorite}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                    favorite
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  }`}
                  aria-label={
                    favorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <Heart
                    className={`h-5 w-5 transition ${
                      favorite
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </button>
              </div>

              <p className="mt-7 text-3xl font-bold text-blue-600">
                {formatPrice(
                  property.price,
                  property.listingType
                )}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <BedDouble className="h-5 w-5 text-blue-600" />

                  <p className="mt-3 text-lg font-bold text-slate-900">
                    {property.bedrooms}
                  </p>

                  <p className="text-xs text-slate-400">
                    Bedrooms
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <Bath className="h-5 w-5 text-blue-600" />

                  <p className="mt-3 text-lg font-bold text-slate-900">
                    {property.bathrooms}
                  </p>

                  <p className="text-xs text-slate-400">
                    Bathrooms
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <Ruler className="h-5 w-5 text-blue-600" />

                  <p className="mt-3 text-lg font-bold text-slate-900">
                    {property.area}
                  </p>

                  <p className="text-xs text-slate-400">
                    Sq.Ft
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <Home className="h-5 w-5 text-blue-600" />

                  <p className="mt-3 text-sm font-bold text-slate-900">
                    {property.propertyType}
                  </p>

                  <p className="text-xs text-slate-400">
                    Type
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-7">
                <h2 className="text-lg font-bold text-slate-900">
                  About this property
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {property.description}
                </p>
              </div>

              {property.amenities.length > 0 && (
                <div className="mt-7">
                  <h2 className="text-lg font-bold text-slate-900">
                    Amenities
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.amenities.map(
                      (amenity) => (
                        <span
                          key={amenity}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                        >
                          {amenity}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowEnquiry(true)
                  }
                  className="h-12 rounded-xl bg-[#061A3A] text-sm font-bold text-white transition hover:bg-blue-600"
                >
                  Send Enquiry
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowVisit(true)
                  }
                  className="h-12 rounded-xl border border-blue-200 bg-blue-50 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                >
                  Schedule Visit
                </button>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Listed by
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {property.ownerName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEnquiry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Send Enquiry
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Send an enquiry about{" "}
                  <span className="font-semibold text-slate-700">
                    {property.title}
                  </span>{" "}
                  to the property owner.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowEnquiry(false)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close enquiry"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Your Message
              </label>

              <textarea
                value={enquiryMessage}
                onChange={(event) =>
                  setEnquiryMessage(
                    event.target.value
                  )
                }
                placeholder="I am interested in this property. Please contact me with more details."
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowEnquiry(false);
                  setEnquiryMessage("");
                }}
                className="h-12 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendEnquiry}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <MessageSquare className="h-4 w-4" />
                Send Enquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {showVisit && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Schedule Site Visit
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Select a convenient date and time to visit this property.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowVisit(false)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close visit"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Visit Date
                </label>

                <input
                  type="date"
                  value={visitDate}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(event) =>
                    setVisitDate(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Visit Time
                </label>

                <input
                  type="time"
                  value={visitTime}
                  onChange={(event) =>
                    setVisitTime(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message
                </label>

                <textarea
                  value={visitMessage}
                  onChange={(event) =>
                    setVisitMessage(
                      event.target.value
                    )
                  }
                  placeholder="Any additional information for the owner..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowVisit(false);
                  setVisitDate("");
                  setVisitTime("");
                  setVisitMessage("");
                }}
                className="h-12 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  !visitDate || !visitTime
                }
                onClick={handleScheduleVisit}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CalendarDays className="h-4 w-4" />
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}