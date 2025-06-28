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
    const result = await client.completions.create({
      model: "gpt-4o-mini",
      prompt: `You are an API responder.

Based on the following weather data, answer the question: should I wear shorts?

Weather:
- Location: ${city}, ${country}
- Max Temp: ${maxTemp}°C
- Min Temp: ${minTemp}°C
- Avg Temp: ${avgTemp}°C
- Max Wind: ${maxWind} km/h
- Total Precipitation: ${totalPrecip} mm
- Avg Humidity: ${avgHumidity}%
- Condition: ${condition}

Respond with **only** this exact JSON format:

{"wearShorts": true}

Replace true with false if the answer is no. Do not add any extra text, no prefixes like “Yes” or “No”, and no formatting. The response must be valid JSON only.`,
      temperature: 0.4,
      max_tokens: 100,
      frequency_penalty: 0,
      top_p: 1,
      presence_penalty: 0,
    });
    const answer = JSON.parse(result.choices[0].text.trim());

    return answer as ShortsResponse;
  } catch (e) {
    console.error({ cacaError: e });
    return { wearShorts: false };
  }
}
