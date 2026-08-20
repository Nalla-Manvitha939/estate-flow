"use client";

import {
  Building2,
  Eye,
  Pencil,
  Plus,
  Trash2,
  MapPin,
  RefreshCw,
  X,
  Image as ImageIcon,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  getProperties,
  deleteProperty,
} from "@/lib/propertyStore";
import { Property } from "@/types/property";

type PropertyRow = Property & {
  location?: string;
  ownerName?: string;
  ownerId?: string;
  agentName?: string;
  agentId?: string;
  propertyType?: string;
  price?: number;
  status?: string;
  images?: string[];
  description?: string;
  city?: string;
  state?: string;
  pincode?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  documents?: string[];
  availability?: string;
  listingType?: string;
  listedDate?: string;
};

function getLocation(property: PropertyRow): string {
  if (property.location) {
    return property.location;
  }

  const parts = [
    property.city,
    property.state,
  ].filter(Boolean);

  return parts.join(", ") || "—";
}

function formatPrice(
  price: number | undefined
): string {
  if (
    price === undefined ||
    price === null ||
    Number.isNaN(Number(price))
  ) {
    return "—";
  }

  return `₹${Number(price).toLocaleString("en-IN")}`;
}

function formatValue(value: unknown): string {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "—";
  }

  return String(value);
}

