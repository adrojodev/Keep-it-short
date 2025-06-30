import type { AsyncStatus } from "@react-hook/async";
import classNames from "classnames";
import { useLastDecision, useShortsUses } from "../hooks";

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
  const uses = useShortsUses();
  const lastDecision = useLastDecision();

  const shouldWearShorts = uses <= 0 ? lastDecision : wearShorts;

  return (
    <main className="w-full min-h-screen relative overflow-hidden">
      <div
        className={classNames(
          "absolute backdrop-blur-3xl w-full h-screen z-10 transition-colors duration-500",
          status === "idle" && uses > 0 && "bg-neutral-50/10",
          status === "loading" && "bg-neutral-50/10",
          status === "error" && "bg-red-500/50",
          status === "success" && !shouldWearShorts && "bg-blue-500/50",
          status === "success" && shouldWearShorts && "bg-orange-500/50",
          status === "idle" && !shouldWearShorts && "bg-blue-500/50",
          status === "idle" && shouldWearShorts && "bg-orange-500/50"
        )}
      />
      {children}
      <div className="w-full h-screen absolute inset-0 z-0 transition-all animate-slow-spin">
        <div
          className={classNames(
            "backdrop-opacity-50 w-11/12 md:w-10/12 aspect-square rounded-full absolute -top-5 md:top-1/3 -left-5 md:-left-10 transition-all duration-500 animate-reduce mix-blend-difference md:animate-reduce-mobile",
            status === "idle" && uses > 0 && "bg-orange-500",
            status === "idle" && !shouldWearShorts && "bg-blue-500",
            status === "idle" && shouldWearShorts && "bg-orange-500",
            status === "loading" && "bg-orange-500",
            status === "error" && "bg-red-500",
            status === "success" && !shouldWearShorts && "bg-blue-500",
            status === "success" && shouldWearShorts && "bg-orange-500"
          )}
        />
        <div
          className={classNames(
            " backdrop-opacity-50 w-11/12 md:w-10/12 aspect-square rounded-full absolute -bottom-5 md:bottom-1/3 -right-5 md:-right-20 transition-all duration-500 animate-reduce mix-blend-difference md:animate-reduce-mobile",
            status === "idle" && uses > 0 && "bg-blue-500",
            status === "idle" && !shouldWearShorts && "bg-blue-500",
            status === "idle" && shouldWearShorts && "bg-orange-500",
            status === "loading" && "bg-blue-500",
            status === "error" && "bg-red-500",
            status === "success" && !shouldWearShorts && "bg-blue-500",
            status === "success" && shouldWearShorts && "bg-orange-500"
          )}
        />
      </div>
    </main>
  );
};
