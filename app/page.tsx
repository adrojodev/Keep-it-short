"use client";

import React from "react";

import Button from "./components/Button";
import Spacing from "./components/Spacing";
import Text from "./components/Text";

import { getLocation } from "./utils/location";

export default function Home() {
  const [position, setPosition] = React.useState<string | undefined>(
    "Loading..."
  );

  React.useEffect(() => {
    getLocation()
      .then((location: any) => {
        setPosition(location);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <Spacing stacked className="justify-center items-center text-center">
        <Text variant="date">{position || "Loading..."}</Text>
        <Text variant="title">Keep it short! 🩳</Text>
      </Spacing>
      <Button onClick={() => console.log("hello")}>What should I do?</Button>
    </main>
  );
}
