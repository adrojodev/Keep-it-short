import { geolocation } from "@vercel/functions";

export async function GET(request: Request) {
  const { city } = geolocation(request);

  return Response.json({ city });
}
