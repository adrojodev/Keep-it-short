"use client";

import React from "react";
import classNames from "classnames";

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
      weatherValue.humidity
    );

    if (response === false) {
      setShorts(undefined);
      return;
    }

    if (response === "yes") {
      setShorts(true);
    } else {
      setShorts(false);
    }

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
          "bg-white flex flex-col justify-center items-center border-[3px] md:w-3/5 h-1/2 min-h-[50vh] rounded-5xl",
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
                        <Text variant="title">
                          Ask the AI if you should wear shorts today
                        </Text>
                        <Text variant="subtitle" className="bottom-0">
                          Created by Jules & Rojo with 💛
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
                      <Text variant="subtitle">
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
              <>
                <PositionChip
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
              </>
            )}
          </>
        )}
      </Spacing>
    </main>
  );
}
