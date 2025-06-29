import { Translatable } from "@/app/lib/types";

const TITLE: Translatable = {
  en: "This is not normal...",
  es: "Esto no es normal...",
};

const SUBTITLE: Translatable = {
  en: "Something went wrong",
  es: "Algo salió",
};

const BUTTON_TEXT: Translatable = {
  en: "Try again",
  es: "Intentalo de nuevo",
};

export const CONTENT = (lang: "en" | "es") => ({
  title: TITLE[lang],
  subtitle: SUBTITLE[lang],
  button: BUTTON_TEXT[lang],
});
