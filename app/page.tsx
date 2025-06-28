"use client";

import { useAsync } from "@react-hook/async";

import { getShorts } from "./utils/shorts";

interface HomeParams {
  searchParams: {
    country: string;
    city: string;
  };
}

export default function Home({ searchParams: { country, city } }: HomeParams) {
  const [{ status, value }, check] = useAsync(async () => {
    return await getShorts({ city, country });
  });

  let children = <IdleStatus status={status} check={check} />;

  if (status === "success") {
    children = <Success response={!!value?.wearShorts} />;
  }

  return (
    <main className="text-white flex justify-center items-center min-h-[100dvh]">
      {children}
    </main>
  );
}

interface IdleStatusParams {
  check(): Promise<void>;
  status: string;
}

const IdleStatus = ({ check, status }: IdleStatusParams) => {
  return (
    <div className="flex flex-col text-center items-center gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-xl">🩳</span>
        <h1 className="text-3xl font-bold">
          to short or... <br /> not to short?
        </h1>
      </div>
      <button
        disabled={status === "loading"}
        onClick={check}
        className="bg-neutral-100 px-4 py-1 text-black w-fit rounded-full hover:bg-neutral-50 hover:scale-105 transition-all"
      >
        {status === "loading" ? "Loading..." : "Find it out!"}
      </button>
    </div>
  );
};

interface SuccessParams {
  response: boolean;
}

const Success = ({ response }: SuccessParams) => {
  const shortsText = "Today is a shorts day!";
  const pantsText = "Well, at least we have pants.";

  return (
    <div className="flex flex-col gap-2 text-center justify-center items-center">
      <span className="text-2xl">{response ? "🩳" : "👖"}</span>
      <h2 className="text-3xl font-bold">
        {response ? shortsText : pantsText}
      </h2>
    </div>
  );
};
