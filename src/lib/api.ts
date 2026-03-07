const KEY_BACKEND_UNAVAILABLE = "kyn_backend_unavailable";

/**
 * API base URL for backend calls. Empty = same origin (e.g. dev server).
 * Set VITE_API_URL in production only when you have a separate backend (e.g. Railway).
 */
export function getApiBase(): string {
  const url = typeof import.meta.env.VITE_API_URL === "string" ? import.meta.env.VITE_API_URL.trim() : "";
  return url ? url.replace(/\/$/, "") : "";
}

/**
 * True when we should call the backend.
 * In production, if API base is empty or the same origin (static host has no /api), treat as no backend.
 */
export function isBackendConfigured(): boolean {
  const base = getApiBase();
  if (base.length === 0) return import.meta.env.DEV === true;
  if (typeof window !== "undefined" && import.meta.env.PROD) {
    const origin = window.location.origin;
    if (base === origin || base.startsWith(origin + "/")) return false;
  }
  return true;
}

/** Mark backend as unavailable (e.g. after 404). Stops further API calls this session. */
export function setBackendUnavailable(): void {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY_BACKEND_UNAVAILABLE, "1");
}

/** True only when backend is configured and we haven't seen a 404/failure yet. */
export function isBackendAvailable(): boolean {
  if (!isBackendConfigured()) return false;
  if (typeof window !== "undefined" && sessionStorage.getItem(KEY_BACKEND_UNAVAILABLE) === "1") return false;
  return true;
}
