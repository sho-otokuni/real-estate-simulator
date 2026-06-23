const STORAGE_KEY = 'reis_shared_property';

export interface SharedProperty {
  propertyPrice?: number;
  monthlyRentFull?: number;
}

export function saveSharedProperty(data: Partial<SharedProperty>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadSharedProperty();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
  } catch {
    // ignore localStorage errors
  }
}

export function loadSharedProperty(): SharedProperty {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SharedProperty;
  } catch {
    return {};
  }
}
