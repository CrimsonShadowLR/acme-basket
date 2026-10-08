import { describe, expect, it } from "vitest";
import {
  addItem,
  countByCode,
  removeAllItems,
  removeOneItem,
} from "./basketItems";

describe("addItem", () => {
  it("appends without changing the original list", () => {
    const items = ["R01"];

    expect(addItem(items, "G01")).toEqual(["R01", "G01"]);
    expect(items).toEqual(["R01"]);
  });
});

describe("removeOneItem", () => {
  it("removes the most recently added unit of that code", () => {
    expect(removeOneItem(["R01", "B01", "R01", "G01"], "R01")).toEqual([
      "R01",
      "B01",
      "G01",
    ]);
  });

  it("returns the same list when the code is not there", () => {
    const items = ["R01"];

    expect(removeOneItem(items, "B01")).toBe(items);
  });
});

describe("removeAllItems", () => {
  it("removes every unit of that code and keeps the rest in order", () => {
    expect(removeAllItems(["R01", "B01", "R01", "G01"], "R01")).toEqual([
      "B01",
      "G01",
    ]);
  });
});

describe("countByCode", () => {
  it("counts units per code", () => {
    expect(countByCode(["R01", "B01", "R01"])).toEqual(
      new Map([
        ["R01", 2],
        ["B01", 1],
      ]),
    );
  });

  it("is empty for an empty basket", () => {
    expect(countByCode([]).size).toBe(0);
  });
});
