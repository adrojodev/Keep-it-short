"use client";

import React from "react";
import { useAsync } from "@react-hook/async";

import { getShorts } from "./actions/shorts";

import { Background } from "./components/Background";

import { Idle } from "./views/Idle";
import { Success } from "./views/Success";
import { Error } from "./views/Error";

interface HomeParams {
  searchParams: {
    country: string;
    city: string;
  };
}

export default function Home({ searchParams: { country, city } }: HomeParams) {
  const [{ status, value }, check] = useAsync(async () => {
    return await getShorts({ city, country });
  });

  let children = (
    <Idle
      city={city}
      country={country}
      isLoading={status === "loading"}
      check={check}
    />
  );

  if (value?.error || status === "error") {
    children = <Error isLoading={status === "loading"} retry={check} />;
  }

  if (status === "success") {
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
