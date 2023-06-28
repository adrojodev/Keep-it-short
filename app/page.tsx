"use client";

import React from "react";
import classNames from "classnames";

import Link from "next/link";

import Button from "./components/Button";
import Spacing from "./components/Spacing";
import Text from "./components/Text";
import PositionChip from "./components/PositionChip";

import { getLocation } from "./utils/location";
import { getWeather } from "./utils/weather";
import { getResponse } from "./utils/ai";
import { Answer } from "./components/Answer";

export default function Home() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [position, setPosition] = React.useState<string | undefined>(undefined);
  const [countryFlag, setCountryFlag] = React.useState<string | undefined>(
    undefined
  );
  const [weather, setWeather] = React.useState<any | undefined>(undefined);

  const [shorts, setShorts] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    getLocation().then((location: any) => {
      setPosition(location.position.city);
      setCountryFlag(location.countryFlag);
    });
  }, []);

  async function decide() {
    if (!position) return;

    setLoading(true);

    const weatherValue = await getWeather(position);

    setWeather(weatherValue);

    const response = await getResponse(
      position,
      weatherValue.temperature,
      weatherValue.wind,
      weatherValue.humidity,
      weatherValue.isDay,
      weatherValue.cloud,
      weatherValue.condition,
      weatherValue.precipitation,
      weatherValue.feelslike
    );

    setShorts(response);

    setLoading(false);
  }

  async function refreshLocation() {
    setPosition(undefined);
    getLocation().then((location: any) => {
      setPosition(location.position.city);
      setCountryFlag(location.countryFlag);
    });
  }

  return (
    <main
      className="flex min-h-screen flex-col items-stretch md:items-center justify-center p-4 md:p-24 gap-8 bg-black bg-50 md:bg-25 bg-repeat"
      style={{
        backgroundImage:
          shorts !== undefined
            ? shorts
              ? "url(/images/shortsBackground.png)"
              : "url(/images/pantsBackground.png)"
            : "url(/images/weatherBackground.png)",
      }}
    >
      <Spacing
        className={classNames(
          "bg-white px-6 md:px-0 flex flex-col justify-center items-center border-[3px] md:w-3/5 h-1/2 min-h-[50vh] rounded-5xl",
          position ? "gap-4" : "gap-8"
        )}
      >
        {loading ? (
          <Text variant="title">Loading...</Text>
        ) : (
          <>
            {shorts === undefined ? (
              <>
                <Spacing
                  stacked
                  className="justify-center items-center text-center"
                >
                  {position ? (
                    <Spacing stacked gap={8}>
                      <Spacing stacked>
                        <Text variant="subtitle" className="text-gray-600">
                          We use AI to decide
                        </Text>
                        <Text variant="title" className=" leading-none">
                          To short or not to short?
                        </Text>
                      </Spacing>
                      <PositionChip
                        position={position}
                        countryFlag={countryFlag}
                        action={refreshLocation}
                      />
                    </Spacing>
                  ) : (
                    <>
                      <Text variant="title">
                        {position || "Pending location..."}
                      </Text>
                      <Text variant="subtitle" className="text-gray-600">
                        Please allow your location access to continue.
                      </Text>
                    </>
                  )}
                </Spacing>
                {position && (
                  <Button onClick={() => decide()}>Long or short?</Button>
                )}
              </>
            ) : (
              <Spacing stacked gap={8}>
                <PositionChip
                  small
                  position={position}
                  countryFlag={countryFlag}
                  action={() => window.location.reload()}
                />
                <Answer
                  shorts={shorts}
                  temperature={weather.temperature}
                  humidity={weather.humidity}
                  wind={weather.wind}
                />
              </Spacing>
            )}
          </>
        )}
      </Spacing>
      <Spacing
        stacked
        className="absolute bottom-4 left-0 right-0 max-w-fit mx-auto text-center bg-black text-white px-8 py-4 rounded-2xl"
      >
        <Text variant="paragraph">
          Made with 💛 by{" "}
          <Link
            href="https://twitter.com/julesnewland"
            className="hover:underline"
          >
            Jules
          </Link>{" "}
          and{" "}
          <Link href="https://adrojo.art" className="hover:underline">
            Rojo
          </Link>
        </Text>
      </Spacing>
    </main>
  );
}
