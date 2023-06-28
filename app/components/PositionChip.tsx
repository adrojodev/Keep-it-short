import { ArrowClockwise } from "@phosphor-icons/react";

import Spacing from "./Spacing";
import Text from "./Text";
import Button from "./Button";
import classNames from "classnames";

interface positionChipProps {
  small?: boolean;
  position?: string;
  countryFlag?: string;
  action?(): void;
}

const PositionChip = ({
  small = false,
  position,
  countryFlag,
  action,
}: positionChipProps) => {
  return (
    <Spacing stacked className="justify-center items-center text-center">
      {position ? (
        <Spacing
          className={classNames(
            "flex items-center justify-center bg-white border-[3px] border-borderGray rounded-full px-12",
            small ? "py-4" : "py-4 md:py-6"
          )}
        >
          <Text className="leading-none">{`${countryFlag || "🏳️"} ${
            position || "Locating"
          }`}</Text>
          {action && (
            <Button
              variant="icon"
              onClick={action}
              className="hover:rotate-[25deg] active:rotate-90"
            >
              <ArrowClockwise size={24} weight="fill" color="black" />
            </Button>
          )}
        </Spacing>
      ) : (
        <>
          <Text variant="title">{position || "Pending location..."}</Text>
          <Text variant="subtitle">
            Please allow your location access to continue.
          </Text>
        </>
      )}
    </Spacing>
  );
};

export default PositionChip;
