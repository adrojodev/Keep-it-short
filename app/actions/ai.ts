"use server";

import { getVercelOidcToken } from "@vercel/oidc";

interface GetResponseParams {
  country: string;
  neighborhood: string;
  maxTemp: number;
  minTemp: number;
  avgTemp: number;
  maxWind: number;
  totalPrecip: number;
  avgHumidity: number;
  condition: string;
  time: string;
}

type ShortsResponse = {
  wearShorts: boolean;
  error?: boolean;
};

export async function getResponse(state: GetResponseParams): Promise<ShortsResponse> {
  try {
    const token = process.env.AI_GATEWAY_API_KEY || await getVercelOidcToken();
    const response = await fetch("https://ai-gateway.vercel.sh/v1/evaluate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        model: "typesafe-ai/jev",
        state: {
          ...state,
          units: { temperature: "Celsius", wind: "km/h", precipitation: "mm", humidity: "percent" },
        },
        questions: {
          wearShorts: {
            type: "boolean",
            instructions: "Should a person wear shorts rather than long pants for typical outdoor activity in these weather conditions? Consider temperature, wind, rain, humidity, and local time.",
            criteria: {
              true: "Shorts are a comfortable choice for these weather conditions.",
              false: "Long pants are more comfortable because it is cold, windy, or wet.",
            },
          },
        },
      }),
    });
    const requestId = response.headers.get("x-request-id") ?? response.headers.get("x-vercel-id");
    if (!response.ok) {
      const failure = await response.json().catch(() => null);
      console.error("AI Gateway recommendation failed", {
        status: response.status,
        code: failure?.error?.code,
        type: failure?.error?.type,
        message: typeof failure?.error?.message === "string"
          ? failure.error.message.split(token).join("[redacted]").slice(0, 1000)
          : undefined,
        requestId,
      });
      return { wearShorts: false, error: true };
    }

    const data = await response.json();
    const answer = data?.answers?.wearShorts;
    if (answer?.type !== "boolean" || typeof answer.probability !== "number" ||
        !Number.isFinite(answer.probability) || answer.probability < 0 || answer.probability > 1) {
      console.error("AI Gateway returned no valid recommendation", { requestId });
      return { wearShorts: false, error: true };
    }

    return { wearShorts: answer.probability > 0.5, error: false };
  } catch (error) {
    console.error("AI Gateway request failed", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return { wearShorts: false, error: true };
  }
}
