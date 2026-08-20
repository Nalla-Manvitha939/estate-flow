import { Property } from "@/types/property";

const API_BASE_URL =
  "https://estate-flow-bj2z.onrender.com/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

function getHeaders(): HeadersInit {
  const token = getToken();

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function normalizeProperty(property: any): Property {
  return {
    ...property,
    ownerId: property.ownerId ?? property.owner_id,
    ownerName: property.ownerName ?? property.owner_name,
    agentId: property.agentId ?? property.agent_id,
    agentName: property.agentName ?? property.agent_name,
    propertyType:
      property.propertyType ?? property.property_type,
    listingType:
      property.listingType ?? property.listing_type,
    pincode: property.pincode,
    listedDate:
      property.listedDate ?? property.listed_date,
    createdAt:
      property.createdAt ?? property.created_at,
    updatedAt:
      property.updatedAt ?? property.updated_at,
  };
}

function propertyToBackend(property: any) {
  return {
    id: property.id,
    owner_id: property.ownerId ?? property.owner_id,
    owner_name:
      property.ownerName ?? property.owner_name ?? "",
    agent_id:
      property.agentId ?? property.agent_id ?? null,
    agent_name:
      property.agentName ?? property.agent_name ?? null,
    title: property.title,
    description: property.description,
    property_type:
      property.propertyType ?? property.property_type,
    listing_type:
      property.listingType ?? property.listing_type,
    price: Number(property.price),
    location: property.location,
    city: property.city,
    state: property.state,
    pincode: property.pincode ?? null,
    bedrooms: Number(property.bedrooms ?? 0),
    bathrooms: Number(property.bathrooms ?? 0),
    area: Number(property.area),
    amenities: property.amenities ?? [],
    images: property.images ?? [],
    documents: property.documents ?? [],
    availability:
      property.availability ?? "AVAILABLE",
    listed_date:
      property.listedDate ??
      property.listed_date ??
      null,
  };
}

function dispatchPropertyUpdate(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new Event("estateflow-properties-updated")
  );
}

export async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/properties?skip=0&limit=100`,
      {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      let message = `Failed to fetch properties: ${response.status}`;

      try {
        const errorData = await response.json();

        if (errorData?.detail) {
          message =
            typeof errorData.detail === "string"
              ? errorData.detail
              : JSON.stringify(errorData.detail);
        }
      } catch {}

      throw new Error(message);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(normalizeProperty);
  } catch (error) {
    console.error("Failed to load properties:", error);
    throw error;
  }
}

export async function saveProperties(
  properties: Property[]
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const existingProperties = await getProperties();

    const existingIds = new Set(
      existingProperties.map(
        (property) => String(property.id)
      )
    );

    for (const property of properties) {
      if (!existingIds.has(String(property.id))) {
        await addProperty(property);
      }
    }

    dispatchPropertyUpdate();
  } catch (error) {
    console.error("Failed to save properties:", error);
    throw error;
  }
}

export async function addProperty(
  property: Property
): Promise<Property> {
  const response = await fetch(
    `${API_BASE_URL}/properties`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(
        propertyToBackend(property)
      ),
    }
  );

  if (!response.ok) {
    let message = "Failed to add property";

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }
    } catch {}

    throw new Error(message);
  }

  const data = await response.json();

  dispatchPropertyUpdate();

  return normalizeProperty(data);
}

export async function updateProperty(
  propertyId: string,
  updates: Partial<Property>
): Promise<Property | undefined> {
  const backendUpdates: Record<string, any> = {};

  const mapping: Record<string, string> = {
    ownerId: "owner_id",
    ownerName: "owner_name",
    agentId: "agent_id",
    agentName: "agent_name",
    propertyType: "property_type",
    listingType: "listing_type",
    listedDate: "listed_date",
  };

  Object.entries(updates).forEach(
    ([key, value]) => {
      backendUpdates[mapping[key] ?? key] = value;
    }
  );

  const response = await fetch(
    `${API_BASE_URL}/properties/${encodeURIComponent(
      propertyId
    )}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(backendUpdates),
    }
  );

  if (!response.ok) {
    let message = "Failed to update property";

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }
    } catch {}

    throw new Error(message);
  }

  const data = await response.json();

  dispatchPropertyUpdate();

  return normalizeProperty(data);
}

