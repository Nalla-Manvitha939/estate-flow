import { Property } from "@/types/property";

const API_BASE_URL =
  "https://estate-flow-bj2z.onrender.com/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const directKeys = [
    "access_token",
    "accessToken",
    "token",
    "authToken",
  ];

  for (const key of directKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      return value;
    }
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

      if (parsed?.user?.access_token) {
        return parsed.user.access_token;
      }

      if (parsed?.user?.accessToken) {
        return parsed.user.accessToken;
      }

      if (parsed?.user?.token) {
        return parsed.user.token;
      }
    } catch {}
  }

  return null;
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

    id: String(property.id ?? ""),

    ownerId:
      property.ownerId ??
      property.owner_id ??
      property.owner?.id ??
      "",

    ownerName:
      property.ownerName ??
      property.owner_name ??
      property.owner?.name ??
      "",

    agentId:
      property.agentId ??
      property.agent_id ??
      property.agent?.id ??
      "",

    agentName:
      property.agentName ??
      property.agent_name ??
      property.agent?.name ??
      "",

    propertyType:
      property.propertyType ??
      property.property_type ??
      "",

    listingType:
      property.listingType ??
      property.listing_type ??
      "",

    pincode:
      property.pincode ?? "",

    listedDate:
      property.listedDate ??
      property.listed_date ??
      null,

    createdAt:
      property.createdAt ??
      property.created_at ??
      null,

    updatedAt:
      property.updatedAt ??
      property.updated_at ??
      null,

    price:
      Number(property.price ?? 0),

    area:
      Number(property.area ?? 0),

    bedrooms:
      Number(property.bedrooms ?? 0),

    bathrooms:
      Number(property.bathrooms ?? 0),

    amenities:
      Array.isArray(property.amenities)
        ? property.amenities
        : [],

    images:
      Array.isArray(property.images)
        ? property.images
        : [],

    documents:
      Array.isArray(property.documents)
        ? property.documents
        : [],
  };
}

function propertyToBackend(property: any) {
  return {
    id: property.id || undefined,

    owner_id:
      property.ownerId ??
      property.owner_id,

    owner_name:
      property.ownerName ??
      property.owner_name ??
      "",

    agent_id:
      property.agentId ??
      property.agent_id ??
      null,

    agent_name:
      property.agentName ??
      property.agent_name ??
      null,

    title:
      property.title ??
      "",

    description:
      property.description ??
      "",

    property_type:
      property.propertyType ??
      property.property_type ??
      "APARTMENT",

    listing_type:
      property.listingType ??
      property.listing_type ??
      "SALE",

    price:
      Number(property.price ?? 0),

    location:
      property.location ??
      "",

    city:
      property.city ??
      "",

    state:
      property.state ??
      "",

    pincode:
      property.pincode ??
      null,

    bedrooms:
      Number(property.bedrooms ?? 0),

    bathrooms:
      Number(property.bathrooms ?? 0),

    area:
      Number(property.area ?? 0),

    amenities:
      Array.isArray(property.amenities)
        ? property.amenities
        : [],

    images:
      Array.isArray(property.images)
        ? property.images
        : [],

    documents:
      Array.isArray(property.documents)
        ? property.documents
        : [],

    availability:
      property.availability ??
      "AVAILABLE",

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

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item: any) => item?.msg)
        .filter(Boolean)
        .join(", ");
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export async function getProperties(): Promise<Property[]> {
  const response = await fetch(
    `${API_BASE_URL}/properties?skip=0&limit=100`,
    {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      `Failed to fetch properties: ${response.status}`
    );

    throw new Error(message);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data.map(normalizeProperty);
  }

  if (Array.isArray(data?.items)) {
    return data.items.map(normalizeProperty);
  }

  if (Array.isArray(data?.properties)) {
    return data.properties.map(normalizeProperty);
  }

  return [];
}

