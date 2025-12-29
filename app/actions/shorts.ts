import { addOneToUsage, addWearShorts, runUsage } from "../helpers";
import { getResponse } from "./ai";
import { getWeather } from "./weather";

interface GetShortsParams {
  neighborhood: string;
  country: string;
  time: string;
}

export async function getShorts({ neighborhood, country, time }: GetShortsParams) {
  if (!runUsage()) {
    throw new Error("No more usages");
  }

  try {
    const weather = await getWeather({ neighborhood });
    const response = await getResponse({ ...weather, neighborhood, country, time });

    addWearShorts(response.wearShorts);

    return response;
  } catch {
    addOneToUsage();
  }
}
