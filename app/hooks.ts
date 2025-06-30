"use client";
import React from "react";

import { MAX_USES } from "./constants";

export function useShortsUses() {
  const [uses, setUses] = React.useState(() => {
    if (typeof window !== "undefined") {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const value = window.localStorage.getItem("shorts");

      if (!value) return MAX_USES;

      const date = JSON.parse(value).date;

      if (today.toISOString() !== date) return MAX_USES;

      return JSON.parse(value).uses;
    }

    return 3;
  });

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "shorts") {
        const value = window.localStorage.getItem("shorts");
        setUses(value ? JSON.parse(value).uses : MAX_USES);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
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
