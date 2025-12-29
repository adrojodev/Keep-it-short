"use client";

import React from "react";
import { useAsync } from "@react-hook/async";

import { getShorts } from "./actions/shorts";

import { Background } from "./components/Background";

import { Idle } from "./views/Idle";
import { Success } from "./views/Success";
import { Error } from "./views/Error";
import { useShortsUses, useGeolocation } from "./hooks";

export default function Home() {
  const uses = useShortsUses();
  const { location, error: geoError, loading: geoLoading } = useGeolocation();

  const [{ status, value }, check] = useAsync(async () => {
    if (!location) return null;
    const now = new Date();
    const time = now.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    return await getShorts({
      neighborhood: location.neighborhood,
      country: location.country,
      time
    });
  });

  // Wait for geolocation to load
  if (geoLoading) {
    return (
      <Background wearShorts={false} status="idle">
        <div className="flex justify-center items-center min-h-[100dvh] text-neutral-950 dark:text-neutral-50 relative z-20">
          <Idle
            neighborhood="..."
            country="..."
            isLoading={true}
            check={async () => {}}
          />
        </div>
      </Background>
    );
  }

  // Show error if geolocation failed
  if (geoError || !location) {
    return (
      <Background wearShorts={false} status="error">
        <div className="flex justify-center items-center min-h-[100dvh] text-neutral-950 dark:text-neutral-50 relative z-20">
          <Error isLoading={false} retry={() => window.location.reload()} />
        </div>
      </Background>
    );
  }

  let children = (
    <Idle
      neighborhood={location.neighborhood}
      country={location.country}
      isLoading={status === "loading"}
      check={check}
    />
  );

  if (value?.error || status === "error") {
    children = <Error isLoading={status === "loading"} retry={check} />;
  }

  if (status === "success" || uses === 0) {
    children = <Success retry={check} wearShorts={!!value?.wearShorts} />;
  }

  return (
    <Background wearShorts={!!value?.wearShorts} status={status}>
      <div className="flex justify-center items-center min-h-[100dvh] text-neutral-950 dark:text-neutral-50 relative z-20">
        {children}
      </div>
    </Background>
  );
}
