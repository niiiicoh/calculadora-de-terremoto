"use client";
import { useEffect, useRef, useState } from "react";
import type { CalculatorInput } from "@/lib/terremoto";
import { generateFondaName } from "@/lib/fondaNames";
import { canvasBlob, drawShareCard } from "@/lib/shareCard";
export default function ShareCardEditor({ input }: { input: CalculatorInput }) {
  const [name, setName] = useState("");
  const [night, setNight] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [supportsShare, setSupportsShare] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const currentKey = JSON.stringify({ input, name, night });
  const [fileKey, setFileKey] = useState("");
  const ready = file && fileKey === currentKey;
  useEffect(() => {
    let active = true;
    const render = async () => {
      // Draw offscreen: old async renders cannot overwrite the current preview.
      const buffer = document.createElement("canvas");
      await drawShareCard(buffer, { input, name, night });
      const blob = await canvasBlob(buffer);
      if (!active || !canvas.current) return;
      canvas.current.getContext("2d")?.drawImage(buffer, 0, 0);
      const next = new File([blob], "calculadora-de-terremoto.png", {
        type: "image/png",
      });
      setFile(next);
      setFileKey(currentKey);
      setSupportsShare(Boolean(navigator.canShare?.({ files: [next] })));
    };
    render().catch(() => {
      if (active)
        setStatus(
          "No se pudo crear la imagen. Puedes seguir copiando el resultado como texto.",
        );
    });
    return () => {
      active = false;
    };
  }, [input, name, night, currentKey]);
  function download() {
    if (!ready) return;
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    setStatus("Imagen lista. Revisa las descargas del navegador.");
  }
  async function share() {
    if (!ready) return;
    try {
      await navigator.share({
        files: [file],
        title: name || "Calculadora de Terremoto",
      });
      setStatus("Imagen compartida");
    } catch (error) {
      setStatus(
        error instanceof Error && error.name === "AbortError"
          ? "Compartir cancelado. Puedes descargar la imagen."
          : "No se pudo compartir. Usa Descargar imagen.",
      );
    }
  }
  return (
    <section
      className="card-editor"
      id="card-editor"
      aria-labelledby="card-editor-title"
    >
      <h3 id="card-editor-title">Tu tarjeta</h3>
      <label htmlFor="fonda-name">Nombre de tu fonda (opcional)</label>
      <input
        id="fonda-name"
        maxLength={40}
        value={name}
        placeholder="La Última Cueca"
        onChange={(event) => setName(event.target.value)}
        aria-describedby="name-limit"
      />
      <div className="name-tools">
        <small id="name-limit">{name.length}/40 caracteres</small>
        <button type="button" onClick={() => setName(generateFondaName(name))}>
          Generar nombre
        </button>
      </div>
      <fieldset className="card-theme">
        <legend>Tema de la tarjeta</legend>
        <label>
          <input
            type="radio"
            name="card-theme"
            checked={!night}
            onChange={() => setNight(false)}
          />{" "}
          Claro
        </label>
        <label>
          <input
            type="radio"
            name="card-theme"
            checked={night}
            onChange={() => setNight(true)}
          />{" "}
          Nocturno
        </label>
      </fieldset>
      <canvas
        ref={canvas}
        width={1080}
        height={1350}
        className="card-preview"
        role="img"
        aria-label={`Tarjeta de ${name || "Calculadora de Terremoto"}, con el resultado actual y crédito a @niiiicoh`}
      />
      <div className="card-export">
        <button type="button" disabled={!ready} onClick={download}>
          Descargar imagen
        </button>
        {supportsShare && (
          <button type="button" disabled={!ready} onClick={share}>
            Compartir imagen
          </button>
        )}
      </div>
      <p className="card-hint">
        PNG · 1080 × 1350 px. Puedes enviarlo desde tus descargas.
      </p>
      <p role="status">{status}</p>
    </section>
  );
}
