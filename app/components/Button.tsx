"use client";

import classNames from "classnames";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "regular" | "icon";
  disabled?: boolean;
  className?: string;
}

const Button = ({
  onClick,
  children,
  disabled,
  variant = "regular",
  className,
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        className,
        "rounded-full leading-none justify-center items-center transition-all",
        disabled
          ? "bg-buttonGray border-borderGray border-[3px] cursor-not-allowed"
          : "bg-buttonBlack text-white cursor-pointer",
        variant === "icon"
          ? "bg-transparent border-none w-fit h-fit text-black"
          : "px-[54px] py-4 hover:scale-105 "
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
