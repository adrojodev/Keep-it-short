import classNames from "classnames";

interface DividerProps {
  vertical?: boolean;
}

const Divider = ({ vertical = false }: DividerProps) => {
  return (
    <div
      className={classNames(
        "border-borderGray",
        vertical ? "border-l-2" : "w-full border-t-2"
      )}
    ></div>
  );
};

export default Divider;
