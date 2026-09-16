export const fondaNames = [
  "La Última Cueca",
  "La Réplica",
  "Donde Tiembla Dos Veces",
  "La Media Caña",
  "La Patita Alegre",
  "Se Nos Movió el Piso",
  "La Ramada del Compadre",
  "El Mantel a Cuadros",
  "La Cueca Larga",
  "La Esquina del Pipeño",
  "El Patio de la Abuela",
  "La Vuelta del Huaso",
];
export function generateFondaName(previous: string) {
  const options = fondaNames.filter((name) => name !== previous);
  const random = new Uint32Array(1);
  crypto.getRandomValues(random);
  return options[random[0] % options.length];
}
