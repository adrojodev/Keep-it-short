import React from "react";

import { MAX_USES } from "./constants";

export function useShortsUses() {
  const [uses, setUses] = React.useState(() => {
    const value = window.localStorage.getItem("shorts");
    if (!value) return MAX_USES;
    return JSON.parse(value).uses;
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
