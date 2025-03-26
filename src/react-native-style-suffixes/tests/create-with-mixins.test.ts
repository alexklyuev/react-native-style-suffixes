import { StyleSheet } from "react-native";
import { createWithMixins } from "..";

describe("Style application with given theme", () => {

  const delimeter = "_";

  const withMixins = createWithMixins(
    {
      bg: { backgroundColor: { dark: "#000", light: "#fff" } },
      bgi: { backgroundColor: { dark: "#fff", light: "#000" } },
      t: { color: { dark: "#fff", light: "#000" } },
      ti: { color: { dark: "#000", light: "#fff" } },
      td: { textDecorationColor: {dark: "#aaa", light: "#222"}}
    },
    { delimeter },
    () => "light",
  );

  const originalStyles = StyleSheet.create({
    background_bg: {},
    fancyText_t_td: {},
    notModified: {},
  });

  const mixedStyles: any = withMixins(originalStyles);

  test("Result values with one suffix", () => {
    expect(mixedStyles.background.backgroundColor).toBe("#fff");
  });
  
  test("Result value with two suffixes", () => {
    expect(mixedStyles.fancyText.color).toBe("#000");
    expect(mixedStyles.fancyText.textDecorationColor).toBe("#222");
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
  })
});