export async function deleteProperty(
  propertyId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/properties/${encodeURIComponent(
      propertyId
    )}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    let message = "Failed to delete property";

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }
    } catch {}

    throw new Error(message);
  }

  dispatchPropertyUpdate();
}

export async function getPropertyById(
  propertyId: string
): Promise<Property | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/properties/${encodeURIComponent(
        propertyId
      )}`,
      {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      let message = `Failed to fetch property: ${response.status}`;

      try {
        const errorData = await response.json();

        if (errorData?.detail) {
          message =
            typeof errorData.detail === "string"
              ? errorData.detail
              : JSON.stringify(errorData.detail);
        }
      } catch {}

      throw new Error(message);
    }

    const data = await response.json();

    return normalizeProperty(data);
  } catch (error) {
    console.error(
      "Failed to load property:",
      error
    );

    return null;
  }
}

export async function getPropertiesByOwner(
  ownerId: string
): Promise<Property[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/properties/my-properties?skip=0&limit=100`,
      {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch owner properties: ${response.status}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(normalizeProperty)
      .filter(
        (property) =>
          String(property.ownerId) ===
          String(ownerId)
      );
  } catch (error) {
    console.error(
      "Failed to load owner properties:",
      error
    );

    return [];
  }
}

export async function getActiveProperties(): Promise<Property[]> {
  const properties = await getProperties();

  return properties.filter((property) => {
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
  });
}

export async function getSoldProperties(): Promise<Property[]> {
  const properties = await getProperties();

  return properties.filter(
    (property) =>
      String(
        property.status ?? ""
      ).toUpperCase() === "SOLD"
  );
}

export async function getRentedProperties(): Promise<Property[]> {
  const properties = await getProperties();

  return properties.filter(
    (property) =>
      String(
        property.listingType ?? ""
      ).toUpperCase() === "RENT" ||
      String(
        property.availability ?? ""
      ).toUpperCase() === "RENTED" ||
      String(
        property.status ?? ""
      ).toUpperCase() === "RENTED"
  );
}

export async function getAvailableProperties(): Promise<Property[]> {
  const properties = await getProperties();

  return properties.filter(
    (property) =>
      String(
        property.availability ?? ""
      ).toUpperCase() === "AVAILABLE" &&
      (
        String(
          property.status ?? ""
        ).toUpperCase() === "ACTIVE" ||
        String(
          property.status ?? ""
        ).toUpperCase() === "AVAILABLE"
      )
  );
}

export async function getInactiveProperties(): Promise<Property[]> {
  const properties = await getProperties();

  return properties.filter(
    (property) =>
      String(
        property.status ?? ""
      ).toUpperCase() === "INACTIVE"
  );
}

export async function getPropertyCount(): Promise<number> {
  const properties = await getProperties();

  return properties.length;
}

export async function getActivePropertyCount(): Promise<number> {
  const properties = await getActiveProperties();

  return properties.length;
}

export async function getSoldPropertyCount(): Promise<number> {
  const properties = await getSoldProperties();

  return properties.length;
}

export async function getRentedPropertyCount(): Promise<number> {
  const properties = await getRentedProperties();

  return properties.length;
}

export async function clearProperties(): Promise<void> {
  try {
    const properties = await getProperties();

    await Promise.all(
      properties.map((property) =>
        deleteProperty(
          String(property.id)
        )
      )
    );

    dispatchPropertyUpdate();
  } catch (error) {
    console.error(
      "Failed to clear properties:",
      error
    );

    throw error;
  }
}
