import { addOneToUsage, addWearShorts, runUsage } from "../helpers";
import { getResponse } from "./ai";
import { getWeather } from "./weather";

interface GetShortsParams {
  city: string;
  country: string;
  time: string;
}

export async function getShorts({ city, country, time }: GetShortsParams) {
  if (!runUsage()) {
    throw new Error("No more usages");
  }

  try {
    const weather = await getWeather({ city });
    const response = await getResponse({ ...weather, city, country, time });

    addWearShorts(response.wearShorts);

    return response;
  } catch {
    addOneToUsage();
  }
}
