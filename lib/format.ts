const formatter = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 2 });
export const formatNumber = (value: number) => formatter.format(value);
export function formatVolume(ml: number) {
  return ml < 1000 ? `${formatNumber(ml)} ml` : `${formatNumber(ml / 1000)} L`;
}
