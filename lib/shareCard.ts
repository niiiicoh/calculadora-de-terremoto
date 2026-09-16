import { calculateTerremoto, type CalculatorInput } from "./terremoto";
import { formatNumber, formatVolume } from "./format";
export type CardData = { input: CalculatorInput; name: string; night: boolean };

export async function drawShareCard(
  canvas: HTMLCanvasElement,
  { input, name, night }: CardData,
) {
  await document.fonts.ready;
  const display = getComputedStyle(document.body)
    .getPropertyValue("--font-fraunces")
    .trim();
  const body = getComputedStyle(document.body)
    .getPropertyValue("--font-archivo")
    .trim();
  await Promise.all([
    document.fonts.load(`60px ${display}`),
    document.fonts.load(`32px ${body}`),
  ]);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo crear la imagen.");
  const ctx: CanvasRenderingContext2D = context;
  canvas.width = 1080;
  canvas.height = 1350;
  const bg = night ? "#182630" : "#eee5d2";
  const ink = night ? "#f5e5c2" : "#233e5a";
  const red = night ? "#ffb778" : "#b93227";
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, 1008, 1278);
  function text(
    value: string,
    x: number,
    y: number,
    size: number,
    color = ink,
    font = body,
    max = 916,
  ) {
    ctx.fillStyle = color;
    do {
      ctx.font = `${size}px ${font}`;
      if (ctx.measureText(value).width <= max) break;
      size--;
    } while (size > 12);
    ctx.fillText(value, x, y);
  }
  text("CALCULADORA DE TERREMOTO", 82, 110, 28);
  const title = name.trim() || "Calculadora de Terremoto";
  // Wrap by grapheme so long unbroken names and accented characters never clip.
  const chars = Array.from(
    new Intl.Segmenter("es", { granularity: "grapheme" }).segment(title),
    (item) => item.segment,
  );
  let size = 70,
    lines: string[] = [];
  do {
    ctx.font = `${size}px ${display}`;
    lines = [""];
    for (const char of chars) {
      if (ctx.measureText(lines[lines.length - 1] + char).width > 916)
        lines.push("");
      lines[lines.length - 1] += char;
    }
    if (lines.length <= 2) break;
    size--;
  } while (size > 26);
  lines.forEach((line, index) =>
    text(line.trim(), 82, 220 + index * 86, size, red, display),
  );
  const result = calculateTerremoto(input);
  ctx.fillStyle = night ? "#263b45" : "#233e5a";
  ctx.fillRect(65, 363, 950, 216);
  text(
    `${formatNumber(result.totalDrinks)} terremotos`,
    91,
    460,
    76,
    "#fff9ec",
    display,
    890,
  );
  text(`de ${formatNumber(input.glassMl)} ml`, 91, 533, 38, "#fff9ec");
  text(
    `${formatNumber(input.people)} personas · ${formatNumber(input.drinksPerPerson)} por persona`,
    82,
    641,
    32,
  );
  text(`${formatVolume(result.totalMl)} preparados en total`, 82, 695, 32);
  const rows = [
    ["PIPEÑO", result.pipenoMl],
    ["HELADO DE PIÑA", result.heladoMl],
    ["GRANADINA", result.granadinaMl],
  ] as const;
  rows.forEach(([label, value], index) => {
    const y = 810 + index * 136;
    text(label, 82, y, 27);
    const amount = formatVolume(value);
    ctx.textAlign = "right";
    text(amount, 998, y + 6, 65, ink, display, 545);
    ctx.textAlign = "left";
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(82, y + 38);
    ctx.lineTo(998, y + 38);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });
  text("Cantidades aproximadas, según la forma de servir.", 82, 1210, 25);
  text("hecho por @niiiicoh", 82, 1271, 27);
}
export function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("No se pudo exportar la imagen.")),
      "image/png",
    ),
  );
}
