import Spacing from "./Spacing";
import Text from "./Text";
import Divider from "./Divider";

interface AnswerProps {
  shorts?: boolean;
  temperature?: number;
  humidity?: number;
  wind?: number;
}

export const Answer = ({
  shorts,
  temperature,
  humidity,
  wind,
}: AnswerProps) => {
  return (
    <Spacing stacked className="justify-center items-center text-center">
      <Spacing stacked gap={4}>
        <Spacing stacked gap={0}>
          <Text className="leading-none">You should wear</Text>
          <Text className="leading-none" variant="decision">
            {shorts ? "Shorts" : "Pants"}
          </Text>
        </Spacing>
        <Spacing className="justify-between md:items-stretch gap-4 md:gap-6">
          <Spacing stacked className="items-center">
            <Text className="flex leading-none" variant="weather">
              {`${temperature ? Math.round(temperature) : 0}`}
              <span className="font-light text-2xl">º</span>
            </Text>
            <Text className="text-sm text-zinc-600">Temperature</Text>
          </Spacing>
          <Divider vertical />
          <Spacing stacked className="items-center">
            <Text className="flex leading-none" variant="weather">
              {`${humidity ? Math.round(humidity) : 0}`}
              <span className="text-base">%</span>
            </Text>
            <Text className="text-sm text-zinc-600">Humidity</Text>
          </Spacing>
          <Divider vertical />
          <Spacing stacked className="items-center">
            <Text className="flex leading-none" variant="weather">
              {`${wind ? Math.round(wind) : 0}`}
              <span className="text-base">km/h</span>
            </Text>
            <Text className="text-sm text-zinc-600">Wind Speed</Text>
          </Spacing>
        </Spacing>
      </Spacing>
    </Spacing>
  );
};
