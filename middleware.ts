import { geolocation } from "@vercel/functions";
import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: "/",
};

export async function middleware(req: NextRequest) {
  const { nextUrl: url } = req;
  const geo = geolocation(req);
  const country = geo.country || "US";
  const city = geo.city || "San Francisco";

  url.searchParams.set("country", country);
  url.searchParams.set("city", city);

  return NextResponse.rewrite(url);
}
