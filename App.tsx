import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Button from "./button";
import { withMixins } from "./withMixins";

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
