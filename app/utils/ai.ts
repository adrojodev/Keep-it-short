import { config } from "dotenv";

config();

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function getResponse(
  position: string,
  temperature: string,
  wind: string,
  humidity: string
) {
  try {
    const result = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Answer only with "yes" or "no" only. \n\nQ: Should I wear shorts cosidering I'm in ${position} and taking into account the following weather data, temperature: ${temperature}º, wind speed: ${wind}km/h, humidity: ${humidity}%?`,
      temperature: 0.5,
      max_tokens: 4000,
    });
    const answer = result.data.choices[0]
      .text!.replace(/[\W_]+/g, "")
      .toLowerCase();

    return answer;
  } catch (e) {
    return false;
  }
}
