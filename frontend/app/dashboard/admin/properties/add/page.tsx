"use client";

import {
  ArrowLeft,
  Building2,
  FileText,
  Image as ImageIcon,
  MapPin,
  Save,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getPropertyById, updateProperty } from "@/lib/propertyStore";
import { Property } from "@/types/property";
import {
  ListingType,
  PropertyAvailability,
  PropertyType,
} from "@/types/property";

const API_URL = "https://estate-flow-bj2z.onrender.com/api/v1";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminAddPropertyPage() {
  const router = useRouter();

  const [editId, setEditId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");

  const [owners, setOwners] = useState<User[]>([]);
  const [agents, setAgents] = useState<User[]>([]);

  const [form, setForm] = useState({
    id: "",
    title: "",
    propertyType: "APARTMENT" as PropertyType,
    listingType: "SALE" as ListingType,

    ownerId: "",
    ownerName: "",

    agentId: "",
    agentName: "",

    price: "",
    area: "",
    bedrooms: "0",
    bathrooms: "0",

    location: "",
    city: "",
    state: "",
    pincode: "",

    description: "",

    images: "",
    documents: "",
    amenities: "",

    availability: "AVAILABLE" as PropertyAvailability,
    listedDate: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentEditId = params.get("edit") || "";

    setEditId(currentEditId);
    setIsEditMode(Boolean(currentEditId));
  }, []);

  const getAccessToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    const directToken =
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (directToken) {
      return directToken;
    }

    const possibleKeys = [
      "auth",
      "user",
      "currentUser",
      "authUser",
    ];

    for (const key of possibleKeys) {
      const value = localStorage.getItem(key);

      if (!value) {
        continue;
      }

      try {
        const parsed = JSON.parse(value);

        if (parsed?.access_token) {
          return parsed.access_token;
        }

        if (parsed?.accessToken) {
          return parsed.accessToken;
        }

        if (parsed?.token) {
          return parsed.token;
        }
      } catch {}
    }

    return null;
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        setErrorMessage("");

        const token = getAccessToken();

        const headers: HeadersInit = {
          Accept: "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const ownerResponse = await fetch(
          `${API_URL}/users?role=owner&skip=0&limit=100`,
          {
            method: "GET",
            headers,
          }
        );

        if (!ownerResponse.ok) {
          const ownerError = await ownerResponse
            .json()
            .catch(() => ({}));

          throw new Error(
            ownerError?.detail || "Failed to load owners."
          );
        }

        const ownerData: User[] = await ownerResponse.json();

        const agentResponse = await fetch(
          `${API_URL}/users?role=agent&skip=0&limit=100`,
          {
            method: "GET",
            headers,
          }
        );

        if (!agentResponse.ok) {
          const agentError = await agentResponse
            .json()
            .catch(() => ({}));

          throw new Error(
            agentError?.detail || "Failed to load agents."
          );
        }

        const agentData: User[] = await agentResponse.json();

        setOwners(ownerData);
        setAgents(agentData);

        if (!editId && ownerData.length > 0) {
          const firstOwner = ownerData[0];

          setForm((current) => ({
            ...current,
            ownerId: firstOwner.id,
            ownerName: firstOwner.name,
          }));
        }

        if (!editId && agentData.length > 0) {
          const firstAgent = agentData[0];

          setForm((current) => ({
            ...current,
            agentId: firstAgent.id,
            agentName: firstAgent.name,
          }));
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load owners and agents."
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [editId]);

  useEffect(() => {
    if (!editId) {
      return;
    }

    let cancelled = false;

    const loadPropertyForEdit = async () => {
      try {
        setLoadingProperty(true);
        setErrorMessage("");

        const property = await getPropertyById(editId);

        if (cancelled) {
          return;
        }

        if (!property) {
          setErrorMessage("Property not found.");
          return;
        }

        const images = Array.isArray(property.images)
          ? property.images
          : [];

        const firstImage =
          typeof images[0] === "string"
            ? images[0]
            : "";

        const listedDateValue = property.listedDate
          ? new Date(property.listedDate)
              .toISOString()
              .split("T")[0]
          : "";

        setForm({
          id: String(property.id ?? editId),
          title: String(property.title ?? ""),

          propertyType:
            (property.propertyType ??
              "APARTMENT") as PropertyType,

          listingType:
            (property.listingType ??
              "SALE") as ListingType,

          ownerId: String(property.ownerId ?? ""),
          ownerName: String(property.ownerName ?? ""),

          agentId: String(property.agentId ?? ""),
          agentName: String(property.agentName ?? ""),

          price: String(property.price ?? ""),
          area: String(property.area ?? ""),
          bedrooms: String(property.bedrooms ?? 0),
          bathrooms: String(property.bathrooms ?? 0),

          location: String(property.location ?? ""),
          city: String(property.city ?? ""),
          state: String(property.state ?? ""),
          pincode: String(property.pincode ?? ""),

          description: String(property.description ?? ""),

          images: images.join(", "),

          documents: Array.isArray(property.documents)
            ? property.documents.join(", ")
            : String(property.documents ?? ""),

          amenities: Array.isArray(property.amenities)
            ? property.amenities.join(", ")
            : String(property.amenities ?? ""),

          availability:
            (property.availability ??
              "AVAILABLE") as PropertyAvailability,

          listedDate: listedDateValue,
        });

        setSelectedImage(firstImage);

        setSelectedImageName(
          firstImage ? "Current property image" : ""
        );
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load property."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingProperty(false);
        }
      }
    };

    loadPropertyForEdit();

    return () => {
      cancelled = true;
    };
  }, [editId]);

  const updateField = (
    field: string,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleOwnerChange = (ownerId: string) => {
    const selectedOwner = owners.find(
      (owner) => owner.id === ownerId
    );

    if (!selectedOwner) {
      setForm((current) => ({
        ...current,
        ownerId: "",
        ownerName: "",
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      ownerId: selectedOwner.id,
      ownerName: selectedOwner.name,
    }));
  };

  const handleAgentChange = (agentId: string) => {
    const selectedAgent = agents.find(
      (agent) => agent.id === agentId
    );

    if (!selectedAgent) {
      setForm((current) => ({
        ...current,
        agentId: "",
        agentName: "",
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      agentId: selectedAgent.id,
      agentName: selectedAgent.name,
    }));
  };

  const handleImageUpload = (
    file: File | undefined
  ) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        "Please select an image smaller than 5 MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        setErrorMessage(
          "Unable to read the selected image."
        );
        return;
      }

      setSelectedImage(result);
      setSelectedImageName(file.name);
      updateField("images", result);
      setErrorMessage("");
    };

    reader.onerror = () => {
      setErrorMessage(
        "Unable to read the selected image."
      );
    };

    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage("");
    setSelectedImageName("");
    updateField("images", "");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = getAccessToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      if (!form.ownerId) {
        throw new Error(
          "Please select an owner."
        );
      }

      if (!form.agentId) {
        throw new Error(
          "Please select an agent."
        );
      }

      const imageList = selectedImage
        ? [selectedImage]
        : form.images
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

      const documentList = form.documents
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const amenityList = form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (isEditMode && editId) {
        const updates: Partial<Property> = {
          ownerId: form.ownerId,
          ownerName: form.ownerName,

          agentId: form.agentId,
          agentName: form.agentName,

          title: form.title.trim(),
          description: form.description.trim(),

          propertyType: form.propertyType,
          listingType: form.listingType,

          price: Number(form.price),

          location: form.location.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),

          bedrooms: Number(form.bedrooms) || 0,
          bathrooms: Number(form.bathrooms) || 0,

          area: Number(form.area),

          amenities: amenityList,
          images: imageList,
          documents: documentList,

          availability: form.availability,

          listedDate: form.listedDate
            ? new Date(
                form.listedDate
              ).toISOString()
            : undefined,
        };

        const updatedProperty =
          await updateProperty(
            editId,
            updates
          );

        if (!updatedProperty) {
          throw new Error(
            "Failed to update property."
          );
        }

        setSuccessMessage(
          `Property "${updatedProperty.title}" updated successfully!`
        );

        window.dispatchEvent(
          new Event(
            "estateflow-properties-updated"
          )
        );

        setTimeout(() => {
          router.push(
            "/dashboard/admin/properties"
          );
        }, 800);

        return;
      }

      const propertyPayload = {
        id: form.id.trim() || undefined,

        owner_id: form.ownerId,
        owner_name: form.ownerName,

        agent_id: form.agentId,
        agent_name: form.agentName,

        title: form.title.trim(),
        description: form.description.trim(),

        property_type: form.propertyType,
        listing_type: form.listingType,

        price: Number(form.price),

        location: form.location.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim() || null,

        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),

        amenities: amenityList,
        images: imageList,
        documents: documentList,

        availability: form.availability,

        listed_date: form.listedDate
          ? new Date(
              form.listedDate
            ).toISOString()
          : null,
      };

      const response = await fetch(
        `${API_URL}/properties`,
        {
          method: "POST",

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(
            propertyPayload
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Failed to save property."
        );
      }

      setSuccessMessage(
        `Property "${data.title}" saved successfully!`
      );

      setForm({
        id: "",

        title: "",

        propertyType:
          "APARTMENT" as PropertyType,

        listingType:
          "SALE" as ListingType,

        ownerId:
          owners.length > 0
            ? owners[0].id
            : "",

        ownerName:
          owners.length > 0
            ? owners[0].name
            : "",

        agentId:
          agents.length > 0
            ? agents[0].id
            : "",

        agentName:
          agents.length > 0
            ? agents[0].name
            : "",

        price: "",
        area: "",
        bedrooms: "0",
        bathrooms: "0",

        location: "",
        city: "",
        state: "",
        pincode: "",

        description: "",

        images: "",
        documents: "",
        amenities: "",

        availability:
          "AVAILABLE" as PropertyAvailability,

        listedDate: "",
      });

      setSelectedImage("");
      setSelectedImageName("");

      setTimeout(() => {
        router.push(
          "/dashboard/admin/properties"
        );
      }, 1200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the property."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/dashboard/admin/properties"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isEditMode
              ? "Edit Property"
              : "Add Property"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {isEditMode
              ? "Update the existing property and save the changes to PostgreSQL."
              : "Add a new property and save it directly to PostgreSQL."}
          </p>

          {errorMessage && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}
        </div>

        {loadingProperty ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading property...
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Property Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Enter the basic property
                    information.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Property ID"
                  value={form.id}
                  onChange={(value) =>
                    updateField("id", value)
                  }
                  placeholder="Leave empty for automatic UUID"
                  className={inputClass}
                />

                <Field
                  label="Property Title"
                  value={form.title}
                  onChange={(value) =>
                    updateField("title", value)
                  }
                  placeholder="Premium 3 BHK Apartment"
                  required
                  className={inputClass}
                />

                <SelectField
                  label="Property Type"
                  value={form.propertyType}
                  onChange={(value) =>
                    updateField(
                      "propertyType",
                      value
                    )
                  }
                  className={inputClass}
                  options={[
                    [
                      "APARTMENT",
                      "Apartment",
                    ],
                    [
                      "VILLA",
                      "Villa",
                    ],
                    [
                      "HOUSE",
                      "House",
                    ],
                    [
                      "PLOT",
                      "Plot",
                    ],
                    [
                      "COMMERCIAL",
                      "Commercial",
                    ],
                  ]}
                />

                <SelectField
                  label="Listing Type"
                  value={form.listingType}
                  onChange={(value) =>
                    updateField(
                      "listingType",
                      value
                    )
                  }
                  className={inputClass}
                  options={[
                    [
                      "SALE",
                      "For Sale",
                    ],
                    [
                      "RENT",
                      "For Rent",
                    ],
                  ]}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Owner
                  </label>

                  <select
                    value={form.ownerId}
                    onChange={(e) =>
                      handleOwnerChange(
                        e.target.value
                      )
                    }
                    disabled={
                      loadingUsers ||
                      owners.length === 0
                    }
                    className={inputClass}
                  >
                    <option value="">
                      {loadingUsers
                        ? "Loading owners..."
                        : owners.length === 0
                        ? "No owners found"
                        : "Select owner"}
                    </option>

                    {owners.map(
                      (owner) => (
                        <option
                          key={owner.id}
                          value={owner.id}
                        >
                          {owner.name}
                        </option>
                      )
                    )}
                  </select>

                  <p className="mt-1 text-xs text-slate-400">
                    Owner ID is automatically
                    selected
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Agent
                  </label>

                  <select
                    value={form.agentId}
                    onChange={(e) =>
                      handleAgentChange(
                        e.target.value
                      )
                    }
                    disabled={
                      loadingUsers ||
                      agents.length === 0
                    }
                    className={inputClass}
                  >
                    <option value="">
                      {loadingUsers
                        ? "Loading agents..."
                        : agents.length === 0
                        ? "No agents found"
                        : "Select agent"}
                    </option>

                    {agents.map(
                      (agent) => (
                        <option
                          key={agent.id}
                          value={agent.id}
                        >
                          {agent.name}
                        </option>
                      )
                    )}
                  </select>

                  <p className="mt-1 text-xs text-slate-400">
                    Agent ID is automatically
                    selected
                  </p>
                </div>

                <Field
                  label="Price"
                  type="number"
                  value={form.price}
                  onChange={(value) =>
                    updateField("price", value)
                  }
                  placeholder="7500000"
                  required
                  className={inputClass}
                />

                <Field
                  label="Area (sq.ft)"
                  type="number"
                  value={form.area}
                  onChange={(value) =>
                    updateField("area", value)
                  }
                  placeholder="1500"
                  required
                  className={inputClass}
                />

                <Field
                  label="Bedrooms"
                  type="number"
                  value={form.bedrooms}
                  onChange={(value) =>
                    updateField(
                      "bedrooms",
                      value
                    )
                  }
                  placeholder="3"
                  className={inputClass}
                />

                <Field
                  label="Bathrooms"
                  type="number"
                  value={form.bathrooms}
                  onChange={(value) =>
                    updateField(
                      "bathrooms",
                      value
                    )
                  }
                  placeholder="2"
                  className={inputClass}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Location
                  </h2>

                  <p className="text-sm text-slate-500">
                    Enter the property location.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field
                    label="Location / Address"
                    value={form.location}
                    onChange={(value) =>
                      updateField(
                        "location",
                        value
                      )
                    }
                    placeholder="Benz Circle"
                    required
                    className={inputClass}
                  />
                </div>

                <Field
                  label="City"
                  value={form.city}
                  onChange={(value) =>
                    updateField("city", value)
                  }
                  placeholder="Vijayawada"
                  required
                  className={inputClass}
                />

                <Field
                  label="State"
                  value={form.state}
                  onChange={(value) =>
                    updateField("state", value)
                  }
                  placeholder="Andhra Pradesh"
                  required
                  className={inputClass}
                />

                <Field
                  label="Pincode"
                  value={form.pincode}
                  onChange={(value) =>
                    updateField(
                      "pincode",
                      value
                    )
                  }
                  placeholder="520010"
                  className={inputClass}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Description & Documents
                  </h2>

                  <p className="text-sm text-slate-500">
                    Add property description and
                    documents.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <TextAreaField
                  label="Description"
                  value={form.description}
                  onChange={(value) =>
                    updateField(
                      "description",
                      value
                    )
                  }
                  placeholder="A premium three bedroom apartment located in Vijayawada."
                  required
                />

                <Field
                  label="Documents"
                  value={form.documents}
                  onChange={(value) =>
                    updateField(
                      "documents",
                      value
                    )
                  }
                  placeholder="Sale Deed, Tax Receipt"
                  className={inputClass}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ImageIcon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Images & Amenities
                  </h2>

                  <p className="text-sm text-slate-500">
                    Add image URLs and amenities.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Property Image
                  </label>

                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {selectedImageName ||
                            "No image selected"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Choose an image from your computer. No image URL is required.
                        </p>
                      </div>

                      <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">
                        <Upload className="h-4 w-4" />
                        Add Image

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            handleImageUpload(
                              event.target.files?.[0]
                            );

                            event.currentTarget.value =
                              "";
                          }}
                        />
                      </label>
                    </div>

                    {selectedImage && (
                      <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <img
                          src={selectedImage}
                          alt="Selected property"
                          className="h-56 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={
                            removeSelectedImage
                          }
                          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition hover:bg-red-50 hover:text-red-600"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    The selected image is included in the property data sent to PostgreSQL and can be displayed in the properties table/view.
                  </p>
                </div>

                <Field
                  label="Amenities"
                  value={form.amenities}
                  onChange={(value) =>
                    updateField(
                      "amenities",
                      value
                    )
                  }
                  placeholder="Parking, Security, Swimming Pool"
                  className={inputClass}
                />

                <p className="text-xs text-slate-400">
                  Separate multiple values with
                  commas.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Availability"
                  value={form.availability}
                  onChange={(value) =>
                    updateField(
                      "availability",
                      value
                    )
                  }
                  className={inputClass}
                  options={[
                    [
                      "AVAILABLE",
                      "Available",
                    ],
                    [
                      "UNAVAILABLE",
                      "Unavailable",
                    ],
                    [
                      "SOLD",
                      "Sold",
                    ],
                    [
                      "RENTED",
                      "Rented",
                    ],
                  ]}
                />

                <Field
                  label="Listed Date"
                  type="date"
                  value={form.listedDate}
                  onChange={(value) =>
                    updateField(
                      "listedDate",
                      value
                    )
                  }
                  className={inputClass}
                />
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/dashboard/admin/properties"
                className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  loading ||
                  loadingProperty ||
                  loadingUsers ||
                  owners.length === 0 ||
                  agents.length === 0
                }
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />

                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update Property"
                  : "Save Property"}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        required={required}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        rows={5}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  className: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={className}
      >
        {options.map(
          ([optionValue, label]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {label}
            </option>
          )
        )}
      </select>
    </div>
  );
}
