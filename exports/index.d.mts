import { ColorValue, ViewStyle, TextStyle, ImageStyle, StyleProp } from 'react-native';

type StyleProps = StyleProp<ViewStyle> | StyleProp<TextStyle> | StyleProp<ImageStyle>;
type ThemeKeys = "light" | "dark";
type MixinOfView<ViewType extends object> = {
    [StyleName in keyof ViewType]: NonNullable<ViewType[StyleName]> extends ColorValue ? {
        [Key in ThemeKeys]?: ViewType[StyleName];
    } : never;
};
type Mixin = MixinOfView<ViewStyle> | MixinOfView<TextStyle> | MixinOfView<ImageStyle>;
type CleanKeys<Delimeter extends string, MixinKeys extends string, StylesKeys extends string> = StylesKeys extends `${infer IntermediateKeys}${Delimeter}${MixinKeys}` ? CleanKeys<Delimeter, MixinKeys, IntermediateKeys> : StylesKeys;
declare const createUseMixins: <MixinKeys extends string, Delimeter extends string>(mixins: Record<MixinKeys, Mixin>, { delimeter }: {
    delimeter: Delimeter;
}) => <RawStyleKeys extends string, StyleValue extends ViewStyle | TextStyle | ImageStyle>(styles: Record<RawStyleKeys, StyleValue>) => Record<CleanKeys<Delimeter, MixinKeys, RawStyleKeys>, StyleProps>;
declare const getSeparateKeysGlobal: <Name extends string, Delimeter extends string, MixinKeys extends string, R = [CleanKeys<Delimeter, MixinKeys, Name>, MixinKeys[]]>(name: Name, delimeter: Delimeter, mixinKeysSet: Set<MixinKeys>) => R;
declare const createWithMixins: <MixinKeys extends string, Delimeter extends string>(mixins: Record<MixinKeys, Mixin>, { delimeter }: {
    delimeter: Delimeter;
}) => <RawStyleKeys extends string, StyleValue extends ViewStyle | TextStyle | ImageStyle, CK extends string = CleanKeys<Delimeter, MixinKeys, RawStyleKeys>>(styles: Record<RawStyleKeys, StyleValue>) => Record<CK, StyleProps>;

export { createUseMixins, createWithMixins, getSeparateKeysGlobal };
