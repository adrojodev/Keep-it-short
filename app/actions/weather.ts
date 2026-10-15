"use server";

interface GetWeatherParams {
  neighborhood: string;
}

export async function getWeather({ neighborhood }: GetWeatherParams) {
  const apiKey = process.env.WEATHER_API;
  if (!apiKey) {
    console.error("Weather API key is missing");
    throw new Error("Weather unavailable");
  }
  const params = new URLSearchParams({ key: apiKey, q: neighborhood, aqi: "no" });
  const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?${params}`);
  const data = await response.json();
  if (!response.ok || !data.forecast?.forecastday?.[0]?.day) {
    console.error("Weather request failed", { status: response.status, code: data.error?.code });
    throw new Error("Weather unavailable");
  }
  const maxTemp = data.forecast.forecastday[0].day.maxtemp_c;
  const minTemp = data.forecast.forecastday[0].day.mintemp_c;
  const avgTemp = data.forecast.forecastday[0].day.avgtemp_c;
  const maxWind = data.forecast.forecastday[0].day.maxwind_kph;
  const totalPrecip = data.forecast.forecastday[0].day.totalprecip_mm;
  const avgHumidity = data.forecast.forecastday[0].day.avghumidity;
  const condition = data.forecast.forecastday[0].day.condition.text;
  return {
    maxTemp,
    minTemp,
    avgTemp,
    maxWind,
    totalPrecip,
    avgHumidity,
    condition,
  };
}