export async function saveProperties(
  properties: Property[]
): Promise<void> {
  const existingProperties =
    await getProperties();

  const existingIds = new Set(
    existingProperties.map(
      (property) => String(property.id)
    )
  );

  for (const property of properties) {
    if (
      !existingIds.has(
        String(property.id)
      )
    ) {
      await addProperty(property);
    }
  }

  dispatchPropertyUpdate();
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
    const message = await getErrorMessage(
      response,
      "Failed to add property."
    );

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
  const backendUpdates: Record<
    string,
    any
  > = {};

  const mapping: Record<
    string,
    string
  > = {
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
      const backendKey =
        mapping[key] ?? key;

      backendUpdates[backendKey] =
        value;
    }
  );

  if (
    backendUpdates.price !==
    undefined
  ) {
    backendUpdates.price = Number(
      backendUpdates.price
    );
  }

  if (
    backendUpdates.area !==
    undefined
  ) {
    backendUpdates.area = Number(
      backendUpdates.area
    );
  }

  if (
    backendUpdates.bedrooms !==
    undefined
  ) {
    backendUpdates.bedrooms = Number(
      backendUpdates.bedrooms
    );
  }

  if (
    backendUpdates.bathrooms !==
    undefined
  ) {
    backendUpdates.bathrooms = Number(
      backendUpdates.bathrooms
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/properties/${encodeURIComponent(
      propertyId
    )}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(
        backendUpdates
      ),
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      "Failed to update property."
    );

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
    const message = await getErrorMessage(
      response,
      "Failed to delete property."
    );

    throw new Error(message);
  }

  dispatchPropertyUpdate();
}

export async function getPropertyById(
  propertyId: string
): Promise<Property | null> {
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
    const message = await getErrorMessage(
      response,
      `Failed to fetch property: ${response.status}`
    );

    throw new Error(message);
  }

  const data = await response.json();

  return normalizeProperty(data);
}

export async function getPropertiesByOwner(
  ownerId: string
): Promise<Property[]> {
  const response = await fetch(
    `${API_BASE_URL}/properties/my-properties?skip=0&limit=100`,
    {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      `Failed to fetch owner properties: ${response.status}`
    );

    throw new Error(message);
  }

  const data = await response.json();

  let properties: Property[] = [];

  if (Array.isArray(data)) {
    properties =
      data.map(normalizeProperty);
  } else if (
    Array.isArray(data?.items)
  ) {
    properties =
      data.items.map(normalizeProperty);
  } else if (
    Array.isArray(data?.properties)
  ) {
    properties =
      data.properties.map(
        normalizeProperty
      );
  }

  return properties.filter(
    (property) =>
      String(property.ownerId) ===
      String(ownerId)
  );
}

export async function getActiveProperties(): Promise<Property[]> {
  const properties =
    await getProperties();

  return properties.filter(
    (property) => {
      const status = String(
        property.status ?? ""
      ).toUpperCase();

      const availability =
        String(
          property.availability ?? ""
        ).toUpperCase();

      return (
        status === "ACTIVE" ||
        status === "AVAILABLE" ||
        availability === "AVAILABLE"
      );
    }
  );
}

export async function getSoldProperties(): Promise<Property[]> {
  const properties =
    await getProperties();

  return properties.filter(
    (property) =>
      String(
        property.status ?? ""
      ).toUpperCase() === "SOLD"
  );
}

export async function getRentedProperties(): Promise<Property[]> {
  const properties =
    await getProperties();

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
  const properties =
    await getProperties();

  return properties.filter(
    (property) =>
      String(
        property.availability ?? ""
      ).toUpperCase() ===
        "AVAILABLE" &&
      (
        String(
          property.status ?? ""
        ).toUpperCase() ===
          "ACTIVE" ||
        String(
          property.status ?? ""
        ).toUpperCase() ===
          "AVAILABLE"
      )
  );
}

export async function getInactiveProperties(): Promise<Property[]> {
  const properties =
    await getProperties();

  return properties.filter(
    (property) =>
      String(
        property.status ?? ""
      ).toUpperCase() ===
      "INACTIVE"
  );
}

export async function getPropertyCount(): Promise<number> {
  const properties =
    await getProperties();

  return properties.length;
}

export async function getActivePropertyCount(): Promise<number> {
  const properties =
    await getActiveProperties();

  return properties.length;
}

export async function getSoldPropertyCount(): Promise<number> {
  const properties =
    await getSoldProperties();

  return properties.length;
}

export async function getRentedPropertyCount(): Promise<number> {
  const properties =
    await getRentedProperties();

  return properties.length;
}

export async function clearProperties(): Promise<void> {
  const properties =
    await getProperties();

  await Promise.all(
    properties.map((property) =>
      deleteProperty(
        String(property.id)
      )
    )
  );

  dispatchPropertyUpdate();
}
