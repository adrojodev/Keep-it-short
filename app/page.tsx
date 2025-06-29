"use client";

import { useAsync } from "@react-hook/async";
import { useReward } from "react-rewards";

import { getShorts } from "./utils/shorts";
import countries from "@/app/lib/countries.json";
import { CircleNotch } from "@phosphor-icons/react";
import classNames from "classnames";
import Button from "./components/Button";
import { Background } from "./components/Background";
import React from "react";

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
    children = <Success response={!!value?.wearShorts} />;
  }

  return (
    <Background wearShorts={!!value?.wearShorts} status={status}>
      <div className="flex justify-center items-center min-h-[100dvh] text-neutral-950 dark:text-neutral-50 relative z-20">
        {children}
      </div>
    </Background>
  );
}

interface IdleParams {
  check(): Promise<void>;
  isLoading: boolean;
  city: string;
  country: string;
}

const Idle = ({ check, isLoading, city, country }: IdleParams) => {
  const countryInfo = countries.find((x) => x.cca2 === country);
  const flag = countryInfo?.flag;

  return (
    <div className="flex flex-col text-center items-center gap-6 text-neutral-950 dark:text-neutral-50">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="text-xl flex gap-2 items-center justify-center">
          <span>{flag}</span>
          <span>{city}</span>
        </div>
        <h1 className="text-3xl font-bold">
          To short 🩳?
          <br />
          Or not to short 👖?
        </h1>
      </div>
      <Button disabled={isLoading} onClick={check}>
        {isLoading && (
          <CircleNotch className="animate-spin absolute inset-0 m-auto" />
        )}
        <span className={classNames(isLoading && "text-transparent")}>
          Find it out!
        </span>
      </Button>
    </div>
  );
};

interface SuccessParams {
  response: boolean;
}

const Success = ({ response }: SuccessParams) => {
  const shortsText = "Today is a shorts day!";
  const pantsText = "Well, at least we have pants.";

  const { reward } = useReward("rewardId", "emoji", {
    emoji: response ? ["🩳"] : ["👖"],
  });

  React.useEffect(() => {
    reward();
  }, [response]);

  return (
    <div className="flex flex-col gap-2 text-center justify-center items-center">
      <span className="text-2xl" id="rewardId">
        {response ? "🩳" : "👖"}
      </span>
      <h2 className="text-3xl font-bold">
        {response ? shortsText : pantsText}
      </h2>
    </div>
  );
};

interface ErrorProps {
  retry(): void;
  isLoading: boolean;
}

const Error = ({ retry, isLoading }: ErrorProps) => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center text-center">
      <span className="text-2xl">🩴</span>
      <h2 className="text-3xl font-bold">
        This is not normal...
        <br />
        Something went wrong
      </h2>
      <Button onClick={retry} isLoading={isLoading}>
        Try again
      </Button>
    </div>
  );
};