function formatPropertyType(
  propertyType: string | undefined
): string {
  if (!propertyType) {
    return "—";
  }

  return propertyType
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatListingType(
  listingType: string | undefined
): string {
  if (!listingType) {
    return "—";
  }

  return listingType
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatStatus(
  status: string | undefined,
  availability?: string
): string {
  const value = status || availability;

  if (!value) {
    return "—";
  }

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function getStatusClass(
  status: string | undefined,
  availability?: string
): string {
  const normalized = String(
    status || availability || ""
  ).toUpperCase();

  if (
    normalized === "ACTIVE" ||
    normalized === "AVAILABLE"
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (normalized === "SOLD") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (normalized === "RENTED") {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }

  if (normalized === "UNAVAILABLE") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized === "INACTIVE") {
    return "bg-slate-100 text-slate-600 border-slate-300";
  }

  return "bg-slate-50 text-slate-600 border-slate-200";
}

function getImage(
  property: PropertyRow
): string | null {
  if (
    Array.isArray(property.images) &&
    property.images.length > 0
  ) {
    return property.images[0];
  }

  return null;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] =
    useState<PropertyRow[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [selectedProperty, setSelectedProperty] =
    useState<PropertyRow | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [propertyTypeFilter, setPropertyTypeFilter] =
    useState("");

  const [listingTypeFilter, setListingTypeFilter] =
    useState("");

  const [locationFilter, setLocationFilter] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [bedroomsFilter, setBedroomsFilter] =
    useState("");

  const [bathroomsFilter, setBathroomsFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  const loadProperties = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getProperties();

        setProperties(
          Array.isArray(data)
            ? (data as PropertyRow[])
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load properties:",
          error
        );

        setProperties([]);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load properties."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
  }, [loadProperties]);

  const handleDelete = async (
    property: PropertyRow
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(String(property.id));
    setError("");

    try {
      await deleteProperty(
        String(property.id)
      );

      setProperties((current) =>
        current.filter(
          (item) =>
            String(item.id) !==
            String(property.id)
        )
      );

      if (
        selectedProperty &&
        String(selectedProperty.id) ===
          String(property.id)
      ) {
        setSelectedProperty(null);
      }

      window.dispatchEvent(
        new Event(
          "estateflow-properties-updated"
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete property:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete property."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const propertyTypes = useMemo(() => {
    const types = properties
      .map((property) =>
        String(
          property.propertyType || ""
        ).toUpperCase()
      )
      .filter(Boolean);

    return Array.from(new Set(types)).sort();
  }, [properties]);

  const locations = useMemo(() => {
    const values = properties
      .map((property) =>
        getLocation(property)
      )
      .filter(
        (location) =>
          location &&
          location !== "—"
      );

    return Array.from(new Set(values)).sort();
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    const min =
      minPrice.trim() !== ""
        ? Number(minPrice)
        : null;

    const max =
      maxPrice.trim() !== ""
        ? Number(maxPrice)
        : null;

    return properties.filter((property) => {

      if (query) {
        const searchableValues = [
          property.title,
          property.id,
          getLocation(property),
          property.ownerName,
          property.agentName,
        ];

        const matchesSearch =
          searchableValues.some(
            (value) =>
              String(value || "")
                .toLowerCase()
                .includes(query)
          );

        if (!matchesSearch) {
          return false;
        }
      }

      if (propertyTypeFilter) {
        const propertyType =
          String(
            property.propertyType || ""
          ).toUpperCase();

        if (
          propertyType !==
          propertyTypeFilter.toUpperCase()
        ) {
          return false;
        }
      }

      if (listingTypeFilter) {
        const listingType =
          String(
            property.listingType || ""
          ).toUpperCase();

        if (
          listingType !==
          listingTypeFilter.toUpperCase()
        ) {
          return false;
        }
      }

      if (locationFilter) {
        const propertyLocation =
          getLocation(property)
            .toLowerCase();

        if (
          propertyLocation !==
          locationFilter.toLowerCase()
        ) {
          return false;
        }
      }

      if (
        min !== null &&
        !Number.isNaN(min)
      ) {
        const price = Number(
          property.price || 0
        );

        if (price < min) {
          return false;
        }
      }

      if (
        max !== null &&
        !Number.isNaN(max)
      ) {
        const price = Number(
          property.price || 0
        );

        if (price > max) {
          return false;
        }
      }

      if (bedroomsFilter) {
        const bedrooms = Number(
          property.bedrooms || 0
        );

        if (
          bedroomsFilter === "5+"
        ) {
          if (bedrooms < 5) {
            return false;
          }
        } else {
          if (
            bedrooms !==
            Number(bedroomsFilter)
          ) {
            return false;
          }
        }
      }

      if (bathroomsFilter) {
        const bathrooms = Number(
          property.bathrooms || 0
        );

        if (
          bathroomsFilter === "5+"
        ) {
          if (bathrooms < 5) {
            return false;
          }
        } else {
          if (
            bathrooms !==
            Number(bathroomsFilter)
          ) {
            return false;
          }
        }
      }

      if (statusFilter) {
        const propertyStatus =
          String(
            property.status || ""
          ).toUpperCase();

        const availability =
          String(
            property.availability || ""
          ).toUpperCase();

        const selectedStatus =
          statusFilter.toUpperCase();

        const statusMatches =
          propertyStatus ===
            selectedStatus ||
          availability ===
            selectedStatus;

        if (!statusMatches) {
          return false;
        }
      }

      return true;
    });
  }, [
    properties,
    searchQuery,
    propertyTypeFilter,
    listingTypeFilter,
    locationFilter,
    minPrice,
    maxPrice,
    bedroomsFilter,
    bathroomsFilter,
    statusFilter,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setPropertyTypeFilter("");
    setListingTypeFilter("");
    setLocationFilter("");
    setMinPrice("");
    setMaxPrice("");
    setBedroomsFilter("");
    setBathroomsFilter("");
    setStatusFilter("");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    propertyTypeFilter !== "" ||
    listingTypeFilter !== "" ||
    locationFilter !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    bedroomsFilter !== "" ||
    bathroomsFilter !== "" ||
    statusFilter !== "";

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    propertyTypeFilter,
    listingTypeFilter,
    locationFilter,
    minPrice,
    maxPrice,
    bedroomsFilter,
    bathroomsFilter,
    statusFilter,
  ]);

  const totalFilteredProperties = filteredProperties.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalFilteredProperties / pageSize)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex =
    totalFilteredProperties === 0
      ? 0
      : (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(
    startIndex + pageSize,
    totalFilteredProperties
  );

  const paginatedProperties = useMemo(() => {
    return filteredProperties.slice(startIndex, endIndex);
  }, [filteredProperties, startIndex, endIndex]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-7xl space-y-6">


        <section className="rounded-[28px] bg-[#061A3A] p-7 text-white shadow-xl shadow-[#061A3A]/10 sm:p-10">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4DA3FF]">
                Property Management
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Manage Properties
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                View and manage all properties
                registered on the EstateFlow
                platform.
              </p>
            </div>

            <Link
              href="/dashboard/admin/properties/add"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </Link>

          </div>
        </section>


        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}


        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">


          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Property List
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {hasActiveFilters
                    ? `${filteredProperties.length} of ${properties.length} properties`
                    : properties.length === 1
                    ? "1 property registered"
                    : `${properties.length} properties registered`}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                {filteredProperties.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>Rows:</span>
                      <select
                        value={pageSize}
                        onChange={(event) => {
                          setPageSize(Number(event.target.value));
                          setCurrentPage(1);
                        }}
                        className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        aria-label="Properties per page"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <span className="min-w-[105px] text-center text-sm text-slate-500">
                      {startIndex + 1}-{endIndex} of {totalFilteredProperties}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={safeCurrentPage <= 1}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={safeCurrentPage >= totalPages}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={loadProperties}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      loading
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  Refresh
                </button>
              </div>

            </div>


            <div className="mt-5">

              <div className="relative">

                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search by property name, ID, location, owner or agent..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery("")
                    }
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

              </div>

            </div>


            <div className="mt-4 flex flex-wrap items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (current) => !current
                  )
                }
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  showFilters ||
                  hasActiveFilters
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters

                {hasActiveFilters && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                    !
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                >
                  Reset Filters
                </button>
              )}

            </div>


            {showFilters && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Filter Properties
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Narrow the property list
                      using the options below.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowFilters(false)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-700"
                    title="Close filters"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Property Type
                    </label>

                    <select
                      value={propertyTypeFilter}
                      onChange={(event) =>
                        setPropertyTypeFilter(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">
                        All Types
                      </option>

                      {propertyTypes.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {formatPropertyType(
                              type
                            )}
                          </option>
                        )
                      )}
                    </select>
                  </div>


                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Listing Type
                    </label>

                    <select
                      value={listingTypeFilter}
                      onChange={(event) =>
                        setListingTypeFilter(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">
                        Sale & Rent
                      </option>

                      <option value="SALE">
                        For Sale
                      </option>

                      <option value="RENT">
                        For Rent
                      </option>
                    </select>
                  </div>


                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Location
                    </label>

                    <select
                      value={locationFilter}
                      onChange={(event) =>
                        setLocationFilter(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">
                        All Locations
                      </option>

                      {locations.map(
                        (location) => (
                          <option
                            key={location}
                            value={location}
                          >
                            {location}
                          </option>
                        )
                      )}
                    </select>
                  </div>


                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Status
                    </label>

                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">
                        All Statuses
                      </option>

                      <option value="ACTIVE">
                        Active
                      </option>

                      <option value="INACTIVE">
                        Inactive
                      </option>

                      <option value="AVAILABLE">
                        Available
                      </option>

                      <option value="UNAVAILABLE">
                        Unavailable
                      </option>

                      <option value="SOLD">
                        Sold
                      </option>

                      <option value="RENTED">
                        Rented
                      </option>
                    </select>
                  </div>


                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Minimum Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(event) =>
                        setMinPrice(
                          event.target.value
                        )
                      }
                      placeholder="e.g. 1000000"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>


                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Maximum Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(event) =>
                        setMaxPrice(
                          event.target.value
                        )
                      }
                      placeholder="e.g. 10000000"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>


                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Bedrooms
                    </label>

                    <select
                      value={bedroomsFilter}
                      onChange={(event) =>
                        setBedroomsFilter(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">
                        Any Bedrooms
                      </option>

                      <option value="1">
                        1 Bedroom
                      </option>

                      <option value="2">
                        2 Bedrooms
                      </option>

                      <option value="3">
                        3 Bedrooms
                      </option>

                      <option value="4">
                        4 Bedrooms
                      </option>

                      <option value="5+">
                        5+ Bedrooms
                      </option>
                    </select>
                  </div>


                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Bathrooms
                    </label>

                    <select
                      value={bathroomsFilter}
                      onChange={(event) =>
                        setBathroomsFilter(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">
                        Any Bathrooms
                      </option>

                      <option value="1">
                        1 Bathroom
                      </option>

                      <option value="2">
                        2 Bathrooms
                      </option>

                      <option value="3">
                        3 Bathrooms
                      </option>

                      <option value="4">
                        4 Bathrooms
                      </option>

                      <option value="5+">
                        5+ Bathrooms
                      </option>
                    </select>
                  </div>

                </div>


                {hasActiveFilters && (
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">

                    <p className="text-xs text-slate-500">
                      Showing{" "}
                      <span className="font-semibold text-slate-900">
                        {filteredProperties.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-slate-900">
                        {properties.length}
                      </span>{" "}
                      properties
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-red-600"
                    >
                      Clear All Filters
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>


          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading properties...
                </p>

              </div>

            </div>

          ) : filteredProperties.length === 0 ? (

            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Building2 className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {properties.length === 0
                  ? "No properties found"
                  : "No matching properties"}
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-400">
                {properties.length === 0
                  ? "Add your first property and it will appear here automatically."
                  : "Try changing your search or filters to find a property."}
              </p>

              {properties.length === 0 ? (
                <Link
                  href="/dashboard/admin/properties/add"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Property
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Search & Filters
                </button>
              )}

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-[1350px] w-full">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Property ID
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Property Name
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Type
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Location
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Price
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Owner Name
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Agent Name
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {paginatedProperties.map(
                    (property) => (

                      <tr
                        key={String(
                          property.id
                        )}
                        className="transition hover:bg-slate-50/70"
                      >


                        <td className="px-5 py-4">

                          <span className="font-mono text-sm font-semibold text-slate-700">
                            {property.id}
                          </span>

                        </td>


                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600">

                              {getImage(
                                property
                              ) ? (
                                <img
                                  src={
                                    getImage(
                                      property
                                    ) || ""
                                  }
                                  alt={
                                    property.title
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Building2 className="h-5 w-5" />
                              )}

                            </div>

                            <div className="min-w-0">

                              <p className="max-w-[220px] truncate text-sm font-semibold text-slate-900">
                                {property.title ||
                                  "Untitled Property"}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {formatListingType(
                                  property.listingType
                                )}
                              </p>

                            </div>

                          </div>

                        </td>


                        <td className="px-5 py-4">

                          <span className="text-sm font-medium text-slate-700">
                            {formatPropertyType(
                              property.propertyType
                            )}
                          </span>

                        </td>


                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />

                            <span className="max-w-[180px] truncate text-sm text-slate-600">
                              {getLocation(
                                property
                              )}
                            </span>

                          </div>

                        </td>


                        <td className="px-5 py-4">

                          <span className="text-sm font-semibold text-slate-900">
                            {formatPrice(
                              property.price
                            )}
                          </span>

                        </td>


                        <td className="px-5 py-4">

                          <span className="text-sm font-medium text-slate-700">
                            {property.ownerName ||
                              "EstateFlow Owner"}
                          </span>

                        </td>


                        <td className="px-5 py-4">

                          <span className="text-sm font-medium text-slate-700">
                            {property.agentName ||
                              "EstateFlow Agent"}
                          </span>

                        </td>


                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                              property.status,
                              property.availability
                            )}`}
                          >
                            {formatStatus(
                              property.status,
                              property.availability
                            )}
                          </span>

                        </td>


                        <td className="px-5 py-4">

                          <div className="flex items-center justify-center gap-2">


                            <button
                              type="button"
                              title="View Property"
                              onClick={() =>
                                setSelectedProperty(
                                  property
                                )
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </button>


                            <Link
                              href={`/dashboard/admin/properties/${property.id}/edit`}
                              title="Edit Property"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>


                            <button
                              type="button"
                              title="Delete Property"
                              disabled={
                                deletingId ===
                                String(
                                  property.id
                                )
                              }
                              onClick={() =>
                                handleDelete(
                                  property
                                )
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                              {deletingId ===
                              String(
                                property.id
                              ) ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-red-500" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {selectedProperty && (

          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onClick={() =>
              setSelectedProperty(null)
            }
          >

            <div
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >


              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Property Details
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {selectedProperty.title ||
                      "Untitled Property"}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedProperty(null)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              <div className="space-y-6 p-6">


                <div className="overflow-hidden rounded-2xl bg-slate-100">

                  {getImage(
                    selectedProperty
                  ) ? (

                    <img
                      src={
                        getImage(
                          selectedProperty
                        ) || ""
                      }
                      alt={
                        selectedProperty.title ||
                        "Property"
                      }
                      className="max-h-[400px] w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-[280px] flex-col items-center justify-center text-slate-400">

                      <ImageIcon className="h-10 w-10" />

                      <p className="mt-3 text-sm">
                        No property image available
                      </p>

                    </div>

                  )}

                </div>


                <div>

                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    Property Information
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <Info
                      label="Property ID"
                      value={
                        selectedProperty.id
                      }
                    />

                    <Info
                      label="Property Name"
                      value={
                        selectedProperty.title
                      }
                    />

                    <Info
                      label="Property Type"
                      value={formatPropertyType(
                        selectedProperty.propertyType
                      )}
                    />

                    <Info
                      label="Listing Type"
                      value={formatListingType(
                        selectedProperty.listingType
                      )}
                    />

                    <Info
                      label="Price"
                      value={formatPrice(
                        selectedProperty.price
                      )}
                    />

                    <Info
                      label="Status"
                      value={formatStatus(
                        selectedProperty.status,
                        selectedProperty.availability
                      )}
                    />

                    <Info
                      label="Owner"
                      value={
                        selectedProperty.ownerName ||
                        "EstateFlow Owner"
                      }
                    />

                    <Info
                      label="Agent"
                      value={
                        selectedProperty.agentName ||
                        "EstateFlow Agent"
                      }
                    />

                    <Info
                      label="Location"
                      value={getLocation(
                        selectedProperty
                      )}
                    />

                    <Info
                      label="City"
                      value={
                        selectedProperty.city
                      }
                    />

                    <Info
                      label="State"
                      value={
                        selectedProperty.state
                      }
                    />

                    <Info
                      label="Pincode"
                      value={
                        selectedProperty.pincode
                      }
                    />

                    <Info
                      label="Bedrooms"
                      value={
                        selectedProperty.bedrooms
                      }
                    />

                    <Info
                      label="Bathrooms"
                      value={
                        selectedProperty.bathrooms
                      }
                    />

                    <Info
                      label="Area"
                      value={
                        selectedProperty.area
                          ? `${selectedProperty.area} sq.ft`
                          : "—"
                      }
                    />

                  </div>

                </div>


                <div>

                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Description
                  </h3>

                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {selectedProperty.description ||
                      "No description available."}
                  </div>

                </div>


                <div>

                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Amenities
                  </h3>

                  {Array.isArray(
                    selectedProperty.amenities
                  ) &&
                  selectedProperty.amenities
                    .length > 0 ? (

                    <div className="flex flex-wrap gap-2">

                      {selectedProperty.amenities.map(
                        (
                          amenity,
                          index
                        ) => (

                          <span
                            key={`${amenity}-${index}`}
                            className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                          >
                            {amenity}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-sm text-slate-400">
                      No amenities available.
                    </p>

                  )}

                </div>


                <div>

                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Documents
                  </h3>

                  <p className="text-sm text-slate-500">

                    {Array.isArray(
                      selectedProperty.documents
                    ) &&
                    selectedProperty.documents
                      .length > 0
                      ? selectedProperty.documents.join(
                          ", "
                        )
                      : "No documents available."}

                  </p>

                </div>


                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedProperty(null)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>

                  <Link
                    href={`/dashboard/admin/properties/${selectedProperty.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Property
                  </Link>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </DashboardLayout>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {formatValue(value)}
      </p>

    </div>
  );
}
