"use client";
import { useEffect, useState } from "react";
import { getCountdown } from "@/lib/countdown";
export function DieciochoCountdown() {
  const [time, setTime] = useState<ReturnType<typeof getCountdown> | null>(
    null,
  );
  useEffect(() => {
    const update = () => setTime(getCountdown(new Date()));
    const initial = setTimeout(update, 0);
    const interval = setInterval(update, 15000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);
  return (
    <section
      className="countdown"
      aria-label="Cuenta regresiva al 18 de septiembre"
    >
      {time?.celebration ? (
        <strong>¡Llegó el 18!</strong>
      ) : (
        <>
          <p>
            Para el <strong>18 de septiembre</strong>
          </p>
          <dl className="countdown-values">
            {(
              [
                ["Días", time?.days],
                ["Horas", time?.hours],
                ["Minutos", time?.minutes],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  {value === undefined ? "—" : String(value).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  );
}
