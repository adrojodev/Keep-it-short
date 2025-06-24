import { geolocation } from "@vercel/functions";

export async function GET(request: Request) {
  const { city } = geolocation(request);

  return new Response(`<h1>Your location is ${city}</h1>`, {
    headers: { "content-type": "text/html" },
  });
}
