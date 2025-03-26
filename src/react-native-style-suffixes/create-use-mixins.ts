import { ViewStyle, TextStyle, ImageStyle, useColorScheme } from "react-native";
import { CleanKeys, Mixin, StyleProps } from "./types";
import { difference } from "./utils";

export const createUseMixins = <
  MixinKeys extends string,
  Delimeter extends string,
>(
  mixins: Record<MixinKeys, Mixin>,
  { delimeter }: { delimeter: Delimeter },
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
      {} as Record<CleanKeys<Delimeter, MixinKeys, RawStyleKeys>, StyleProps>,
    );
  };
};
