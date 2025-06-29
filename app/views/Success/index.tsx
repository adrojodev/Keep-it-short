"use client";

import React from "react";
import { useReward } from "react-rewards";
import { CONTENT } from "./translatables";
import { getLang } from "@/app/helpers";

interface SuccessParams {
  wearShorts: boolean;
}

export const Success = ({ wearShorts }: SuccessParams) => {
  const lang = getLang();
  const content = CONTENT(lang);

  const { reward } = useReward("rewardId", "emoji", {
    emoji: wearShorts ? ["🩳"] : ["👖"],
  });

  React.useEffect(() => {
    reward();
  }, [wearShorts]);

  return (
    <div className="flex flex-col gap-2 text-center justify-center items-center">
      <span className="text-2xl" id="rewardId">
        {wearShorts ? "🩳" : "👖"}
      </span>
      <h2 className="text-3xl font-bold">
        {wearShorts ? content.shortsText : content.pantsText}
      </h2>
    </div>
  );
};
