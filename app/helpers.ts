import { v4 as uuidV4 } from "uuid";
import { MAX_USES } from "./constants";

interface ShortsData {
  date: string;
  userId: string;
  uses: number;
  wearShorts?: boolean;
}

function today() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

export function readShorts(): ShortsData | null {
  try {
    const value = window.localStorage.getItem("shorts");
    const data = value ? JSON.parse(value) : null;
    if (!data || data.date !== today() || typeof data.userId !== "string" ||
        !Number.isInteger(data.uses) || data.uses < 0 || data.uses > MAX_USES) return null;
    return { ...data, wearShorts: typeof data.wearShorts === "boolean" ? data.wearShorts : undefined };
  } catch {
    return null;
  }
}

function writeShorts(data: ShortsData) {
  window.localStorage.setItem("shorts", JSON.stringify(data));
  window.dispatchEvent(new Event("shorts-updated"));
}

export function runUsage() {
  const data = readShorts() ?? { date: today(), userId: uuidV4(), uses: MAX_USES };
  if (data.uses <= 0) return false;
  writeShorts({ ...data, uses: data.uses - 1 });
  return true;
}

export function addOneToUsage() {
  const data = readShorts();
  if (data) writeShorts({ ...data, uses: Math.min(MAX_USES, data.uses + 1) });
}

export function addWearShorts(wearShorts: boolean) {
  const data = readShorts();
  if (data) writeShorts({ ...data, wearShorts });
}
