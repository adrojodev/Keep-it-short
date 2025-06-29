import { Translatable } from "@/app/lib/types";

const SHORT_TEXT: Translatable = {
  en: "Today is a shorts day!",
  es: "Hoy es un día de shorts!",
};

const PANTS_TEXT: Translatable = {
  en: "Well, at least we have pants",
  es: "Al menos tenemos pantalones",
};

export const CONTENT = (lang: "en" | "es") => ({
  pantsText: PANTS_TEXT[lang],
  shortsText: SHORT_TEXT[lang],
});
