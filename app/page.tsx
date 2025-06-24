import { headers } from "next/headers";

export default async function Home() {
  const headerList = headers();
  const country = headerList.get("x-vercel-ip-country");
  const city = headerList.get("x-vercel-ip-city");
  const region = headerList.get("x-vercel-ip-country-region");

  console.log({ country, city, region });

  return <main>Hello</main>;
}
