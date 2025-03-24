import { createWithMixins } from "./src/react-native-style-suffixes";

export const withMixins = createWithMixins({
  bg: { backgroundColor: { dark: "#000", light: "#fff" } },
  text: { color: { dark: "#fff", light: "#000" } },
  backgroundInvert: { backgroundColor: { dark: "#898", light: "#000" } },
  textInvert: { color: { dark: "#000", light: "#fff" } },
});
