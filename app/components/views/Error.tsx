"use client";

import Button from "@/app/components/Button";

interface ErrorProps {
  retry(): void;
  isLoading: boolean;
}

export const Error = ({ retry, isLoading }: ErrorProps) => {
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
