"use client";

import React from "react";

import { useReward } from "react-rewards";

import { useLang, useLastDecision, useShortsUses } from "@/app/hooks";

import { CONTENT } from "./translatables";
import Button from "@/app/components/Button";

interface SuccessParams {
  retry(): void;
  wearShorts: boolean;
}

export const Success = ({ retry, wearShorts }: SuccessParams) => {
  const lang = useLang();
  const uses = useShortsUses();
  const lastDecision = useLastDecision();
  const content = CONTENT(lang);

  const shouldWear = uses <= 0 ? lastDecision : wearShorts;

  const { reward } = useReward("rewardId", "emoji", {
    emoji: shouldWear ? ["🩳"] : ["👖"],
  });

  React.useEffect(() => {
    reward();
  }, [shouldWear]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-center justify-center items-center">
        <span className="text-2xl" id="rewardId">
          {shouldWear ? "🩳" : "👖"}
        </span>
        <h2 className="text-3xl font-bold">
          {shouldWear ? content.shortsText : content.pantsText}
        </h2>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <Button disabled={uses <= 0} onClick={retry}>
          {content.buttonText}
        </Button>
        {uses <= 0 ? (
          <span className="text-xs">{content.noMoreUses}</span>
        ) : (
          <span className="text-xs">
            {content.uses} {uses}
          </span>
        )}
      </div>
    </div>
  );
};
