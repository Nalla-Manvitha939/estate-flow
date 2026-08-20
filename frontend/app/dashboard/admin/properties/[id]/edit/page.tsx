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
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";

import {
  getPropertyById,
  updateProperty,
} from "@/lib/propertyStore";

import {
  ListingType,
  Property,
  PropertyAvailability,
  PropertyType,
} from "@/types/property";

type User = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

export default function AdminEditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const propertyId = String(
    params?.id ?? ""
  );

  
  
  

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [loadingUsers, setLoadingUsers] =
    useState(true);

  const [property, setProperty] =
    useState<Property | null>(null);

  const [owners, setOwners] =
    useState<User[]>([]);

  const [agents, setAgents] =
    useState<User[]>([]);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  
  
  

  const [selectedImage, setSelectedImage] =
    useState("");

  const [selectedImageName, setSelectedImageName] =
    useState("");

  
  
  

  const [form, setForm] = useState({
    id: "",
    title: "",

    propertyType:
      "APARTMENT" as PropertyType,

    listingType:
      "SALE" as ListingType,

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

    availability:
      "AVAILABLE" as PropertyAvailability,

    listedDate: "",
  });

  
  
  

  const getAccessToken = (): string | null => {
    if (
      typeof window === "undefined"
    ) {
      return null;
    }

    const directToken =
      localStorage.getItem(
        "access_token"
      ) ||
      localStorage.getItem(
        "accessToken"
      ) ||
      localStorage.getItem("token") ||
      localStorage.getItem(
        "authToken"
      );

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
      const value =
        localStorage.getItem(key);

      if (!value) {
        continue;
      }

      try {
        const parsed =
          JSON.parse(value);

        if (parsed?.access_token) {
          return parsed.access_token;
        }

        if (parsed?.accessToken) {
          return parsed.accessToken;
        }

        if (parsed?.token) {
          return parsed.token;
        }
      } catch {
        // Ignore invalid JSON
      }
    }

    return null;
  };

  
  
  

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      try {
        setLoadingUsers(true);

        const token =
          getAccessToken();

        const headers: HeadersInit = {
          Accept:
            "application/json",
        };

        if (token) {
          headers.Authorization =
            `Bearer ${token}`;
        }

        const [
          ownerResponse,
          agentResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/users?role=owner&skip=0&limit=100`,
            {
              method: "GET",
              headers,
            }
          ),

          fetch(
            `${API_URL}/users?role=agent&skip=0&limit=100`,
            {
              method: "GET",
              headers,
            }
          ),
        ]);

        if (!ownerResponse.ok) {
          const data =
            await ownerResponse
              .json()
              .catch(() => ({}));

          throw new Error(
            data?.detail ||
              "Failed to load owners."
          );
        }

        if (!agentResponse.ok) {
          const data =
            await agentResponse
              .json()
              .catch(() => ({}));

          throw new Error(
            data?.detail ||
              "Failed to load agents."
          );
        }

        const ownerData =
          await ownerResponse.json();

        const agentData =
          await agentResponse.json();

        if (cancelled) {
          return;
        }

        setOwners(
          Array.isArray(ownerData)
            ? ownerData
            : []
        );

        setAgents(
          Array.isArray(agentData)
            ? agentData
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load users:",
          error
        );

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load owners and agents."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingUsers(false);
        }
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  
  
  

  useEffect(() => {
    if (!propertyId) {
      setErrorMessage(
        "Property ID is missing."
      );

      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProperty = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        
         
         
         
         
         
         
         
        const existingProperty =
          await getPropertyById(
            propertyId
          );

        if (cancelled) {
          return;
        }

        if (!existingProperty) {
          setProperty(null);

          setErrorMessage(
            `Property "${propertyId}" was not found in PostgreSQL.`
          );

          return;
        }

        setProperty(
          existingProperty
        );

        
        
        

        const images =
          Array.isArray(
            existingProperty.images
          )
            ? existingProperty.images
            : [];

        const firstImage =
          typeof images[0] === "string"
            ? images[0]
            : "";

        
        
        

        let listedDate = "";

        if (
          existingProperty.listedDate
        ) {
          const date =
            new Date(
              existingProperty.listedDate
            );

          if (
            !Number.isNaN(
              date.getTime()
            )
          ) {
            listedDate =
              date
                .toISOString()
                .split("T")[0];
          }
        }

        
        
        

        setForm({
          id: String(
            existingProperty.id ??
              propertyId
          ),

          title: String(
            existingProperty.title ??
              ""
          ),

          propertyType:
            (existingProperty.propertyType ??
              "APARTMENT") as PropertyType,

          listingType:
            (existingProperty.listingType ??
              "SALE") as ListingType,

          ownerId: String(
            existingProperty.ownerId ??
              ""
          ),

          ownerName: String(
            existingProperty.ownerName ??
              ""
          ),

          agentId: String(
            existingProperty.agentId ??
              ""
          ),

          agentName: String(
            existingProperty.agentName ??
              ""
          ),

          price: String(
            existingProperty.price ??
              ""
          ),

          area: String(
            existingProperty.area ??
              ""
          ),

          bedrooms: String(
            existingProperty.bedrooms ??
              0
          ),

          bathrooms: String(
            existingProperty.bathrooms ??
              0
          ),

          location: String(
            existingProperty.location ??
              existingProperty.address ??
              ""
          ),

          city: String(
            existingProperty.city ??
              ""
          ),

          state: String(
            existingProperty.state ??
              ""
          ),

          pincode: String(
            existingProperty.pincode ??
              ""
          ),

          description: String(
            existingProperty.description ??
              ""
          ),

          images:
            images.join(", "),

          documents:
            Array.isArray(
              existingProperty.documents
            )
              ? existingProperty.documents.join(
                  ", "
                )
              : String(
                  existingProperty.documents ??
                    ""
                ),

          amenities:
            Array.isArray(
              existingProperty.amenities
            )
              ? existingProperty.amenities.join(
                  ", "
                )
              : String(
                  existingProperty.amenities ??
                    ""
                ),

          availability:
            (existingProperty.availability ??
              "AVAILABLE") as PropertyAvailability,

          listedDate,
        });

        setSelectedImage(
          firstImage
        );

        setSelectedImageName(
          firstImage
            ? "Current property image"
            : ""
        );
      } catch (error) {
        console.error(
          "Failed to load property:",
          error
        );

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load property."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProperty();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  
  
  

  const updateField = (
    field: string,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  
  
  

  const handleOwnerChange = (
    ownerId: string
  ) => {
    const owner =
      owners.find(
        (item) =>
          String(item.id) ===
          String(ownerId)
      );

    setForm((current) => ({
      ...current,
      ownerId:
        owner?.id ?? ownerId,
      ownerName:
        owner?.name ??
        current.ownerName,
    }));
  };

  
  
  

  const handleAgentChange = (
    agentId: string
  ) => {
    const agent =
      agents.find(
        (item) =>
          String(item.id) ===
          String(agentId)
      );

    setForm((current) => ({
      ...current,
      agentId:
        agent?.id ?? agentId,
      agentName:
        agent?.name ??
        current.agentName,
    }));
  };

  
  
  

  const handleImageUpload = (
    file: File | undefined
  ) => {
    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setErrorMessage(
        "Please select a valid image file."
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setErrorMessage(
        "Please select an image smaller than 5 MB."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result !==
        "string"
      ) {
        setErrorMessage(
          "Unable to read the selected image."
        );

        return;
      }

      setSelectedImage(
        reader.result
      );

      setSelectedImageName(
        file.name
      );

      updateField(
        "images",
        reader.result
      );

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

    updateField(
      "images",
      ""
    );
  };

  
 
  

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!property) {
      setErrorMessage(
        "Property could not be loaded."
      );

      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token =
        getAccessToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      if (!form.title.trim()) {
        throw new Error(
          "Please enter the property title."
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

      if (
        !form.price ||
        Number(form.price) < 0
      ) {
        throw new Error(
          "Please enter a valid price."
        );
      }

      if (
        !form.area ||
        Number(form.area) <= 0
      ) {
        throw new Error(
          "Please enter a valid area."
        );
      }

      
      
      

      const imageList =
        selectedImage
          ? [selectedImage]
          : form.images
              .split(",")
              .map(
                (item) =>
                  item.trim()
              )
              .filter(Boolean);

     
      
      

      const documentList =
        form.documents
          .split(",")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean);

      
      
      

      const amenityList =
        form.amenities
          .split(",")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean);

      
      
      

      const updates: Partial<Property> =
        {
          ownerId:
            form.ownerId,

          ownerName:
            form.ownerName,

          agentId:
            form.agentId,

          agentName:
            form.agentName,

          title:
            form.title.trim(),

          description:
            form.description.trim(),

          propertyType:
            form.propertyType,

          listingType:
            form.listingType,

          price:
            Number(form.price),

          location:
            form.location.trim(),

          city:
            form.city.trim(),

          state:
            form.state.trim(),

          pincode:
            form.pincode.trim(),

          bedrooms:
            Number(
              form.bedrooms
            ) || 0,

          bathrooms:
            Number(
              form.bathrooms
            ) || 0,

          area:
            Number(form.area),

          amenities:
            amenityList,

          images:
            imageList,

          documents:
            documentList,

          availability:
            form.availability,

          listedDate:
            form.listedDate
              ? new Date(
                  form.listedDate
                ).toISOString()
              : undefined,
        };

      const updatedProperty =
        await updateProperty(
          propertyId,
          updates
        );

      if (!updatedProperty) {
        throw new Error(
          "Property update failed."
        );
      }

      console.log(
        "Property updated successfully:",
        updatedProperty
      );

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

        router.refresh();
      }, 800);
    } catch (error) {
      console.error(
        "Failed to update property:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update property."
      );
    } finally {
      setSaving(false);
    }
  };

  
  
  

  const inputClass =
    "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  
  
  

  if (loading) {
    return (
      <DashboardLayout role="admin">
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
      <DashboardLayout role="admin">
        <div className="mx-auto max-w-3xl py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Building2 className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Property not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {errorMessage ||
              "The property could not be loaded."}
          </p>

          <Link
            href="/dashboard/admin/properties"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  
  
  

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-8">
          <Link
            href="/dashboard/admin/properties"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit Property
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the existing property
            and save the changes to
            PostgreSQL.
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
                  Update the property details.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Property ID"
                value={form.id}
                onChange={() => {}}
                className={inputClass}
                disabled
              />

              <Field
                label="Property Title"
                value={form.title}
                onChange={(value) =>
                  updateField(
                    "title",
                    value
                  )
                }
                placeholder="Premium 3 BHK Apartment"
                required
                className={inputClass}
              />

              <SelectField
                label="Property Type"
                value={
                  form.propertyType
                }
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
                value={
                  form.listingType
                }
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

              {/* OWNER */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Owner
                </label>

                <select
                  value={
                    form.ownerId
                  }
                  onChange={(event) =>
                    handleOwnerChange(
                      event.target
                        .value
                    )
                  }
                  disabled={
                    loadingUsers ||
                    owners.length ===
                      0
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="">
                    {loadingUsers
                      ? "Loading owners..."
                      : owners.length ===
                        0
                      ? "No owners found"
                      : "Select owner"}
                  </option>

                  {owners.map(
                    (owner) => (
                      <option
                        key={
                          owner.id
                        }
                        value={
                          owner.id
                        }
                      >
                        {
                          owner.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* AGENT */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Agent
                </label>

                <select
                  value={
                    form.agentId
                  }
                  onChange={(event) =>
                    handleAgentChange(
                      event.target
                        .value
                    )
                  }
                  disabled={
                    loadingUsers ||
                    agents.length ===
                      0
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="">
                    {loadingUsers
                      ? "Loading agents..."
                      : agents.length ===
                        0
                      ? "No agents found"
                      : "Select agent"}
                  </option>

                  {agents.map(
                    (agent) => (
                      <option
                        key={
                          agent.id
                        }
                        value={
                          agent.id
                        }
                      >
                        {
                          agent.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <Field
                label="Price"
                type="number"
                value={
                  form.price
                }
                onChange={(value) =>
                  updateField(
                    "price",
                    value
                  )
                }
                placeholder="7500000"
                required
                className={
                  inputClass
                }
              />

              <Field
                label="Area (sq.ft)"
                type="number"
                value={
                  form.area
                }
                onChange={(value) =>
                  updateField(
                    "area",
                    value
                  )
                }
                placeholder="1500"
                required
                className={
                  inputClass
                }
              />

              <Field
                label="Bedrooms"
                type="number"
                value={
                  form.bedrooms
                }
                onChange={(value) =>
                  updateField(
                    "bedrooms",
                    value
                  )
                }
                placeholder="3"
                className={
                  inputClass
                }
              />

              <Field
                label="Bathrooms"
                type="number"
                value={
                  form.bathrooms
                }
                onChange={(value) =>
                  updateField(
                    "bathrooms",
                    value
                  )
                }
                placeholder="2"
                className={
                  inputClass
                }
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
                  Update the property location.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field
                  label="Location / Address"
                  value={
                    form.location
                  }
                  onChange={(value) =>
                    updateField(
                      "location",
                      value
                    )
                  }
                  placeholder="Benz Circle"
                  required
                  className={
                    inputClass
                  }
                />
              </div>

              <Field
                label="City"
                value={
                  form.city
                }
                onChange={(value) =>
                  updateField(
                    "city",
                    value
                  )
                }
                placeholder="Vijayawada"
                required
                className={
                  inputClass
                }
              />

              <Field
                label="State"
                value={
                  form.state
                }
                onChange={(value) =>
                  updateField(
                    "state",
                    value
                  )
                }
                placeholder="Andhra Pradesh"
                required
                className={
                  inputClass
                }
              />

              <Field
                label="Pincode"
                value={
                  form.pincode
                }
                onChange={(value) =>
                  updateField(
                    "pincode",
                    value
                  )
                }
                placeholder="520010"
                className={
                  inputClass
                }
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
                  Update description and documents.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <TextAreaField
                label="Description"
                value={
                  form.description
                }
                onChange={(value) =>
                  updateField(
                    "description",
                    value
                  )
                }
                placeholder="Describe the property..."
                required
              />

              <Field
                label="Documents"
                value={
                  form.documents
                }
                onChange={(value) =>
                  updateField(
                    "documents",
                    value
                  )
                }
                placeholder="Sale Deed, Tax Receipt"
                className={
                  inputClass
                }
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
                  Update the property image and amenities.
                </p>
              </div>
            </div>

            {/* IMAGE */}

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
                      Choose a new image if you want to replace the current one.
                    </p>
                  </div>

                  <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700">
                    <Upload className="h-4 w-4" />

                    Change Image

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(
                        event
                      ) => {
                        handleImageUpload(
                          event
                            .target
                            .files?.[0]
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
                      src={
                        selectedImage
                      }
                      alt={
                        form.title
                      }
                      className="h-56 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={
                        removeSelectedImage
                      }
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AMENITIES */}

            <div className="mt-5">
              <Field
                label="Amenities"
                value={
                  form.amenities
                }
                onChange={(value) =>
                  updateField(
                    "amenities",
                    value
                  )
                }
                placeholder="Parking, Security, Swimming Pool"
                className={
                  inputClass
                }
              />

              <p className="mt-2 text-xs text-slate-400">
                Separate multiple amenities with commas.
              </p>
            </div>
          </section>

          
              
          

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Availability"
                value={
                  form.availability
                }
                onChange={(value) =>
                  updateField(
                    "availability",
                    value
                  )
                }
                className={
                  inputClass
                }
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
                value={
                  form.listedDate
                }
                onChange={(value) =>
                  updateField(
                    "listedDate",
                    value
                  )
                }
                className={
                  inputClass
                }
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
                saving ||
                loadingUsers
              }
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />

              {saving
                ? "Updating..."
                : "Update Property"}
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
  required = false,
  className,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        required={required}
        disabled={disabled}
        className={`${className} ${
          disabled
            ? "cursor-not-allowed bg-slate-50 text-slate-500"
            : ""
        }`}
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
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        required={required}
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
  onChange: (
    value: string
  ) => void;
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
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className={className}
      >
        {options.map(
          ([
            optionValue,
            optionLabel,
          ]) => (
            <option
              key={
                optionValue
              }
              value={
                optionValue
              }
            >
              {
                optionLabel
              }
            </option>
          )
        )}
      </select>
    </div>
  );
}