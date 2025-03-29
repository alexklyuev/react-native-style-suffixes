import { StyleSheet } from "react-native";
import { createWithMixins } from "..";
import { separateKeys } from "../create-with-mixins";

describe("Style application with given theme", () => {
  const withMixins = createWithMixins(
    {
      bg: { backgroundColor: { dark: "#000", light: "#fff" } },
      bgi: { backgroundColor: { dark: "#fff", light: "#000" } },
      t: { color: { dark: "#fff", light: "#000" } },
      ti: { color: { dark: "#000", light: "#fff" } },
      td: { textDecorationColor: { dark: "#aaa", light: "#222" } },
    },
    undefined as unknown as "_",
    () => "light",
  );

  const originalStyles = StyleSheet.create({
    background_bg: {},
    fancyText_t_td: {},
    notModified: {},
  });

  const mixedStyles = withMixins(originalStyles);

  test("Result values with one suffix", () => {
    expect((mixedStyles.background as any)?.backgroundColor).toBe("#fff");
  });

  test("Result value with two suffixes", () => {
    expect((mixedStyles.fancyText as any)?.color).toBe("#000");
    expect((mixedStyles.fancyText as any)?.textDecorationColor).toBe("#222");
  });

  test("Checking keys of result", () => {
    const originalKeys = Object.keys(originalStyles);
    const mixedKeys = Object.keys(mixedStyles);
    expect(mixedKeys.length).toBe(originalKeys.length);
    expect("background" in mixedStyles).toBe(true);
    expect("fancyText" in mixedStyles).toBe(true);
    expect("notModified" in mixedStyles).toBe(true);
    expect(mixedKeys.includes("background")).toBe(true);
    expect(mixedKeys.includes("fancyText")).toBe(true);
    expect(mixedKeys.includes("notModified")).toBe(true);
  });
});

describe("Custom delimeter", () => {
  const withMixins = createWithMixins(
    {
      bg: { backgroundColor: { dark: "#000", light: "#fff" } },
      bgi: { backgroundColor: { dark: "#fff", light: "#000" } },
      t: { color: { dark: "#fff", light: "#000" } },
      ti: { color: { dark: "#000", light: "#fff" } },
      td: { textDecorationColor: { dark: "#aaa", light: "#222" } },
    },
    "$",
    () => "light",
  );

  const originalStyles = StyleSheet.create({
    background$bg: {},
    fancyText$t$td: {},
    notModified: {},
  });

  const mixedStyles = withMixins(originalStyles);

  test("Checking keys and values of mixed styles", () => {
    const originalKeys = Object.keys(originalStyles);
    const mixedKeys = Object.keys(mixedStyles);
    expect(mixedKeys.length).toBe(originalKeys.length);
    expect("background" in mixedStyles).toBe(true);
    expect("fancyText" in mixedStyles).toBe(true);
    expect("notModified" in mixedStyles).toBe(true);
    expect(mixedKeys.includes("background")).toBe(true);
    expect(mixedKeys.includes("fancyText")).toBe(true);
    expect(mixedKeys.includes("notModified")).toBe(true);
  });
});

describe("Separating base keys and mixins keys", () => {
  test("Separating function", () => {
    const result = separateKeys("base_m1_m2", "_", new Set(["m1", "m2"]));
    expect(result[0]).toBe("base");
    expect(result[1].length).toBe(2);
    expect(result[1].includes("m1")).toBe(true);
    expect(result[1].includes("m2")).toBe(true);
  });
});

describe("Errors", () => {
  test("Error from empty base key", () => {
    expect(() => separateKeys("_m1_m2", "_", new Set(["m1", "m2"]))).toThrow();
  });
  test("Duplicating base keys error", () => {
    expect(() => {
      createWithMixins(
        {
          m1: { color: { dark: "#000", light: "#fff" } },
          m2: { color: { dark: "#000", light: "#fff" } },
        },
        "_",
        () => "light",
      )({
        base_m1: {},
        base_m2: {},
      });
    }).toThrow();
  });
  test("Misspeled/unknown mixin suffixes error", () => {
    expect(() => {
      createWithMixins(
        {
          m1: { color: { dark: "#000", light: "#fff" } },
        },
        "_",
        () => "light",
      )({
        base_m3: {},
      });
    }).toThrow();
  });
});
