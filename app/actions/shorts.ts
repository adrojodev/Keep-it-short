import { getResponse } from "./ai";
import { getWeather } from "./weather";

interface GetShortsParams {
  city: string;
  country: string;
}

export async function getShorts({ city, country }: GetShortsParams) {
  const weather = await getWeather({ city });

  return await getResponse({ ...weather, city, country });
}
