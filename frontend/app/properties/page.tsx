"use client";

import {
  Building2,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getActiveProperties,
} from "@/lib/propertyStore";
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

function getPropertyImage(
  property: Property
): string {
  if (
    property.imageUrl &&
    String(property.imageUrl).trim()
  ) {
    return String(property.imageUrl);
  }

  if (
    Array.isArray(property.images) &&
    property.images.length > 0 &&
    property.images[0]
  ) {
    return String(property.images[0]);
  }

  return "";
}

export default function PropertiesPage() {
  const [properties, setProperties] =
    useState<Property[]>([]);

  const [search, setSearch] = useState("");

  const [propertyType, setPropertyType] =
    useState("ALL");

  const loadProperties = async () => {
    try {
      const data = await getActiveProperties();

      setProperties(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load properties:",
        error
      );

      setProperties([]);
    }
  };

  useEffect(() => {
    loadProperties();

    const handlePropertyUpdate = () => {
      loadProperties();
    };

    window.addEventListener(
      "estateflow-properties-updated",
      handlePropertyUpdate
    );

    window.addEventListener(
      "storage",
      handlePropertyUpdate
    );

    return () => {
      window.removeEventListener(
        "estateflow-properties-updated",
        handlePropertyUpdate
      );

      window.removeEventListener(
        "storage",
        handlePropertyUpdate
      );
    };
  }, []);

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();

    return properties.filter((property) => {
      const matchesSearch =
        !query ||
        String(property.title || "")
          .toLowerCase()
          .includes(query) ||
        String(property.city || "")
          .toLowerCase()
          .includes(query) ||
        String(property.state || "")
          .toLowerCase()
          .includes(query) ||
        String(property.location || "")
          .toLowerCase()
          .includes(query);

      const matchesType =
        propertyType === "ALL" ||
        String(property.propertyType || "")
          .toUpperCase() ===
          propertyType.toUpperCase();

      return matchesSearch && matchesType;
    });
  }, [
    properties,
    search,
    propertyType,
  ]);

  return (
    <main className="min-h-screen bg-[#F4F7FB]">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            EstateFlow Properties
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Explore Properties
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Discover properties listed by EstateFlow
            owners and find a place that fits your
            requirements.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by property or location..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <select
              value={propertyType}
              onChange={(e) =>
                setPropertyType(e.target.value)
              }
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">
                All Property Types
              </option>

              <option value="APARTMENT">
                Apartment
              </option>

              <option value="VILLA">
                Villa
              </option>

              <option value="HOUSE">
                House
              </option>

              <option value="PLOT">
                Plot
              </option>

              <option value="COMMERCIAL">
                Commercial
              </option>
            </select>

            <div className="hidden items-center justify-center rounded-xl border border-slate-200 bg-white px-4 md:flex">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {properties.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Building2 className="h-7 w-7" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-900">
              No properties available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Property listings will appear here when
              owners add properties to EstateFlow.
            </p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center">
            <Search className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No matching properties
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or property type.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-900">
                  {filteredProperties.length}
                </span>{" "}
                properties available
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProperties.map(
                (property) => {
                  const imageUrl =
                    getPropertyImage(property);

                  return (
                    <article
                      key={property.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-56 bg-slate-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={property.title}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-300">
                            <Building2 className="h-16 w-16" />
                          </div>
                        )}

                        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
                          {String(
                            property.listingType || ""
                          ).toUpperCase() === "SALE"
                            ? "For Sale"
                            : "For Rent"}
                        </div>

                        <button
                          type="button"
                          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm transition hover:text-red-500"
                          aria-label="Favorite property"
                        >
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="p-5">
                        <p className="text-xl font-bold text-blue-600">
                          {formatPrice(
                            Number(property.price || 0),
                            String(
                              property.listingType || ""
                            ).toUpperCase()
                          )}
                        </p>

                        <h2 className="mt-2 line-clamp-1 text-lg font-bold text-slate-900">
                          {property.title}
                        </h2>

                        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin className="h-4 w-4 text-blue-500" />

                          {property.city ||
                            property.location ||
                            "—"}
                          {property.state
                            ? `, ${property.state}`
                            : ""}
                        </div>

                        <div className="mt-4 grid grid-cols-3 border-y border-slate-100 py-3 text-center">
                          <div>
                            <p className="font-bold text-slate-900">
                              {property.bedrooms ?? 0}
                            </p>

                            <p className="text-[11px] text-slate-400">
                              Beds
                            </p>
                          </div>

                          <div className="border-x border-slate-100">
                            <p className="font-bold text-slate-900">
                              {property.bathrooms ?? 0}
                            </p>

                            <p className="text-[11px] text-slate-400">
                              Baths
                            </p>
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              {property.area ?? 0}
                            </p>

                            <p className="text-[11px] text-slate-400">
                              Sq.Ft
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/properties/${property.id}`}
                          className="mt-4 flex h-11 items-center justify-center rounded-xl bg-[#061A3A] text-sm font-bold text-white transition hover:bg-blue-600"
                        >
                          View Property
                        </Link>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}