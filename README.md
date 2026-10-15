## Keep it short

An app that tells you if you should use shorts today based on your location.

## AI recommendations

Recommendations use TypeSafe AI's `typesafe-ai/jev` through Vercel AI Gateway's
[decision HTTP API](https://vercel.com/docs/ai-gateway/modalities/decision#http-api).
The request includes weather values with explicit units. A valid probability above
0.5 selects shorts; 0.5 or below selects pants. Invalid responses and failed
requests show the error screen and restore the usage attempt.

On Vercel, the server obtains a fresh OIDC token at request time using
`@vercel/oidc`. The Vercel team must have access to AI Gateway and available
Gateway credits. The app no longer uses `OPENAI_API_KEY`.

For local development, link the intended Vercel project and run `vercel env run --
npm run dev`, or set `AI_GATEWAY_API_KEY` in a gitignored `.env.local`. Never put
credentials in `NEXT_PUBLIC_` variables. `WEATHER_API` is still required for weather
forecasts.

Run `npm test` for regression tests and `npm run build` for production validation.
