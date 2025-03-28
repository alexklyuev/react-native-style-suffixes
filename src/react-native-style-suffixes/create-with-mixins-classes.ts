import {
  Appearance,
  ColorSchemeName,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";
import { CleanKeys, Mixin, StyleProps } from "./types";
import { difference } from "./utils";

export class MixinsContainer<MixinKeys extends string> {
  private mixinKeysSet: Set<MixinKeys>;

  constructor(private mixins: Record<MixinKeys, Mixin>) {
    this.mixinKeysSet = new Set(Object.keys(mixins)) as Set<MixinKeys>;
  }

  getMixinKeys() {
    return this.mixinKeysSet;
  }

  getMixins() {
    return this.mixins;
  }
}

export class StylesMixer<
  MixinKeys extends string,
  Delimeter extends string,
  RawStyleKeys extends string,
  CK extends string = CleanKeys<Delimeter, MixinKeys, RawStyleKeys>,
> {
  private applicationMap = new Map<CK, [RawStyleKeys, MixinKeys[]]>();

  constructor(
    private mixins: MixinsContainer<MixinKeys>,
    private styles: Record<RawStyleKeys, ViewStyle | TextStyle | ImageStyle>,
    private delimeter: Delimeter,
    private getColorScheme: () => ColorSchemeName = Appearance.getColorScheme,
  ) {
    const originalStyleKeys = new Set<RawStyleKeys>(
      Object.keys(styles) as RawStyleKeys[],
    );
    originalStyleKeys.forEach((originalKey: RawStyleKeys) => {
      const [cleanKey, appliedMixins]: [CK, MixinKeys[]] =
        this.separateKeys(originalKey);
      if (this.applicationMap.has(cleanKey)) {
        throw new Error("Style suffixes: duplicating base key");
      }
      this.applicationMap.set(cleanKey, [originalKey, appliedMixins]);
    });
  }

  private separateKeys<
    Name extends string,
    R = [CleanKeys<Delimeter, MixinKeys, Name>, MixinKeys[]],
  >(name: Name): R {
    const [base, ...possibleMixinKeys] = name.split(this.delimeter);
    if (!base) {
      throw new Error("Style suffixes: base could not be empty");
    }
    const possibleMixinKeysSet = new Set(possibleMixinKeys);
    if (difference(possibleMixinKeysSet, this.mixins.getMixinKeys()).size > 0) {
      throw new Error("Style suffixes: unknown/misspeled mixin key");
    } else {
      return [base, possibleMixinKeys] as R;
    }
  }

  public getMixedStyles() {
    const proxyfiedObject = Array.from(this.applicationMap).reduce(
      (po, item) => {
        po[item[0]] = null;
        return po;
      },
      {} as Record<CK, StyleProps>,
    );
    return new Proxy(proxyfiedObject, {
      get: (_t, cleanKey: CK) => {
        const [originalKey, appliedMixinsKeys] =
          this.applicationMap.get(cleanKey)!;
        const style = { ...this.styles[originalKey] };
        const colorScheme = this.getColorScheme();
        if (colorScheme) {
          appliedMixinsKeys
            .map((key) => this.mixins.getMixins()[key])
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
  }
}
