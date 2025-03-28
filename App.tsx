import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Button from "./button";
import { withMixins } from "./withMixins";
import {
  MixinsContainer,
  StylesMixer,
} from "./src/react-native-style-suffixes/create-with-mixins-classes";

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles_.container}>
      <Text style={styles_.text}>Current color scheme: {colorScheme}</Text>
      <Button />
    </View>
  );
}

const styles_ = withMixins(
  StyleSheet.create({
    container_bg: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    text_text: {
      fontSize: 18,
      fontWeight: 800,
      marginBottom: 30,
    },
  }),
);

const mc = new MixinsContainer({
  bg: { backgroundColor: { dark: "#000", light: "#fff" } },
  text: { color: { dark: "#fff", light: "#000" } },
  backgroundInvert: { backgroundColor: { dark: "#9a9", light: "#000" } },
  textInvert: { color: { dark: "#000", light: "#fff" } },
});

const sm = new StylesMixer(
  mc,
  StyleSheet.create({
    container_bg: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    text_text: {
      fontSize: 18,
      fontWeight: 800,
      marginBottom: 30,
    },
  }),
);

const st = sm.getMixedStyles();
