export async function getWeather(position: string) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=35821ad4033648b6aba05033230906&q=${position?.replace(
      " ",
      "%20"
    )}&aqi=no)}`
  );
  const data = await response.json();

  const temp = data.current.feelslike_c;
  const humidity = data.current.humidity;
  const wind = data.current.wind_kph;

  console.log(temp, humidity, wind);

  return { temperature: temp, humidity: humidity, wind: wind };
}
