import { addOneToUsage, runUsage } from "../helpers";
import { getResponse } from "./ai";
import { getWeather } from "./weather";

interface GetShortsParams {
  city: string;
  country: string;
}

export async function getShorts({ city, country }: GetShortsParams) {
  if (!runUsage()) {
    throw new Error("No more usages");
  }

  try {
    const weather = await getWeather({ city });
    const response = await getResponse({ ...weather, city, country });

    return response;
  } catch {
    addOneToUsage();
  }
}
