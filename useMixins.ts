import { createUseMixins } from "./src/react-native-style-suffixes/create-use-mixins";

export const useMixins = createUseMixins(
  {
    bg: { backgroundColor: { dark: "#000", light: "#fff" } },
    text: { color: { dark: "#fff", light: "#000" } },
    backgroundInvert: { backgroundColor: { dark: "#676", light: "#000" } },
    textInvert: { color: { dark: "#000", light: "#fff" } },
  },
  { delimeter: "_" },
);
