const STORAGE_KEY = "estateflow_favorites";

export interface Favorite {
  id: string;
  propertyId: string;
  customerId: string;
  createdAt: string;
}

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

export function getFavorites(): Favorite[] {
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

    return parsed
      .filter(
        (favorite) =>
          favorite &&
          favorite.propertyId &&
          favorite.customerId
      )
      .map((favorite) => ({
        id: normalizeId(favorite.id),
        propertyId: normalizeId(
          favorite.propertyId
        ),
        customerId: normalizeId(
          favorite.customerId
        ),
        createdAt:
          favorite.createdAt ||
          new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

export function saveFavorites(
  favorites: Favorite[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(favorites)
  );

  window.dispatchEvent(
    new Event("estateflow-favorites-updated")
  );
}

export function addFavorite(
  propertyId: string,
  customerId: string
) {
  const normalizedPropertyId =
    normalizeId(propertyId);

  const normalizedCustomerId =
    normalizeId(customerId);

  if (
    !normalizedPropertyId ||
    !normalizedCustomerId
  ) {
    return false;
  }

  const favorites = getFavorites();

  const exists = favorites.some(
    (favorite) =>
      normalizeId(favorite.propertyId) ===
        normalizedPropertyId &&
      normalizeId(favorite.customerId) ===
        normalizedCustomerId
  );

  if (exists) {
    return false;
  }

  const favorite: Favorite = {
    id: crypto.randomUUID(),
    propertyId: normalizedPropertyId,
    customerId: normalizedCustomerId,
    createdAt: new Date().toISOString(),
  };

  saveFavorites([
    favorite,
    ...favorites,
  ]);

  return true;
}

export function removeFavorite(
  propertyId: string,
  customerId: string
) {
  const normalizedPropertyId =
    normalizeId(propertyId);

  const normalizedCustomerId =
    normalizeId(customerId);

  const favorites = getFavorites();

  const updated = favorites.filter(
    (favorite) =>
      !(
        normalizeId(favorite.propertyId) ===
          normalizedPropertyId &&
        normalizeId(favorite.customerId) ===
          normalizedCustomerId
      )
  );

  saveFavorites(updated);

  return true;
}

export function isFavorite(
  propertyId: string,
  customerId: string
) {
  const normalizedPropertyId =
    normalizeId(propertyId);

  const normalizedCustomerId =
    normalizeId(customerId);

  if (
    !normalizedPropertyId ||
    !normalizedCustomerId
  ) {
    return false;
  }

  return getFavorites().some(
    (favorite) =>
      normalizeId(favorite.propertyId) ===
        normalizedPropertyId &&
      normalizeId(favorite.customerId) ===
        normalizedCustomerId
  );
}

export function toggleFavorite(
  propertyId: string,
  customerId: string
) {
  const normalizedPropertyId =
    normalizeId(propertyId);

  const normalizedCustomerId =
    normalizeId(customerId);

  if (
    !normalizedPropertyId ||
    !normalizedCustomerId
  ) {
    return false;
  }

  if (
    isFavorite(
      normalizedPropertyId,
      normalizedCustomerId
    )
  ) {
    removeFavorite(
      normalizedPropertyId,
      normalizedCustomerId
    );

    return false;
  }

  return addFavorite(
    normalizedPropertyId,
    normalizedCustomerId
  );
}

export function getCustomerFavorites(
  customerId: string
) {
  const normalizedCustomerId =
    normalizeId(customerId);

  if (!normalizedCustomerId) {
    return [];
  }

  return getFavorites().filter(
    (favorite) =>
      normalizeId(favorite.customerId) ===
      normalizedCustomerId
  );
}

export function getFavoritePropertyIds(
  customerId: string
): string[] {
  return getCustomerFavorites(
    customerId
  ).map(
    (favorite) => favorite.propertyId
  );
}

export function isPropertyFavorite(
  propertyId: string,
  customerId: string
): boolean {
  return isFavorite(
    propertyId,
    customerId
  );
}