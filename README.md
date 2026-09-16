# Calculadora de Terremoto

Calculadora de ingredientes para una fonda chilena. Next.js App Router, TypeScript y Tailwind CSS. Sin backend ni cuentas.

## Desarrollo

Requiere Node.js 24.

```sh
npm install
npm run dev
```

Abre http://localhost:3000.

## Verificación

```sh
npm run lint
npm test
npm run typecheck
npm run build
npx playwright test
```

Las pruebas de navegador usan Microsoft Edge instalado y levantan la compilación en el puerto 3017. Comprueban cálculo, errores, compartir, copia, reinicio, teclado, accesibilidad con axe, reduced motion y anchos de 360 a 1440 px. Las capturas quedan en `test-results/`.

## Receta

Las proporciones están centralizadas en `lib/terremoto.ts`: 70% pipeño, 24% helado de piña y 6% granadina. El resultado se calcula en el cliente y se formatea con `es-CL`. Los campos vacíos o inválidos suspenden el resultado y deshabilitan compartir.

## Producción y SEO

Copia `.env.example` a `.env.local` y configura `SITE_URL` con el dominio público real antes de compilar. Esto activa canonical, URL Open Graph y sitemap absoluto. Sin dominio, la página lleva `noindex` y el sitemap está vacío. Para staging usa `PREVIEW_MODE=true`; los previews de Vercel también se detectan automáticamente.

```sh
npm run build
npm start
```

Las fuentes Anton y Barlow se descargan durante la compilación mediante `next/font` y se sirven localmente. La ilustración es SVG propio. Copiar resultado escribe las cantidades en el portapapeles y confirma la acción. Si el navegador lo bloquea, muestra texto seleccionable. No abre ventanas nativas de compartir.

## V2 y tarjetas

Crear tarjeta despliega un editor opcional con nombre manual (hasta 40 caracteres), generador local y tema claro/nocturno independiente. La vista previa y el PNG 1080 × 1350 usan el mismo canvas y las fuentes del sitio. Descargar imagen está siempre disponible al terminar el render; Compartir imagen aparece cuando el navegador admite archivos. La copia de texto conserva su comportamiento directo.

El tema inicial respeta el sistema; la elección manual se guarda en localStorage. La cuenta regresiva usa la fecha local y se actualiza cada 15 segundos. Los mensajes contextuales no alteran los cálculos.

## GitHub Pages

URL del proyecto: https://niiiicoh.github.io/calculadora-de-terremoto/

El workflow de Pages se ejecuta en `main`: lint, tests, exportación estática, typecheck y despliegue de `out/`. `actions/configure-pages` proporciona `SITE_URL` y `NEXT_PUBLIC_BASE_PATH`, incluidas la subruta de assets y la metadata. `npm start` sirve la exportación local en el puerto 3017.

Las pruebas de tarjeta también pueden ejecutarse con WebKit: instalarlo con `npx playwright install webkit`, definir `TEST_WEBKIT=1` y ejecutar `npx playwright test tests/browser/v2.spec.ts`.
