// src/react-native-style-suffixes/create-with-mixins-classes.ts
import {
  Appearance
} from "react-native";

// src/react-native-style-suffixes/utils.ts
var difference = (variant, base) => {
  const result = /* @__PURE__ */ new Set();
  variant.forEach((item) => {
    if (!base.has(item)) {
      result.add(item);
    }
  });
  return result;
};

// src/react-native-style-suffixes/create-with-mixins-classes.ts
var MixinsContainer = class {
  constructor(mixins) {
    this.mixins = mixins;
    this.mixinKeysSet = new Set(Object.keys(mixins));
  }
  mixinKeysSet;
  getMixinKeys() {
    return this.mixinKeysSet;
  }
  getMixins() {
    return this.mixins;
  }
};
var StylesMixer = class {
  constructor(mixins, styles, delimeter, getColorScheme) {
    this.mixins = mixins;
    this.styles = styles;
    const originalStyleKeys = new Set(
      Object.keys(styles)
    );
    originalStyleKeys.forEach((originalKey) => {
      const [cleanKey, appliedMixins] = this.separateKeys(originalKey);
      if (this.applicationMap.has(cleanKey)) {
        throw new Error("Style suffixes: duplicating base key");
      }
      this.applicationMap.set(cleanKey, [originalKey, appliedMixins]);
    });
    if (delimeter) {
      this.delimeter = delimeter;
    }
    if (getColorScheme) {
      this.getColorScheme = getColorScheme;
    }
  }
  applicationMap = /* @__PURE__ */ new Map();
  delimeter = "_";
  getColorScheme = Appearance.getColorScheme;
  separateKeys(name) {
    const [base, ...possibleMixinKeys] = name.split(this.delimeter);
    if (!base) {
      throw new Error("Style suffixes: base could not be empty");
    }
    const possibleMixinKeysSet = new Set(possibleMixinKeys);
    if (difference(possibleMixinKeysSet, this.mixins.getMixinKeys()).size > 0) {
      throw new Error("Style suffixes: unknown/misspeled mixin key");
    } else {
      return [base, possibleMixinKeys];
    }
  }
  getMixedStyles() {
    const proxyfiedObject = Array.from(this.applicationMap).reduce(
      (po, item) => {
        po[item[0]] = null;
        return po;
      },
      {}
    );
    return new Proxy(proxyfiedObject, {
      get: (_t, cleanKey) => {
        const [originalKey, appliedMixinsKeys] = this.applicationMap.get(cleanKey);
        const style = { ...this.styles[originalKey] };
        const colorScheme = this.getColorScheme();
        if (colorScheme) {
          appliedMixinsKeys.map((key) => this.mixins.getMixins()[key]).reduce((st, mixin) => {
            return Object.entries(mixin).reduce(
              (styleResult, [styleName, themeVariants]) => {
                return Object.assign(styleResult, {
                  [styleName]: themeVariants[colorScheme]
                });
              },
              st
            );
          }, style);
        }
        return style;
      }
    });
  }
};

// src/react-native-style-suffixes/index.ts
var createWithMixins = (mixins, delimeter, getColorScheme) => {
  const mixinsContainer = new MixinsContainer(mixins);
  return (styles) => {
    const styleMixer = new StylesMixer(
      mixinsContainer,
      styles,
      delimeter,
      getColorScheme
    );
    return styleMixer.getMixedStyles();
  };
};
export {
  createWithMixins
};
