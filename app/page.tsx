"use client";

import React from "react";

import Button from "./components/Button";
import Spacing from "./components/Spacing";
import Text from "./components/Text";

import { getLocation } from "./utils/location";
import { getWeather } from "./utils/weather";
import { Answer } from "./components/Answer";

export default function Home() {
  const [position, setPosition] = React.useState<string | undefined>(
    "Loading..."
  );
  const [shorts, setShorts] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    getLocation().then((location: any) => {
      setPosition(location.position.city);
    });
  }, []);

  async function decide() {
    if (!position) return;

    const { temperature, humidity, wind } = await getWeather(position);

    if (temperature > 20 && humidity < 50 && wind < 10) {
      setShorts(true);
    } else {
      setShorts(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      {shorts === undefined && (
        <>
          <Spacing stacked className="justify-center items-center text-center">
            <Text variant="date">{position || "Loading..."}</Text>
            <Text variant="title">Keep it short! 🩳</Text>
          </Spacing>
          <Button onClick={() => decide()}>What should I do?</Button>
        </>
      )}
      {shorts !== undefined && <Answer shorts={shorts} />}
    </main>
  );
}
