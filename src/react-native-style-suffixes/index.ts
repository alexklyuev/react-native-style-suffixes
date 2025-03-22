import {
  Appearance,
  type ColorValue,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type ThemeKeys = "light" | "dark" | "default";

type MixinOfView<ViewType extends object> = {
  [StyleName in keyof ViewType]: NonNullable<
    ViewType[StyleName]
  > extends ColorValue
    ? { [Key in ThemeKeys]?: ViewType[StyleName] }
    : never;
};

type Mixin =
  | MixinOfView<ViewStyle>
  | MixinOfView<TextStyle>
  | MixinOfView<ImageStyle>;

type CleanKeys<
  Delimeter extends string,
  MixinKeys extends string,
  StylesKeys extends string,
> = StylesKeys extends `${infer IntermediateKeys}_${MixinKeys}`
  ? CleanKeys<Delimeter, MixinKeys, IntermediateKeys>
  : StylesKeys;

const difference = <T>(variant: Set<T>, base: Set<T>): Set<T> => {
  const result = new Set<T>();
  variant.forEach((item) => {
    if (!base.has(item)) {
      result.add(item);
    }
  });
  return result;
};

const createUseMixin = <T extends string>(
  mixins: Record<T, Mixin>,
  delimeter: string = "_",
) => {
  const mixinKeys = new Set(Object.keys(mixins));
  return <K extends string, S extends object>(styles: Record<K, S>) => {
    const colorScheme = Appearance.getColorScheme();
    return (Object.entries<S>(styles) as [K, S][]).reduce(
      (result, [key, style]) => {
        const [base, ...appliedMixinKeysArray] = key.split(delimeter);
        const appliedMixinKeysSet = new Set(appliedMixinKeysArray);
        // if (appliedMixinKeysSet.difference(mixinKeys).size === 0) {
        if (difference(appliedMixinKeysSet, mixinKeys).size === 0) {
          if (base in result) {
            throw new Error(`Key duplicate: ${base}`);
          }
          Object.assign(result, {
            [base]: {
              ...style,
              ...(appliedMixinKeysArray as T[]).reduce(
                (mixinsStyles, mixinKey) => {
                  return Object.assign(
                    mixinsStyles,
                    Object.entries(mixins[mixinKey]).reduce(
                      (styleResult, [styleName, themeVariants]) => {
                        return Object.assign(styleResult, {
                          [styleName]: themeVariants[colorScheme ?? "default"],
                        });
                      },
                      {},
                    ),
                  );
                },
                {},
              ),
            },
          });
        } else {
          if (key in result) {
            throw new Error(`Key duplicate: ${key}`);
          }
          Object.assign(result, { [key]: style });
        }
        return result;
      },
      {} as Record<CleanKeys<typeof delimeter, T, K>, S>,
    );
  };
};

export const useMixin = createUseMixin({
  bgc: { backgroundColor: { dark: "#111", light: "#ccc" } },
  tc: { color: { dark: "#000", light: "#fff" } },
});
