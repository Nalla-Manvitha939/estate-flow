export interface Enquiry {
  id: string;
  propertyId: string | number;
  propertyTitle: string;

  ownerId: string | number;
  ownerName: string;

  customerId: string | number;
  customerName: string;
  customerEmail: string;

  message: string;

  status: "PENDING" | "RESPONDED" | "CLOSED";

  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "estateflow_enquiries";

export function getEnquiries(): Enquiry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveEnquiries(
  enquiries: Enquiry[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(enquiries)
  );

  window.dispatchEvent(
    new Event("estateflow-enquiries-updated")
  );
}

export function addEnquiry(
  enquiry: Enquiry
): Enquiry {
  const enquiries = getEnquiries();

  const exists = enquiries.some(
    (item) =>
      item.id === enquiry.id
  );

  if (exists) {
    return enquiry;
  }

  enquiries.unshift(enquiry);

  saveEnquiries(enquiries);

  return enquiry;
}

export function getEnquiryById(
  enquiryId: string
): Enquiry | null {
  return (
    getEnquiries().find(
      (enquiry) =>
        enquiry.id === enquiryId
    ) ?? null
  );
}

export function getOwnerEnquiries(
  ownerId: string | number
): Enquiry[] {
  return getEnquiries().filter(
    (enquiry) =>
      String(enquiry.ownerId) ===
      String(ownerId)
  );
}

export function getCustomerEnquiries(
  customerId: string | number
): Enquiry[] {
  return getEnquiries().filter(
    (enquiry) =>
      String(enquiry.customerId) ===
      String(customerId)
  );
}

export function getPendingOwnerEnquiries(
  ownerId: string | number
): Enquiry[] {
  return getOwnerEnquiries(ownerId).filter(
    (enquiry) =>
      enquiry.status === "PENDING"
  );
}

export function updateEnquiryStatus(
  enquiryId: string,
  status: Enquiry["status"]
): void {
  const enquiries = getEnquiries();

  const updated = enquiries.map(
    (enquiry) =>
      enquiry.id === enquiryId
        ? {
            ...enquiry,
            status,
            updatedAt:
              new Date().toISOString(),
          }
        : enquiry
  );

  saveEnquiries(updated);
}

export function deleteEnquiry(
  enquiryId: string
): void {
  const enquiries = getEnquiries();

  const updated = enquiries.filter(
    (enquiry) =>
      enquiry.id !== enquiryId
  );

  saveEnquiries(updated);
}

export function clearEnquiries(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(
    new Event("estateflow-enquiries-updated")
  );
}