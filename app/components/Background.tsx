import type { AsyncStatus } from "@react-hook/async";
import classNames from "classnames";

interface BackgroundProps {
  status: AsyncStatus;
  wearShorts: boolean;
  children: React.ReactElement;
}

export const Background = ({
  status,
  wearShorts,
  children,
}: BackgroundProps) => {
  return (
    <main className="w-full min-h-screen relative overflow-hidden">
      <div
        className={classNames(
          "absolute backdrop-blur-3xl w-full h-screen z-10 transition-colors duration-500",
          status === "idle" && "bg-neutral-50/10",
          status === "loading" && "bg-neutral-50/10",
          status === "error" && "bg-red-500/50",
          status === "success" && !wearShorts && "bg-blue-500/50",
          status === "success" && wearShorts && "bg-orange-500/50"
        )}
      />
      {children}
      <div className="w-full h-screen absolute inset-0 z-0 transition-all animate-slow-spin">
        <div
          className={classNames(
            "backdrop-opacity-50 w-11/12 aspect-square rounded-full absolute -top-5-left-5 transition-all duration-500",
            status === "idle" && "bg-orange-500",
            status === "loading" && "bg-orange-500",
            status === "error" && "bg-red-500",
            status === "success" && !wearShorts && "bg-blue-500",
            status === "success" && wearShorts && "bg-orange-500"
          )}
        />
        <div
          className={classNames(
            " backdrop-opacity-50 w-11/12 aspect-square rounded-full absolute -bottom-5 -right-5 animate-background-bottom-idle transition-all duration-500",
            status === "idle" && "bg-blue-500",
            status === "loading" && "bg-blue-500",
            status === "error" && "bg-red-500",
            status === "success" && !wearShorts && "bg-blue-500",
            status === "success" && wearShorts && "bg-orange-500"
          )}
        />
      </div>
    </main>
  );
};
