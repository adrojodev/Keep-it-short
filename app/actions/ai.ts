"use server";

import OpenAI from "openai";

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

export async function getResponse({
  country,
  neighborhood,
  maxTemp,
  minTemp,
  avgTemp,
  maxWind,
  totalPrecip,
  avgHumidity,
  condition,
  time,
}: GetResponseParams): Promise<ShortsResponse> {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: "developer",
          content: `Decide whether the user should wear shorts. Return wearShorts=true for shorts and false for pants. The user is in ${neighborhood}, ${country}, with today's weather:

      - Local Time: ${time}
      - Max temperature: ${maxTemp}
      - Min temperature: ${minTemp}
      - Average Temperature: ${avgTemp}
      - Max Wind: ${maxWind}
      - Total Precipitation: ${totalPrecip}
      - Average Humidity: ${avgHumidity}
      - Condition: ${condition}
      `,
        },
      ],
      text: {
        format: {
          name: "wearShorts",
          type: "json_schema",

          schema: {
            type: "object",
            properties: {
              wearShorts: {
                type: "boolean",
                description:
                  "The decision of using shorts or not in boolean value",
              },
            },
            additionalProperties: false,
            required: ["wearShorts"],
          },
        },
      },
      temperature: 0.4,
      top_p: 1,
    });
    const generated: unknown = response.output_parsed;

    if (
      generated &&
      typeof generated === "object" &&
      "wearShorts" in generated &&
      typeof generated.wearShorts === "boolean"
    ) {
      return {
        wearShorts: generated.wearShorts,
        error: false,
      };
    }

    console.error("AI returned no valid recommendation", { requestId: response._request_id });
    return { wearShorts: false, error: true };
  } catch (e) {
    console.error("AI recommendation failed", e instanceof OpenAI.APIError
      ? { status: e.status, code: e.code, type: e.type, requestId: e.requestID }
      : { name: e instanceof Error ? e.name : "UnknownError" });
    return { wearShorts: false, error: true };
  }
}
