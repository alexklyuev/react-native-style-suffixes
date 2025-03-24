import {
  Appearance,
  useColorScheme,
  type StyleProp,
  type ColorValue,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type StyleProps =
  | StyleProp<ViewStyle>
  | StyleProp<TextStyle>
  | StyleProp<ImageStyle>;

type ThemeKeys = "light" | "dark";

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

export const createUseMixins = <MixinKeys extends string>(
  mixins: Record<MixinKeys, Mixin>,
  { delimeter }: { delimeter: string } = { delimeter: "_" },
) => {
  const mixinKeys = new Set(Object.keys(mixins));
  return <
    RawStyleKeys extends string,
    StyleValue extends ViewStyle | TextStyle | ImageStyle,
  >(
    styles: Record<RawStyleKeys, StyleValue>,
  ) => {
    const colorScheme = useColorScheme();
    return (
      Object.entries<StyleValue>(styles) as [RawStyleKeys, StyleValue][]
    ).reduce(
      (result, [key, style]) => {
        const [base, ...appliedMixinKeysArray] = key.split(delimeter);
        if (base === "") {
          throw new Error("Cleaned style name is empty");
        }
        const appliedMixinKeysSet = new Set(appliedMixinKeysArray);
        if (difference(appliedMixinKeysSet, mixinKeys).size === 0) {
          if (base in result) {
            throw new Error(`Cleaned style name duplicate: ${base}`);
          }
          Object.assign(result, {
            [base]: {
              ...style,
              ...(appliedMixinKeysArray as MixinKeys[]).reduce(
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
            throw new Error(`Raw style name duplicate: ${key}`);
          }
          Object.assign(result, { [key]: style });
        }
        return result;
      },
      {} as Record<
        CleanKeys<typeof delimeter, MixinKeys, RawStyleKeys>,
        StyleProps
      >,
    );
  };
};

export const getSeparateKeysGlobal = <
  Name extends string,
  Delimeter extends string,
  MixinKeys extends string,
  R = [CleanKeys<Delimeter, MixinKeys, Name>, MixinKeys[]],
>(
  name: Name,
  delimeter: Delimeter,
  mixinKeysSet: Set<MixinKeys>,
): R => {
  const [base, ...possibleMixinKeys] = name.split(delimeter);
  const possibleMixinKeysSet = new Set(possibleMixinKeys);
  if (difference(possibleMixinKeysSet, mixinKeysSet).size > 0) {
    return [name, []] as unknown as R;
  } else {
    return [base, possibleMixinKeys] as R;
  }
};

export const createWithMixins = <MixinKeys extends string>(
  mixins: Record<MixinKeys, Mixin>,
  { delimeter }: { delimeter: string } = { delimeter: "_" },
) => {
  const mixinKeysSet = new Set(Object.keys(mixins));
  return <
    RawStyleKeys extends string,
    StyleValue extends ViewStyle | TextStyle | ImageStyle,
    CK extends string = CleanKeys<typeof delimeter, MixinKeys, RawStyleKeys>,
  >(
    styles: Record<RawStyleKeys, StyleValue>,
  ): Record<CK, StyleProps> => {
    const applicationMap = new Map<CK, [RawStyleKeys, MixinKeys[]]>();
    const originalStyleKeys = new Set<RawStyleKeys>(
      Object.keys(styles) as RawStyleKeys[],
    );
    originalStyleKeys.forEach((originalKey: RawStyleKeys) => {
      const [cleanKey, appliedMixins]: [CK, MixinKeys[]] =
        getSeparateKeysGlobal(originalKey, delimeter, mixinKeysSet);
      applicationMap.set(cleanKey, [originalKey, appliedMixins]);
    });
    return new Proxy(
      {},
      {
        get: (_t, cleanKey: CK) => {
          const [originalKey, appliedMixinsKeys] =
            applicationMap.get(cleanKey)!;
          const style = { ...styles[originalKey] };
          const colorScheme = Appearance.getColorScheme();
          if (colorScheme) {
            appliedMixinsKeys
              .map((key) => mixins[key])
              .reduce((st, mixin) => {
                return Object.entries(mixin).reduce(
                  (styleResult, [styleName, themeVariants]) => {
                    return Object.assign(styleResult, {
                      [styleName]: themeVariants[colorScheme],
                    });
                  },
                  st,
                );
              }, style);
          }
          return style;
        },
      },
    ) as Record<CK, StyleProps>;
  };
};
