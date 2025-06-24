import { getWeather } from "./utils/weather";

export default async function Home() {
  const caca = await getWeather();

  console.log({ caca });
  return <main>Hello</main>;
}
