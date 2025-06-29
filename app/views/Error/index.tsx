"use client";

import Button from "@/app/components/Button";
import { useLang } from "@/app/hooks";

import { CONTENT } from "./translatables";

interface ErrorProps {
  retry(): void;
  isLoading: boolean;
}

export const Error = ({ retry, isLoading }: ErrorProps) => {
  const lang = useLang();
  const content = CONTENT(lang);

  return (
    <div className="flex flex-col gap-4 justify-center items-center text-center">
      <span className="text-2xl">🩴</span>
      <h2 className="text-3xl font-bold">
        {content.title}
        <br />
        {content.subtitle}
      </h2>
      <Button onClick={retry} isLoading={isLoading}>
        {content.button}
      </Button>
    </div>
  );
};
