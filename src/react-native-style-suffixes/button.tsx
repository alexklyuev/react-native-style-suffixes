import { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useMixin } from ".";

const Button: FC = () => {
  const styles_ = useMixin(styles);

  return (
    <View style={styles_.container}>
      <Text style={styles_.text}>Press me</Text>
      <Text style={styles_.subtext}>for action</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container_bgc: {
    borderRadius: 10,
    borderWidth: 0.25,
    borderColor: "#111",
  },
  text_tc: {},
  subtext: {},
});

export default Button;
