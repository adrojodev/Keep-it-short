import Spacing from "./Spacing";
import Text from "./Text";

interface AnswerProps {
  shorts: boolean | undefined;
}

export const Answer = ({ shorts }: AnswerProps) => {
  return (
    <Spacing stacked className="justify-center items-center text-center">
      <Spacing stacked>
        <Text variant="paragraph">{shorts ? "Wear it!" : "Not today"}</Text>
        <Text variant="title">{shorts ? "🩳" : "👖"}</Text>
        <Text variant="paragraph">
          {shorts ? "With honor and without sweat" : "You'll look like a creep"}
        </Text>
      </Spacing>
    </Spacing>
  );
};
