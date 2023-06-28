import { config } from "dotenv";

config();

export async function getWeather(position: string) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${
      process.env.WEATHER_API
    }&q=${position?.replace(" ", "%20")}&aqi=no)}`
  );
  const data = await response.json();

  const feelslike = data.current.feelslike_c;
  const humidity = data.current.humidity;
  const wind = data.current.wind_kph;
  const condition = data.current.condition.text;
  const precipitation = data.current.precip_mm;
  const temp = data.current.temp_c;
  const isDay = data.current.is_day;
  const cloud = data.current.cloud;

  return {
    temperature: temp,
    humidity: humidity,
    wind: wind,
    isDay: isDay,
    cloud: cloud,
    condition: condition,
    precipitation: precipitation,
    feelslike: feelslike,
  };
}
