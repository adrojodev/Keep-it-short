import { Translatable } from "@/app/lib/types";

const SHORT_TEXT: Translatable = {
  en: "Today is a shorts day!",
  es: "Hoy es un día de shorts!",
};

const PANTS_TEXT: Translatable = {
  en: "Well, at least we have pants",
  es: "Al menos tenemos pantalones",
};

const BUTTON_TEXT: Translatable = {
  en: "Try again",
  es: "Intentarlo de nuevo",
};

const USES: Translatable = {
  en: "Uses left today:",
  es: "Usos disponibles hoy:",
};

export const CONTENT = (lang: "en" | "es") => ({
  pantsText: PANTS_TEXT[lang],
  shortsText: SHORT_TEXT[lang],
  buttonText: BUTTON_TEXT[lang],
  uses: USES[lang],
});
