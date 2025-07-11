"use client";

import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import { CircleNotch } from "@phosphor-icons/react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button = ({ isLoading, children, ...props }: ButtonProps) => {
  return (
    <button
      disabled={isLoading}
      {...props}
      className={classNames(
        "bg-neutral-100 border dark:bg-neutral-900 border-neutral-400 dark:border-neutral-600 px-4 py-2 text-neutral-950 dark:text-neutral-50 w-fit rounded-full relative flex justify-center items-center disabled:opacity-75 enabled:hover:bg-neutral-50 dark:enabled:hover:bg-neutral-950 enabled:hover:scale-105 transition-all",
        props.className
      )}
    >
      {isLoading && <CircleNotch className="animate-spin absolute" />}
      <span className={classNames(isLoading && "text-transparent")}>
        {children}
      </span>
    </button>
  );
};

export default Button;
