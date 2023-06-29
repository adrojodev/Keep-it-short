import classNames from "classnames";

interface TextProps {
  variant?:
    | "title"
    | "subtitle"
    | "paragraph"
    | "small"
    | "date"
    | "decision"
    | "weather";
  className?: string;
  children: React.ReactNode;
}

const variants = {
  title: "text-[32px] font-bold",
  subtitle: "text-[18px]",
  paragraph: "text-lg",
  small: "text-sm",
  date: "text-sm font-bold text-gray-500 italic",
  decision: "text-[80px] md:text-[130px]",
  weather: "text-3xl md:text-5xl",
};

const Text = ({ variant = "paragraph", className, children }: TextProps) => {
  return (
    <p className={classNames("my-0", className, variants[variant])}>
      {children}
    </p>
  );
};

export default Text;
