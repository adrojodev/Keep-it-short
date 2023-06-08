import classNames from "classnames";

interface SpacingProps {
  children: React.ReactNode;
  stacked?: boolean;
  className?: string;
  gap?: Gap;
}

type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 10;

const gaps = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  9: "gap-9",
  10: "gap-10",
};

const Spacing = ({
  children,
  stacked = false,
  gap = 2,
  className,
}: SpacingProps) => {
  return (
    <div
      className={classNames(
        "flex",
        stacked ? "flex-col" : "flex-row",
        gaps[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Spacing;
