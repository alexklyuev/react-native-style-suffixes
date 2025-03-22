import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Button from "./button";
import { useMixins } from "./useMixins";

export default function App() {
  const colorScheme = useColorScheme();
  const styles_ = useMixins(styles);
  return (
    <View style={styles_.container}>
      <Text style={styles_.text}>Current color scheme: {colorScheme}</Text>
      <Button />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
