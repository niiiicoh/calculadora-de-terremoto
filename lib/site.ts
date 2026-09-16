const configuredUrl = process.env.SITE_URL;
export const siteUrl = configuredUrl
  ? new URL(configuredUrl).href.replace(/\/$/, "")
  : undefined;
export const isIndexable =
  Boolean(siteUrl) &&
  process.env.PREVIEW_MODE !== "true" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
export const title =
  "Calculadora de Terremoto para Fonda | Pipeño, Helado y Granadina";
export const description =
  "Calcula cuánto pipeño, helado de piña y granadina necesitas según la cantidad de personas, terremotos por persona y tamaño del vaso.";
