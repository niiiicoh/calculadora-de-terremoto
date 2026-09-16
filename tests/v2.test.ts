import { test } from "node:test";
import assert from "node:assert/strict";
import { getCountdown } from "../lib/countdown.ts";
import { getEasterEgg } from "../lib/easterEggs.ts";
import { generateFondaName, fondaNames } from "../lib/fondaNames.ts";
test("local countdown handles September 18 and the next year", () => {
  assert.deepEqual(getCountdown(new Date(2026, 8, 17, 23, 59)), {
    celebration: false,
    days: 0,
    hours: 0,
    minutes: 1,
  });
  assert.equal(getCountdown(new Date(2026, 8, 18, 23, 59)).celebration, true);
  assert.equal(getCountdown(new Date(2026, 8, 19)).days, 364);
  assert.equal(getCountdown(new Date(2027, 8, 19)).days, 365);
});
test("context messages prioritize extreme data without changing inputs", () => {
  const input = { people: 18, drinksPerPerson: 50, glassMl: 500 };
  assert.match(getEasterEgg(input), /revisa ese dato/);
  assert.equal(input.drinksPerPerson, 50);
  assert.match(getEasterEgg({ ...input, drinksPerPerson: 2 }), /18 personas/);
});
test("name generator returns a different valid short name", () => {
  for (const name of fondaNames) {
    const next = generateFondaName(name);
    assert.notEqual(next, name);
    assert.ok(fondaNames.includes(next));
    assert.ok(next.length <= 40);
  }
});
