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
    <div className="countdown">
      {time?.celebration ? (
        <strong>¡Llegó el 18!</strong>
      ) : (
        <>
          <span>Para el próximo 18</span>
          <strong>
            {time
              ? `${time.days} ${time.days === 1 ? "día" : "días"} · ${String(time.hours).padStart(2, "0")} h · ${String(time.minutes).padStart(2, "0")} min`
              : "18 de septiembre"}
          </strong>
        </>
      )}
    </div>
  );
}
