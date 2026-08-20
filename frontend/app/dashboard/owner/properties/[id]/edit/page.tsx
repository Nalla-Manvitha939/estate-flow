"use client";

import {
  ArrowLeft,
  Building2,
  ImagePlus,
  Save,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";

import {
  getPropertyById,
  updateProperty,
} from "@/lib/propertyStore";

import {
  ListingType,
  Property,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

const propertyTypes: {
  value: PropertyType;
  label: string;
}[] = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "HOUSE", label: "House" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
];

const listingTypes: {
  value: ListingType;
  label: string;
}[] = [
  { value: "SALE", label: "For Sale" },
  { value: "RENT", label: "For Rent" },
];

const propertyStatuses: {
  value: PropertyStatus;
  label: string;
}[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SOLD", label: "Sold" },
];

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const propertyId = String(params.id ?? "");

  const [property, setProperty] =
    useState<Property | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [propertyType, setPropertyType] =
    useState<PropertyType>("APARTMENT");

  const [listingType, setListingType] =
    useState<ListingType>("SALE");

  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");

  const [amenities, setAmenities] = useState("");

  const [status, setStatus] =
    useState<PropertyStatus>("ACTIVE");

  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState("");
  const [imageName, setImageName] = useState("");



  useEffect(() => {
    let mounted = true;

    const loadProperty = async () => {
      if (!propertyId) {
        setError("Property ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const storedProperty =
          await getPropertyById(propertyId);

        if (!mounted) {
          return;
        }

        if (!storedProperty) {
          setError("Property not found.");
          setLoading(false);
          return;
        }

        setProperty(storedProperty);

        setTitle(storedProperty.title ?? "");
        setDescription(
          storedProperty.description ?? ""
        );

        setPropertyType(
          storedProperty.propertyType ??
            "APARTMENT"
        );

        setListingType(
          storedProperty.listingType ?? "SALE"
        );

        setPrice(
          String(storedProperty.price ?? "")
        );

        setBedrooms(
          String(storedProperty.bedrooms ?? "")
        );

        setBathrooms(
          String(storedProperty.bathrooms ?? "")
        );

        setArea(
          String(storedProperty.area ?? "")
        );

        setCity(storedProperty.city ?? "");
        setState(storedProperty.state ?? "");
        setAddress(storedProperty.address ?? "");

        setAmenities(
          Array.isArray(storedProperty.amenities)
            ? storedProperty.amenities.join(", ")
            : ""
        );

        setStatus(
          storedProperty.status ?? "ACTIVE"
        );

        setImageUrl(
          storedProperty.imageUrl ?? ""
        );

        setLoading(false);
      } catch (err) {
        console.error(
          "Failed to load property:",
          err
        );

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load property."
          );

          setLoading(false);
        }
      }
    };

    loadProperty();

    return () => {
      mounted = false;
    };
  }, [propertyId]);

  

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image size must be less than 5 MB."
      );
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewImage(reader.result);
        setImageName(file.name);
      }
    };

    reader.readAsDataURL(file);
  };

  const removeNewImage = () => {
    setNewImage("");
    setImageName("");
  };

  

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!property) {
      setError(
        "Property could not be loaded."
      );
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const parsedPrice = Number(price);
      const parsedBedrooms = Number(bedrooms);
      const parsedBathrooms = Number(bathrooms);
      const parsedArea = Number(area);

      
      if (
        !title.trim() ||
        !city.trim() ||
        !state.trim() ||
        !address.trim()
      ) {
        throw new Error(
          "Please fill in all required fields."
        );
      }

      
      if (
        Number.isNaN(parsedPrice) ||
        parsedPrice < 0
      ) {
        throw new Error(
          "Please enter a valid price."
        );
      }

      

      if (
        Number.isNaN(parsedBedrooms) ||
        parsedBedrooms < 0
      ) {
        throw new Error(
          "Please enter a valid number of bedrooms."
        );
      }

      

      if (
        Number.isNaN(parsedBathrooms) ||
        parsedBathrooms < 0
      ) {
        throw new Error(
          "Please enter a valid number of bathrooms."
        );
      }

      

      if (
        Number.isNaN(parsedArea) ||
        parsedArea <= 0
      ) {
        throw new Error(
          "Please enter a valid area."
        );
      }

      
      const parsedAmenities = amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      
      const updatedImage =
        newImage || imageUrl || "";

      

      const updatedProperty =
        await updateProperty(property.id, {
          title: title.trim(),

          description: description.trim(),

          propertyType,

          listingType,

          price: parsedPrice,

          bedrooms: parsedBedrooms,

          bathrooms: parsedBathrooms,

          area: parsedArea,

          city: city.trim(),

          state: state.trim(),

          address: address.trim(),

          amenities: parsedAmenities,

          imageUrl: updatedImage,

          status,
        });

      if (!updatedProperty) {
        throw new Error(
          "Property update failed."
        );
      }

      

      setProperty(updatedProperty);

      setSuccess(
        "Property updated successfully."
      );

      

      setTimeout(() => {
        router.push(
          "/dashboard/owner/properties"
        );
      }, 700);
    } catch (err) {
      console.error(
        "Failed to update property:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the property."
      );
    } finally {
      setSaving(false);
    }
  };

  

  if (loading) {
    return (
      <DashboardLayout role="owner">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading property...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  
  if (!property) {
    return (
      <DashboardLayout role="owner">
        <div className="mx-auto max-w-3xl py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Building2 className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Property not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error ||
              "The property you are looking for does not exist."}
          </p>

          <Link
            href="/dashboard/owner/properties"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Properties
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  

  const previewImage =
    newImage || imageUrl;

  

  return (
    <DashboardLayout role="owner">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Property Management
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Edit Property
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Update your property information and listing image.
            </p>
          </div>

          <Link
            href="/dashboard/owner/properties"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          
          
          

          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ImagePlus className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Property Image
                  </h2>

                  <p className="text-sm text-slate-400">
                    Update the main image for this property.
                  </p>
                </div>

              </div>
            </div>

            <div className="p-6 sm:p-8">

              {previewImage ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

                  <img
                    src={previewImage}
                    alt={property.title}
                    className="h-[280px] w-full object-cover sm:h-[360px]"
                  />

                  {newImage && (
                    <button
                      type="button"
                      onClick={removeNewImage}
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-lg transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove selected image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {newImage && (
                    <div className="absolute bottom-4 left-4 rounded-lg bg-black/65 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
                      New image selected
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex h-[280px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 sm:h-[360px]">

                  <div className="text-center">
                    <ImagePlus className="mx-auto h-10 w-10 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No property image
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Upload an image below
                    </p>
                  </div>

                </div>
              )}

              <div className="mt-5">

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600">

                  <Upload className="h-4 w-4" />

                  {newImage
                    ? "Change Image"
                    : "Choose Image"}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

                {imageName && (
                  <p className="mt-2 text-center text-xs text-slate-400">
                    {imageName}
                  </p>
                )}

                <p className="mt-2 text-center text-xs text-slate-400">
                  JPG, PNG or WebP · Maximum 5 MB
                </p>

              </div>

            </div>
          </section>

          
          
          

          <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">

              <h2 className="font-semibold text-slate-900">
                Property Information
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Update the basic details of your property.
              </p>

            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">

              <Field
                label="Property Title"
                value={title}
                onChange={setTitle}
                placeholder="3 BHK Apartment"
                required
              />

              <SelectField
                label="Property Type"
                value={propertyType}
                onChange={(value) =>
                  setPropertyType(
                    value as PropertyType
                  )
                }
                options={propertyTypes}
              />

              <SelectField
                label="Listing Type"
                value={listingType}
                onChange={(value) =>
                  setListingType(
                    value as ListingType
                  )
                }
                options={listingTypes}
              />

              <SelectField
                label="Status"
                value={status}
                onChange={(value) =>
                  setStatus(
                    value as PropertyStatus
                  )
                }
                options={propertyStatuses}
              />

              <Field
                label="Price"
                type="number"
                value={price}
                onChange={setPrice}
                placeholder="7000000"
                min="0"
                required
              />

              <Field
                label="Area (Sq Ft)"
                type="number"
                value={area}
                onChange={setArea}
                placeholder="1488"
                min="1"
                required
              />

              <Field
                label="Bedrooms"
                type="number"
                value={bedrooms}
                onChange={setBedrooms}
                placeholder="3"
                min="0"
                required
              />

              <Field
                label="Bathrooms"
                type="number"
                value={bathrooms}
                onChange={setBathrooms}
                placeholder="4"
                min="0"
                required
              />

              <Field
                label="City"
                value={city}
                onChange={setCity}
                placeholder="Vijayawada"
                required
              />

              <Field
                label="State"
                value={state}
                onChange={setState}
                placeholder="Andhra Pradesh"
                required
              />

              <div className="sm:col-span-2">

                <Field
                  label="Address"
                  value={address}
                  onChange={setAddress}
                  placeholder="Enter complete property address"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="sm:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Describe the property..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

              {/* AMENITIES */}

              <div className="sm:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Amenities
                </label>

                <input
                  type="text"
                  value={amenities}
                  onChange={(event) =>
                    setAmenities(
                      event.target.value
                    )
                  }
                  placeholder="Parking, Swimming Pool, Gym, Security"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Separate amenities using commas.
                </p>

              </div>

            </div>
          </section>

          
          
          

          {(error || success) && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                error
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-green-200 bg-green-50 text-green-600"
              }`}
            >
              {error || success}
            </div>
          )}

          
          
          

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/dashboard/owner/properties"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0B63F6] to-[#2F8CFF] px-7 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />

              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </form>
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
  min,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-blue-600">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        min={min}
        required={required}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
}



function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

    </div>
  );
}