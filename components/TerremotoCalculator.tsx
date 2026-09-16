"use client";
import dynamic from "next/dynamic";
import { getEasterEgg } from "@/lib/easterEggs";
import { useState } from "react";
import { calculateTerremoto, DEFAULTS, validCount } from "@/lib/terremoto";
import { formatNumber, formatVolume } from "@/lib/format";
import { NumberStepper } from "./NumberStepper";
import { ShareResultButton } from "./ShareResultButton";

const ShareCardEditor = dynamic(() => import("./ShareCardEditor"), {
  loading: () => <p className="card-hint">Preparando tarjeta…</p>,
});

export function TerremotoCalculator() {
  const [cardOpen, setCardOpen] = useState(false);
  const [people, setPeople] = useState<string>(String(DEFAULTS.people));
  const [drinks, setDrinks] = useState<string>(
    String(DEFAULTS.drinksPerPerson),
  );
  const [size, setSize] = useState<string>(String(DEFAULTS.glassMl));
  const [custom, setCustom] = useState("");
  const glassMl = Number(size === "custom" ? custom : size);
  const peopleValid = validCount(Number(people));
  const drinksValid = validCount(Number(drinks));
  const glassValid =
    Number.isInteger(glassMl) && glassMl >= 100 && glassMl <= 2000;
  const safeTotal = Number.isSafeInteger(
    Number(people) * Number(drinks) * glassMl,
  );
  const valid = peopleValid && drinksValid && glassValid && safeTotal;
  const result = valid
    ? calculateTerremoto({
        people: Number(people),
        drinksPerPerson: Number(drinks),
        glassMl,
      })
    : null;
  const ingredients = result
    ? [
        {
          name: "Pipeño",
          amount: result.pipenoMl,
          individual: result.perGlass.pipenoMl,
          className: "pipeno",
        },
        {
          name: "Helado de piña",
          amount: result.heladoMl,
          individual: result.perGlass.heladoMl,
          className: "helado",
        },
        {
          name: "Granadina",
          amount: result.granadinaMl,
          individual: result.perGlass.granadinaMl,
          className: "granadina",
        },
      ]
    : [];
  const shareText = result
    ? `Calculadora de Terremoto:\n\n${people} personas\n${drinks} por persona\n${formatNumber(result.totalDrinks)} terremotos de ${formatNumber(glassMl)} ml\n\n${ingredients.map((item) => `${item.name}: ${formatVolume(item.amount)}`).join("\n")}\n\n${formatVolume(result.totalMl)} preparados en total.\n\nCalculadora de Terremoto · @niiiicoh`
    : "";
  function reset() {
    setPeople(String(DEFAULTS.people));
    setDrinks(String(DEFAULTS.drinksPerPerson));
    setSize(String(DEFAULTS.glassMl));
    setCustom("");
  }
  return (
    <section className="calculator" aria-label="Calculadora de terremotos">
      <div className="calculator-top">
        <span>Arma tu receta</span>
        <span aria-hidden="true">✳</span>
      </div>
      <div className="questions">
        <NumberStepper
          id="people"
          label="¿Cuántas personas hay en tu fonda?"
          value={people}
          onChange={setPeople}
          hint="personas"
          error={
            people !== "" && !peopleValid
              ? "Ingresa un número entero desde 1."
              : undefined
          }
        />
        <NumberStepper
          id="drinks"
          label="¿Cuántos se tomará cada persona?"
          value={drinks}
          onChange={setDrinks}
          hint="terremotos por persona"
          error={
            drinks !== "" && !drinksValid
              ? "Ingresa un número entero desde 1."
              : undefined
          }
        />
        <fieldset className="glass-question">
          <legend>¿De cuánto es el vaso?</legend>
          <div className="glass-options">
            {["300", "400", "500", "custom"].map((option) => (
              <label key={option} className="glass-option">
                <input
                  type="radio"
                  name="glass"
                  value={option}
                  checked={size === option}
                  onChange={() => setSize(option)}
                />
                <span>
                  {option === "custom" ? (
                    "Otro"
                  ) : (
                    <>
                      {option} <small>ml</small>
                    </>
                  )}
                </span>
              </label>
            ))}
          </div>
          {size === "custom" && (
            <div className="custom-size">
              <label htmlFor="custom-size">
                Tamaño personalizado <span>(ml)</span>
              </label>
              <input
                id="custom-size"
                type="number"
                min="100"
                max="2000"
                step="1"
                inputMode="numeric"
                required
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                aria-invalid={custom !== "" && !glassValid}
                aria-describedby="custom-hint"
              />
              <p
                id="custom-hint"
                className={
                  custom !== "" && !glassValid ? "error" : "input-hint"
                }
              >
                Entre 100 y 2000 ml, sin decimales.
              </p>
            </div>
          )}
        </fieldset>
      </div>
      <div className="results" aria-live="polite" aria-atomic="true">
        {result ? (
          <>
            <div className="result-heading">
              <div>
                <h2>Tu fonda necesita</h2>
                <p>
                  <strong>{formatNumber(result.totalDrinks)} terremotos</strong>{" "}
                  de {formatNumber(glassMl)} ml
                </p>
              </div>
              <span className="result-star" aria-hidden="true">
                ✦
              </span>
            </div>
            <p className="total-volume">
              {formatVolume(result.totalMl)} preparados en total
            </p>
            <dl className="ingredients">
              {ingredients.map((item) => (
                <div key={item.name} className="ingredient">
                  <dt>
                    <span
                      className={`ingredient-mark ${item.className}`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </dt>
                  <dd>{formatVolume(item.amount)}</dd>
                </div>
              ))}
            </dl>
            <p className="calculation-summary">
              {formatNumber(Number(people))} personas ×{" "}
              {formatNumber(Number(drinks))} terremotos ×{" "}
              {formatNumber(glassMl)} ml
              <br />
              <span>
                = {formatNumber(result.totalDrinks)} terremotos ·{" "}
                {formatVolume(result.totalMl)}
              </span>
            </p>
            <section className="per-glass" aria-labelledby="recipe-title">
              <div>
                <h3 id="recipe-title">Tu terremoto</h3>
                <p>Para un vaso de {formatNumber(glassMl)} ml</p>
              </div>
              <ul>
                {ingredients.map((item) => (
                  <li key={item.name}>
                    <strong>{formatVolume(item.individual)}</strong> de{" "}
                    {item.name.toLowerCase()}
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <div className="empty-result">
            <h2>Completa las cantidades</h2>
            <p>
              {!safeTotal
                ? "La cantidad es demasiado grande. Reduce el número de personas o de terremotos."
                : "Completa las tres preguntas con cantidades válidas para ver tu resultado."}
            </p>
          </div>
        )}
      </div>
      {result && (
        <p className="easter-egg" role="status">
          {getEasterEgg({
            people: Number(people),
            drinksPerPerson: Number(drinks),
            glassMl,
          })}
        </p>
      )}
      <div className="actions">
        <ShareResultButton key={shareText} text={shareText} disabled={!valid} />
        <button type="button" className="reset-button" onClick={reset}>
          Reiniciar <span aria-hidden="true">↺</span>
        </button>
      </div>
      <div className="card-action">
        <button
          type="button"
          disabled={!valid}
          aria-expanded={cardOpen}
          aria-controls="card-editor"
          onClick={() => setCardOpen(!cardOpen)}
        >
          {cardOpen ? "Cerrar tarjeta" : "Crear tarjeta"}
        </button>
        <span>Una imagen con tus cantidades</span>
      </div>
      {cardOpen && result && (
        <ShareCardEditor
          input={{
            people: Number(people),
            drinksPerPerson: Number(drinks),
            glassMl,
          }}
        />
      )}
    </section>
  );
}
