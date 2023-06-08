import classNames from "classnames";

interface TextProps {
  variant?: "title" | "subtitle" | "paragraph" | "date";
  className?: string;
  children: React.ReactNode;
}

const variants = {
  title: "text-4xl font-bold",
  subtitle: "text-2xl font-semibold",
  paragraph: "text-lg",
  date: "text-sm font-bold text-gray-500 italic",
};

const Text = ({ variant = "paragraph", className, children }: TextProps) => {
  return (
    <p className={classNames("my-0", className, variants[variant])}>
      {children}
    </p>
  );
};

export default Text;
