"use client";
import { useState } from "react";
export function ShareResultButton({
  text,
  disabled,
}: {
  text: string;
  disabled: boolean;
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState(false);
  async function share() {
    setBusy(true);
    setStatus("");
    setManual(false);
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Resultado copiado");
    } catch {
      setManual(true);
      setStatus(
        "No se pudo copiar automáticamente. Selecciona y copia el resultado.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="share-control">
      <button
        type="button"
        className="share-button"
        disabled={disabled || busy}
        onClick={share}
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <rect x="8" y="8" width="12" height="13" rx="1" />
          <path d="M16 5V3H3v13h2" />
        </svg>
        {busy
          ? "Copiando…"
          : status === "Resultado copiado"
            ? "Resultado copiado"
            : "Copiar resultado"}
      </button>
      <p role="status" className="share-status">
        {status}
      </p>
      {manual && (
        <textarea
          aria-label="Resultado para copiar"
          readOnly
          value={text}
          onFocus={(event) => event.target.select()}
          rows={8}
        />
      )}
    </div>
  );
}
