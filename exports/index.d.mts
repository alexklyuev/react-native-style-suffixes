import { ColorValue, ViewStyle, TextStyle, ImageStyle, StyleProp, ColorSchemeName } from 'react-native';

type StyleProps = StyleProp<ViewStyle> | StyleProp<TextStyle> | StyleProp<ImageStyle>;
type ThemeKeys = "light" | "dark";
type MixinOfView<ViewType extends object> = {
    [StyleName in keyof ViewType]: NonNullable<ViewType[StyleName]> extends ColorValue ? {
        [Key in ThemeKeys]?: ViewType[StyleName];
    } : never;
};
type Mixin = MixinOfView<ViewStyle> | MixinOfView<TextStyle> | MixinOfView<ImageStyle>;
type CleanKeys<Delimeter extends string, MixinKeys extends string, StylesKeys extends string> = StylesKeys extends `${infer IntermediateKeys}${Delimeter}${MixinKeys}` ? CleanKeys<Delimeter, MixinKeys, IntermediateKeys> : StylesKeys;

declare const createWithMixins: <MixinKeys extends string, Delimeter extends string = "_">(mixins: Record<MixinKeys, Mixin>, delimeter?: Delimeter, getColorScheme?: () => ColorSchemeName) => <RawStyleKeys extends string, StyleValue extends ViewStyle | TextStyle | ImageStyle>(styles: Record<RawStyleKeys, StyleValue>) => Record<CleanKeys<Delimeter, MixinKeys, RawStyleKeys>, StyleProps>;

export { createWithMixins };
