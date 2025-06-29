import { Translatable } from "@/app/lib/types";

const TITLE: Translatable = {
  en: "To short 🩳?",
  es: "Usar short 🩳?",
};

const SUBTITLE: Translatable = {
  en: "Or not to short 👖?",
  es: "O no usar short 👖?",
};

const BUTTON_TEXT: Translatable = {
  en: "Find out!",
  es: "Descubrelo!",
};

export const CONTENT = (lang: "en" | "es") => ({
  title: TITLE[lang],
  subtitle: SUBTITLE[lang],
  button: BUTTON_TEXT[lang],
});
