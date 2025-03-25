import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/react-native-style-suffixes/index.ts"],
  format: "esm",
  external: ["react", "react-native", "expo"],
  clean: true,
  dts: true,
});
