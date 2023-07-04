"use client";

import classNames from "classnames";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "regular" | "icon" | "social";
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const Button = ({
  onClick,
  children,
  disabled,
  variant = "regular",
  className,
  icon,
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        "flex rounded-full leading-none w-fit justify-center items-center transition-all text-base",
        icon && "gap-2",
        disabled
          ? "bg-buttonGray border-borderGray border-[3px] cursor-not-allowed"
          : " text-white cursor-pointer",
        variant === "icon"
          ? "bg-transparent border-none w-fit h-fit text-black"
          : variant === "social"
          ? "bg-black border-2 border-[#D1D8DB] text-white px-8 py-3 hover:scale-105"
          : "py-6 px-16 md:py-8 hover:scale-105 bg-buttonBlack",
        className
      )}
      onClick={onClick}
    >
      {children}
      {icon}
    </button>
  );
};

export default Button;
