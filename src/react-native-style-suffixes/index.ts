import {
  ColorSchemeName,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Mixin } from "./types";
import { MixinsContainer, StylesMixer } from "./create-with-mixins-classes";

export const createWithMixins = <
  MixinKeys extends string,
  Delimeter extends string = "_",
>(
  mixins: Record<MixinKeys, Mixin>,
  delimeter?: Delimeter,
  getColorScheme?: () => ColorSchemeName,
) => {
  const mixinsContainer = new MixinsContainer(mixins);
  return <
    RawStyleKeys extends string,
    StyleValue extends ViewStyle | TextStyle | ImageStyle,
  >(
    styles: Record<RawStyleKeys, StyleValue>,
  ) => {
    const styleMixer = new StylesMixer(
      mixinsContainer,
      styles,
      delimeter,
      getColorScheme,
    );
    return styleMixer.getMixedStyles();
  };
};
