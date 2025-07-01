"use server";

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GetResponseParams {
  country: string;
  city: string;
  maxTemp: number;
  minTemp: number;
  avgTemp: number;
  maxWind: number;
  totalPrecip: number;
  avgHumidity: number;
  condition: string;
}

type ShortsResponse = {
  wearShorts: boolean;
  error?: boolean;
};

export async function getResponse({
  country,
  city,
  maxTemp,
  minTemp,
  avgTemp,
  maxWind,
  totalPrecip,
  avgHumidity,
  condition,
}: GetResponseParams): Promise<ShortsResponse> {
  try {
    const response = await client.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: "developer",
          content: `It decides if should use pants based on an user that is on ${city} city on ${country} country with today's weather condition of:
      
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
    const generated = response.output_parsed;

    if (
      generated &&
      typeof generated === "object" &&
      "wearShorts" in generated
    ) {
      return {
        wearShorts: (generated as ShortsResponse).wearShorts,
        error: false,
      };
    }

    return { wearShorts: false, error: true };
  } catch (e) {
    return { wearShorts: false };
  }
}
