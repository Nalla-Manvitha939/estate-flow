export type PropertyStatus = "ACTIVE" | "INACTIVE" | "SOLD";

export type PropertyType =
  | "APARTMENT"
  | "VILLA"
  | "HOUSE"
  | "PLOT"
  | "COMMERCIAL";

export type ListingType = "SALE" | "RENT";

export type PropertyAvailability =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "SOLD"
  | "RENTED";

export interface Property {
  id: string;

  ownerId: string;
  ownerName: string;

  title: string;
  description: string;

  propertyType: PropertyType;
  listingType: ListingType;

  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;

  location: string;
  city: string;
  state: string;
  address: string;
  pincode?: string;

  agentId?: string;
  agentName?: string;

  amenities: string[];

  imageUrl: string;
  images?: string[];
  documents?: string[];

  availability?: PropertyAvailability;
  listedDate?: string;

  status: PropertyStatus;

  createdAt: string;
  updatedAt: string;
}