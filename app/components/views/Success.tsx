"use client";

import React from "react";
import { useReward } from "react-rewards";

interface SuccessParams {
  response: boolean;
}

export const Success = ({ response }: SuccessParams) => {
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
