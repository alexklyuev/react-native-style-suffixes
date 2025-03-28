import {
  ColorSchemeName,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";
import { CleanKeys, Mixin, StyleProps } from "./types";
import { MixinsContainer, StylesMixer } from "./create-with-mixins-classes";

export const createWithMixins = <
  MixinKeys extends string,
  Delimeter extends string,
>(
  mixins: Record<MixinKeys, Mixin>,
  { delimeter }: { delimeter: Delimeter },
  getColorScheme?: () => ColorSchemeName,
) => {
  const mixinsContainer = new MixinsContainer(mixins);
  return <
    RawStyleKeys extends string,
    StyleValue extends ViewStyle | TextStyle | ImageStyle,
    CK extends string = CleanKeys<Delimeter, MixinKeys, RawStyleKeys>,
  >(
    styles: Record<RawStyleKeys, StyleValue>,
  ): Record<CK, StyleProps> => {
    const styleMixer = new StylesMixer<MixinKeys, Delimeter, RawStyleKeys, CK>(
      mixinsContainer,
      styles,
      delimeter,
      getColorScheme,
    );
    return styleMixer.getMixedStyles();
  };
};
