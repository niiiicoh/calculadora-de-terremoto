export const RECIPE_RATIO = {
  pipeno: 0.7,
  helado: 0.24,
  granadina: 0.06,
} as const;
export const DEFAULTS = {
  people: 10,
  drinksPerPerson: 2,
  glassMl: 500,
} as const;
export type CalculatorInput = {
  people: number;
  drinksPerPerson: number;
  glassMl: number;
};

export function validCount(value: number) {
  return Number.isSafeInteger(value) && value >= 1;
}

export function calculateTerremoto({
  people,
  drinksPerPerson,
  glassMl,
}: CalculatorInput) {
  const totalDrinks = people * drinksPerPerson;
  const totalMl = totalDrinks * glassMl;
  if (
    !validCount(people) ||
    !validCount(drinksPerPerson) ||
    !Number.isInteger(glassMl) ||
    glassMl < 100 ||
    glassMl > 2000 ||
    !Number.isSafeInteger(totalMl)
  ) {
    throw new RangeError(
      "Introduce cantidades enteras válidas y un vaso entre 100 y 2000 ml.",
    );
  }
  return {
    totalDrinks,
    totalMl,
    pipenoMl: totalMl * RECIPE_RATIO.pipeno,
    heladoMl: totalMl * RECIPE_RATIO.helado,
    granadinaMl: totalMl * RECIPE_RATIO.granadina,
    perGlass: {
      pipenoMl: glassMl * RECIPE_RATIO.pipeno,
      heladoMl: glassMl * RECIPE_RATIO.helado,
      granadinaMl: glassMl * RECIPE_RATIO.granadina,
    },
  };
}
export type Calculation = ReturnType<typeof calculateTerremoto>;
