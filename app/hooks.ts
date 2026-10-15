"use client";
import React from "react";

import { readShorts } from "./helpers";

import { MAX_USES } from "./constants";

function useStoredShorts() {
  const [stored, setStored] = React.useState<ReturnType<typeof readShorts>>(null);

  React.useEffect(() => {
    const update = () => setStored(readShorts());
    const onStorage = (event: StorageEvent) => {
      if (event.key === "shorts" || event.key === null) update();
    };
    update();
    window.addEventListener("storage", onStorage);
    window.addEventListener("shorts-updated", update);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("shorts-updated", update);
    };
  }, []);

  return stored;
}

export function useShortsUses() {
  return useStoredShorts()?.uses ?? MAX_USES;
}

export function useLang() {
  const [lang, setLang] = React.useState<"en" | "es">("en");
  React.useEffect(() => {
    const update = () => setLang(navigator.language.startsWith("es") ? "es" : "en");
    update();
    window.addEventListener("languagechange", update);
    return () => window.removeEventListener("languagechange", update);
  }, []);
  return lang;
}

export function useLastDecision() {
  return useStoredShorts()?.wearShorts ?? null;
}

interface LocationData {
  neighborhood: string;
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
          const neighborhood = data.address.neighbourhood || data.address.suburb || data.address.quarter || data.address.city_district || data.address.city || data.address.town || data.address.village || "Unknown";
          const country = data.address.country_code?.toUpperCase() || "US";

          setLocation({ neighborhood, country });
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
