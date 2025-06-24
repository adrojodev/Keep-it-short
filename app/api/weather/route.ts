import { geolocation } from "@vercel/functions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { city = "CDMX" } = geolocation(request);

  return NextResponse.json({ city });
}
