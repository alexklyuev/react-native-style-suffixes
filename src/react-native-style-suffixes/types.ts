import {
  type StyleProp,
  type ColorValue,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";

export type StyleProps =
  | StyleProp<ViewStyle>
  | StyleProp<TextStyle>
  | StyleProp<ImageStyle>;

type ThemeKeys = "light" | "dark";

export type MixinOfView<ViewType extends object> = {
  [StyleName in keyof ViewType]: NonNullable<
    ViewType[StyleName]
  > extends ColorValue
    ? { [Key in ThemeKeys]?: ViewType[StyleName] }
    : never;
};

export type Mixin =
  | MixinOfView<ViewStyle>
  | MixinOfView<TextStyle>
  | MixinOfView<ImageStyle>;

export type CleanKeys<
  Delimeter extends string,
  MixinKeys extends string,
  StylesKeys extends string,
> = StylesKeys extends `${infer IntermediateKeys}${Delimeter}${MixinKeys}`
  ? CleanKeys<Delimeter, MixinKeys, IntermediateKeys>
  : StylesKeys;
