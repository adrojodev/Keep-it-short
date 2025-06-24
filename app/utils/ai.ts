import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function getResponse(
  position: string,
  maxTemp: number,
  minTemp: number,
  avgTemp: number,
  maxWind: number,
  totalPrecip: number,
  avgHumidity: number,
  condition: string
) {
  try {
    const result = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Answer only with "yes" or "no". Should I wear shorts cosidering I'm in ${position} right now, and the forecast for today is: maximum temperature ${maxTemp} celsius, minimum is ${minTemp} celsius, the average temperature is ${avgTemp} celsius, the max wind is ${maxWind}km/h, the total precipitation is ${totalPrecip}mm, the average humidity is ${avgHumidity} and the condition is ${condition}?`,
      temperature: 0.5,
      max_tokens: 4000,
    });
    const answer = result.data.choices[0]
      .text!.replace(/[\W_]+/g, "")
      .toLowerCase();

    return answer === "yes";
  } catch (e) {
    return false;
  }
}
