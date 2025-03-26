import { createWithMixins } from "..";

const withMixins = createWithMixins(
  {
    bg: { backgroundColor: { dark: "#000", light: "#fff" } },
    bgi: { backgroundColor: { dark: "#fff", light: "#000" } },
    t: { color: { dark: "#fff", light: "#000" } },
    ti: { color: { dark: "#000", light: "#fff" } },
  },
  { delimeter: "_" },
  () => "light",
);

export const testStyles = withMixins(
  // StyleSheet.create({
  //   background_bg: {},
  // }),
  { background_bg: {} },
);

describe("Some description", () => {
  expect(testStyles.background).toBe("#fff");
});
