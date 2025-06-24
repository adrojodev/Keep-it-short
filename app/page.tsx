import { headers } from "next/headers";

export default async function Home() {
  const response = await fetch("http://localhost:3000/api/weather", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const { city } = await response.json();

  return <main>{city}</main>;
}
