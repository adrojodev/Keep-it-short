"use client";

import React from "react";

import { useReward } from "react-rewards";

import { useLang, useShortsUses } from "@/app/hooks";

import { CONTENT } from "./translatables";
import Button from "@/app/components/Button";

interface SuccessParams {
  retry(): void;
  wearShorts: boolean;
}

export const Success = ({ retry, wearShorts }: SuccessParams) => {
  const lang = useLang();
  const uses = useShortsUses();
  const content = CONTENT(lang);

  const { reward } = useReward("rewardId", "emoji", {
    emoji: wearShorts ? ["🩳"] : ["👖"],
  });

  React.useEffect(() => {
    reward();
  }, [wearShorts]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-center justify-center items-center">
        <span className="text-2xl" id="rewardId">
          {wearShorts ? "🩳" : "👖"}
        </span>
        <h2 className="text-3xl font-bold">
          {wearShorts ? content.shortsText : content.pantsText}
        </h2>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <Button disabled={uses <= 0} onClick={retry}>
          {content.buttonText}
        </Button>
        <span className="text-xs">
          {content.uses} {uses}
        </span>
      </div>
    </div>
  );
};
