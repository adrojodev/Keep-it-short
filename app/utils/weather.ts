import { config } from "dotenv";

config();

export async function getWeather(position: string) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${
      process.env.WEATHER_API
    }&q=${position?.replace(" ", "%20")}&aqi=no)}`
  );
  const data = await response.json();

  const temp = data.current.feelslike_c;
  const humidity = data.current.humidity;
  const wind = data.current.wind_kph;

  return { temperature: temp, humidity: humidity, wind: wind };
}
