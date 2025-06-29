"use client";

import { CircleNotch } from "@phosphor-icons/react";
import classNames from "classnames";

import Button from "@/app/components/Button";
import countries from "@/app/lib/countries.json";
import { useLang, useShortsUses } from "@/app/hooks";

import { CONTENT } from "./translatables";

interface IdleParams {
  check(): Promise<void>;
  isLoading: boolean;
  city: string;
  country: string;
}

export const Idle = ({ check, isLoading, city, country }: IdleParams) => {
  const uses = useShortsUses();
  const lang = useLang();
  const countryInfo = countries.find((x) => x.cca2 === country);
  const flag = countryInfo?.flag;

  const content = CONTENT(lang);

  return (
    <div className="flex flex-col text-center items-center gap-6 text-neutral-950 dark:text-neutral-50">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="text-xl flex gap-2 items-center justify-center">
          <span>{flag}</span>
          <span>{city}</span>
        </div>
        <h1 className="text-3xl font-bold">
          {content.title}
          <br />
          {content.subtitle}
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        <Button disabled={isLoading} onClick={check}>
          {isLoading && (
            <CircleNotch className="animate-spin absolute inset-0 m-auto" />
          )}
          <span className={classNames(isLoading && "text-transparent")}>
            {content.button}
          </span>
        </Button>
        <span className="text-xs">
          {content.uses} {uses}
        </span>
      </div>
    </div>
  );
};
