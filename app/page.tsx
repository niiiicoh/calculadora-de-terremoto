import { TerremotoCalculator } from "@/components/TerremotoCalculator";
import { TerremotoGlass } from "@/components/TerremotoGlass";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DieciochoCountdown } from "@/components/DieciochoCountdown";
import { RECIPE_RATIO } from "@/lib/terremoto";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#calculator">
        Ir a la calculadora
      </a>
      <div className="page-shell">
        <header className="site-header">
          <div className="brand">
            <Link href="/" aria-label="Calculadora de Terremoto, inicio">
              Calculadora de Terremoto
            </Link>
            <small>por @niiiicoh</small>
          </div>
          <div className="header-tools">
            <ThemeToggle />
            <svg
              className="chile-flag"
              role="img"
              aria-label="Bandera de Chile"
              viewBox="0 0 30 20"
              width="36"
              height="24"
            >
              <path fill="#fff9ed" d="M0 0h30v20H0z" />
              <path fill="#bb3328" d="M0 10h30v10H0z" />
              <path fill="#203d64" d="M0 0h10v10H0z" />
              <path
                fill="#fff9ed"
                d="m5 1.7.78 2.4H8.3L6.26 5.6l.78 2.4L5 6.52 2.96 8l.78-2.4L1.7 4.1h2.52z"
              />
            </svg>
          </div>
        </header>
        <DieciochoCountdown />
        <main className="main-layout" id="calculator">
          <section className="intro" aria-labelledby="page-title">
            <div className="intro-text">
              <h1 id="page-title">
                <span>¿Cuántos</span>
                <strong>TERREMOTOS</strong>
                <span>vamos a preparar?</span>
              </h1>
              <p className="intro-description">
                Pon la cantidad de personas y el tamaño del vaso. Aquí salen las
                medidas de pipeño, helado y granadina.
              </p>
            </div>
            <div className="illustration-block">
              <TerremotoGlass />
              <span className="glass-caption">
                Pipeño
                <br />
                Helado de piña
                <br />
                Granadina
              </span>
            </div>
            <div className="base-recipe">
              <span className="base-title">La proporción que usamos</span>
              <div className="ratio-list">
                <p>
                  <strong>
                    {RECIPE_RATIO.pipeno * 100}
                    <small>%</small>
                  </strong>
                  <span>Pipeño</span>
                </p>
                <p>
                  <strong>
                    {RECIPE_RATIO.helado * 100}
                    <small>%</small>
                  </strong>
                  <span>Helado de piña</span>
                </p>
                <p>
                  <strong>
                    {RECIPE_RATIO.granadina * 100}
                    <small>%</small>
                  </strong>
                  <span>Granadina</span>
                </p>
              </div>
            </div>
          </section>
          <TerremotoCalculator />
        </main>
        <footer className="site-footer">
          <p>
            Las cantidades son aproximadas y pueden variar según la forma de
            servir el helado.
          </p>
          <p className="author-credit">Desarrollado por @niiiicoh</p>
        </footer>
      </div>
    </>
  );
}
