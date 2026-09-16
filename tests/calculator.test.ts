import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateTerremoto,
  DEFAULTS,
  RECIPE_RATIO,
} from "../lib/terremoto.ts";
import { formatVolume } from "../lib/format.ts";

test("initial recipe and proportions", () => {
  assert.equal(
    Object.values(RECIPE_RATIO).reduce((sum, ratio) => sum + ratio, 0),
    1,
  );
  assert.deepEqual(calculateTerremoto(DEFAULTS), {
    totalDrinks: 20,
    totalMl: 10000,
    pipenoMl: 7000,
    heladoMl: 2400,
    granadinaMl: 600,
    perGlass: { pipenoMl: 350, heladoMl: 120, granadinaMl: 30 },
  });
});
test("preset and custom sizes preserve total volume", () => {
  for (const glassMl of [100, 300, 400, 500, 735, 2000]) {
    const result = calculateTerremoto({
      people: 3,
      drinksPerPerson: 4,
      glassMl,
    });
    assert.equal(result.totalDrinks, 12);
    assert.ok(
      Math.abs(
        result.pipenoMl + result.heladoMl + result.granadinaMl - result.totalMl,
      ) < 0.000001,
    );
  }
});
test("rejects invalid numbers and unsafe totals", () => {
  for (const people of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER])
    assert.throws(
      () => calculateTerremoto({ ...DEFAULTS, people }),
      RangeError,
    );
  for (const glassMl of [99, 2001, 500.5])
    assert.throws(
      () => calculateTerremoto({ ...DEFAULTS, glassMl }),
      RangeError,
    );
  assert.throws(
    () => calculateTerremoto({ ...DEFAULTS, drinksPerPerson: 0 }),
    RangeError,
  );
});
test("formats ml and litres with Chilean decimals", () => {
  for (const [value, expected] of [
    [600, "600 ml"],
    [1000, "1 L"],
    [2400, "2,4 L"],
    [7000, "7 L"],
    [10250, "10,25 L"],
    [44.1, "44,1 ml"],
  ] as const)
    assert.equal(formatVolume(value), expected);
});
