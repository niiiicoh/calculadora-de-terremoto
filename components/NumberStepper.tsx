type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint: string;
};
export function NumberStepper({
  id,
  label,
  value,
  onChange,
  error,
  hint,
}: Props) {
  function step(amount: number) {
    const current = Number(value);
    const next = Math.max(
      1,
      (Number.isSafeInteger(current) ? current : 1) + amount,
    );
    if (Number.isSafeInteger(next)) onChange(String(next));
  }
  return (
    <div className="question">
      <label htmlFor={id}>{label}</label>
      <div className="stepper">
        <button
          type="button"
          aria-label={`Disminuir ${hint}`}
          onClick={() => step(-1)}
          disabled={Number(value) <= 1}
        >
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
        />
        <button
          type="button"
          aria-label={`Aumentar ${hint}`}
          onClick={() => step(1)}
        >
          +
        </button>
      </div>
      <span className="input-hint" id={`${id}-hint`}>
        {hint}
      </span>
      {error && (
        <p className="error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
