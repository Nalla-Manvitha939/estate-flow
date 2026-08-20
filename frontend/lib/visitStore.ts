export type SiteVisitStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface SiteVisit {
  id: string;

  propertyId: string;
  propertyTitle: string;

  ownerId: string;
  ownerName: string;

  customerId: string;
  customerName: string;
  customerEmail: string;

  visitDate: string;
  visitTime: string;

  message: string;

  status: SiteVisitStatus;

  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "estateflow_site_visits";

export function getSiteVisits(): SiteVisit[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(
      STORAGE_KEY
    );

    if (!stored) {
      return [];
    }

    const visits = JSON.parse(stored);

    if (!Array.isArray(visits)) {
      return [];
    }

    return visits;
  } catch {
    return [];
  }
}

export function saveSiteVisits(
  visits: SiteVisit[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(visits)
  );

  window.dispatchEvent(
    new Event("estateflow-visits-updated")
  );
}

export function addSiteVisit(
  visit: SiteVisit
) {
  const visits = getSiteVisits();

  visits.unshift(visit);

  saveSiteVisits(visits);

  return visit;
}

export function updateSiteVisit(
  visitId: string,
  updates: Partial<SiteVisit>
) {
  const visits = getSiteVisits();

  const updatedVisits = visits.map(
    (visit) =>
      visit.id === visitId
        ? {
            ...visit,
            ...updates,
            updatedAt:
              new Date().toISOString(),
          }
        : visit
  );

  saveSiteVisits(updatedVisits);

  return updatedVisits.find(
    (visit) => visit.id === visitId
  );
}

export function deleteSiteVisit(
  visitId: string
) {
  const visits = getSiteVisits();

  const updatedVisits = visits.filter(
    (visit) => visit.id !== visitId
  );

  saveSiteVisits(updatedVisits);
}

export function getSiteVisitById(
  visitId: string
): SiteVisit | null {
  const visits = getSiteVisits();

  return (
    visits.find(
      (visit) => visit.id === visitId
    ) ?? null
  );
}

export function getVisitsByCustomer(
  customerId: string
): SiteVisit[] {
  return getSiteVisits().filter(
    (visit) =>
      visit.customerId === customerId
  );
}

export function getVisitsByOwner(
  ownerId: string
): SiteVisit[] {
  return getSiteVisits().filter(
    (visit) => visit.ownerId === ownerId
  );
}

export function getVisitsByProperty(
  propertyId: string
): SiteVisit[] {
  return getSiteVisits().filter(
    (visit) =>
      visit.propertyId === propertyId
  );
}