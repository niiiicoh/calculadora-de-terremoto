"use client";
export function ThemeToggle() {
  function toggle() {
    const next =
      document.documentElement.dataset.theme === "night" ? "day" : "night";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("terremoto-theme", next);
    } catch {
      /* Theme still works without storage. */
    }
  }
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label="Cambiar entre modo claro y nocturno"
    >
      <span className="day-label">Fonda nocturna</span>
      <span className="night-label">Fonda de día</span>
      <span aria-hidden="true">◐</span>
    </button>
  );
}
