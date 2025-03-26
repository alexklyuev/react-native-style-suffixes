import { difference } from "../utils";

describe("Set.prototype.difference replacement", () => {
  test("Difference of equal sets", () => {
    expect(difference(new Set([1, 2]), new Set([1, 2])).size).toBe(0);
  });
  test("Difference when candidate less than base", () => {
    expect(difference(new Set([1]), new Set([1, 2])).size).toBe(0);
  });
  test("Difference when candidate more than base", () => {
    expect(difference(new Set([1, 2]), new Set([1])).size).toBe(1);
  });
});
