// src/react-native-style-suffixes/create-with-mixins.ts
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

// src/react-native-style-suffixes/create-with-mixins.ts
var getSeparateKeysGlobal = (name, delimeter, mixinKeysSet) => {
  const [base, ...possibleMixinKeys] = name.split(delimeter);
  const possibleMixinKeysSet = new Set(possibleMixinKeys);
  if (difference(possibleMixinKeysSet, mixinKeysSet).size > 0) {
    return [name, []];
  } else {
    return [base, possibleMixinKeys];
  }
};
var createWithMixinsInternal = (mixins, { delimeter }, getColorScheme = Appearance.getColorScheme) => {
  const mixinKeysSet = new Set(Object.keys(mixins));
  return (styles) => {
    const applicationMap = /* @__PURE__ */ new Map();
    const originalStyleKeys = new Set(
      Object.keys(styles)
    );
    originalStyleKeys.forEach((originalKey) => {
      const [cleanKey, appliedMixins] = getSeparateKeysGlobal(originalKey, delimeter, mixinKeysSet);
      applicationMap.set(cleanKey, [originalKey, appliedMixins]);
    });
    const proxyfiedObject = Array.from(applicationMap).reduce(
      (po, item) => {
        po[item[0]] = null;
        return po;
      },
      {}
    );
    return new Proxy(proxyfiedObject, {
      get: (_t, cleanKey) => {
        const [originalKey, appliedMixinsKeys] = applicationMap.get(cleanKey);
        const style = { ...styles[originalKey] };
        const colorScheme = getColorScheme();
        if (colorScheme) {
          appliedMixinsKeys.map((key) => mixins[key]).reduce((st, mixin) => {
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
  };
};
export {
  createWithMixinsInternal as createWithMixins
};
