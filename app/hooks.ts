"use client";
import React from "react";

import { MAX_USES } from "./constants";

export function useShortsUses() {
  const uses = React.useMemo(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const value = window.localStorage.getItem("shorts");

    if (!value) return MAX_USES;

    const parsed = JSON.parse(value);
    const date = parsed.date;

    if (date !== today.toISOString()) return MAX_USES;

    return parsed.uses;
  }, []);

  return uses;
}

export function useLang() {
  return React.useMemo(() => {
    const lang = navigator.language;

    if (lang.startsWith("es")) return "es";

    return "en";
  }, [navigator.language]);
}

export function useLastDecision() {
  const [lastDecision, setLastDecision] = React.useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;

    const value = window.localStorage.getItem("shorts");

    if (!value) return;

    return value ? JSON.parse(value).wearShorts : null;
  });

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "wearShorts") {
        const value = window.localStorage.getItem("wearShorts");
        setLastDecision(value ? JSON.parse(value) : null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return lastDecision;
}

interface LocationData {
  city: string;
  country: string;
}

export function useGeolocation() {
  const [location, setLocation] = React.useState<LocationData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                "User-Agent": "KeepItShort/1.0",
              },
            }
          );

          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.county || "Unknown";
          const country = data.address.country_code?.toUpperCase() || "US";

          setLocation({ city, country });
          setLoading(false);
        } catch (err) {
          setError("Failed to get location information");
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  return { location, error, loading };
}
