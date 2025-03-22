import { createUseMixins } from ".";

export const useMixins = createUseMixins({
  bg: { backgroundColor: { dark: "#000", light: "#fff" } },
  text: { color: { dark: "#fff", light: "#000" } },
  backgroundInvert: { backgroundColor: { dark: "#fff", light: "#000" } },
  textInvert: { color: { dark: "#000", light: "#fff" } },
});
