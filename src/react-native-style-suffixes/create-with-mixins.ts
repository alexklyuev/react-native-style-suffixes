import {
  Appearance,
  ColorSchemeName,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import type { CleanKeys, Mixin, StyleProps } from "./types";
import { difference } from "./utils";

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

export const createWithMixinsInternal = <
  MixinKeys extends string,
  Delimeter extends string,
>(
  mixins: Record<MixinKeys, Mixin>,
  { delimeter }: { delimeter: Delimeter },
  getColorScheme: () => ColorSchemeName = Appearance.getColorScheme,
): (<
  RawStyleKeys extends string,
  StyleValue extends ViewStyle | TextStyle | ImageStyle,
  CK extends string = CleanKeys<Delimeter, MixinKeys, RawStyleKeys>,
>(
  styles: Record<RawStyleKeys, StyleValue>,
) => Record<CK, StyleProps>) => {
  const mixinKeysSet = new Set(Object.keys(mixins));
  return <
    RawStyleKeys extends string,
    StyleValue extends ViewStyle | TextStyle | ImageStyle,
    CK extends string = CleanKeys<Delimeter, MixinKeys, RawStyleKeys>,
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
    const proxyfiedObject = Array.from(applicationMap).reduce(
      (po, item) => {
        po[item[0]] = null;
        return po;
      },
      {} as Record<CK, StyleProps>,
    );
    return new Proxy(proxyfiedObject, {
      get: (_t, cleanKey: CK) => {
        const [originalKey, appliedMixinsKeys] = applicationMap.get(cleanKey)!;
        const style = { ...styles[originalKey] };
        const colorScheme = getColorScheme();
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
    }) as Record<CK, StyleProps>;
  };
};
