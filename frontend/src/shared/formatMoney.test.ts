import { describe, expect, it } from "vitest";
import { formatMoney } from "./formatMoney";

describe("formatMoney", () => {
  it.each([
    [0, "$0.00"],
    [795, "$7.95"],
    [5437, "$54.37"],
    [11475, "$114.75"],
  ])("formats %i cents as %s", (cents, dollars) => {
    expect(formatMoney(cents)).toBe(dollars);
  });
});
