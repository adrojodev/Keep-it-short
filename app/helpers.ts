export function getLang() {
  const lang = navigator.language;

  if (lang.startsWith("es")) return "es";

  return "en";
}
