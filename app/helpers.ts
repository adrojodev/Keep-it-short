import { v4 as uuidV4 } from "uuid";

import { MAX_USES } from "./constants";

export function runUsage() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const value = window.localStorage.getItem("shorts");
  let usageData;

  if (!value) {
    usageData = {
      date: today.toISOString(),
      userId: uuidV4(),
      uses: MAX_USES - 1,
    };
    window.localStorage.setItem("shorts", JSON.stringify(usageData));
    return true;
  } else {
    usageData = JSON.parse(value);

    const storedDate = new Date(usageData.date);
    storedDate.setUTCHours(0, 0, 0, 0);

    if (storedDate.getTime() !== today.getTime()) {
      usageData.date = today.toISOString();
      usageData.uses = MAX_USES - 1;
      window.localStorage.setItem("shorts", JSON.stringify(usageData));
      return true;
    } else {
      if (usageData.uses > 0) {
        usageData.uses -= 1;
        window.localStorage.setItem("shorts", JSON.stringify(usageData));
        return true;
      } else {
        return false;
      }
    }
  }
}

export function addOneToUsage() {
  const value = window.localStorage.getItem("shorts");

  if (!value) return;

  const values = JSON.parse(value);
  const date = values.date;
  const userId = values.userId;
  let uses = values.uses;

  window.localStorage.setItem(
    "shorts",
    JSON.stringify({ date, userId, uses: uses++ })
  );
}
