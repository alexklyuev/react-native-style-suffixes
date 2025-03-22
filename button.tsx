import { FC, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Appearance,
} from "react-native";
import { useMixins } from "./useMixins";

const Button: FC = () => {
  const colorScheme = useColorScheme();

  const changeColorScheme = useCallback(() => {
    Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme]);

  const styles_ = useMixins(styles);

  return (
    <TouchableOpacity onPress={changeColorScheme}>
      <View style={styles_.container}>
        <Text style={styles_.text}>Press me</Text>
        <Text style={styles_.subtext}>to change theme</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container_backgroundInvert: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 0.25,
    borderColor: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text_textInvert: {},
  subtext: {
    color: "lightgreen",
  },
});

export default Button;
