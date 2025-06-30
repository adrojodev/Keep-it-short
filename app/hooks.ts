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
    const lastDecision = parsed.lastDecision;
    const userId = parsed.userId;
    const uses = parsed.uses;

    if (date !== today.toISOString()) {
      window.localStorage.setItem(
        "shorts",
        `${{ date, userId, lastDecision, uses }}`
      );

      return MAX_USES;
    }

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
