// src/react-native-style-suffixes/index.ts
import {
  Appearance,
  useColorScheme
} from "react-native";
var difference = (variant, base) => {
  const result = /* @__PURE__ */ new Set();
  variant.forEach((item) => {
    if (!base.has(item)) {
      result.add(item);
    }
  });
  return result;
};
var createUseMixins = (mixins, { delimeter }) => {
  const mixinKeys = new Set(Object.keys(mixins));
  return (styles) => {
    const colorScheme = useColorScheme();
    return Object.entries(styles).reduce(
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
              ...appliedMixinKeysArray.reduce(
                (mixinsStyles, mixinKey) => {
                  return Object.assign(
                    mixinsStyles,
                    Object.entries(mixins[mixinKey]).reduce(
                      (styleResult, [styleName, themeVariants]) => {
                        return Object.assign(styleResult, {
                          [styleName]: themeVariants[colorScheme ?? "default"]
                        });
                      },
                      {}
                    )
                  );
                },
                {}
              )
            }
          });
        } else {
          if (key in result) {
            throw new Error(`Raw style name duplicate: ${key}`);
          }
          Object.assign(result, { [key]: style });
        }
        return result;
      },
      {}
    );
  };
};
var getSeparateKeysGlobal = (name, delimeter, mixinKeysSet) => {
  const [base, ...possibleMixinKeys] = name.split(delimeter);
  const possibleMixinKeysSet = new Set(possibleMixinKeys);
  if (difference(possibleMixinKeysSet, mixinKeysSet).size > 0) {
    return [name, []];
  } else {
    return [base, possibleMixinKeys];
  }
};
var createWithMixins = (mixins, { delimeter }) => {
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
    return new Proxy(
      {},
      {
        get: (_t, cleanKey) => {
          const [originalKey, appliedMixinsKeys] = applicationMap.get(cleanKey);
          const style = { ...styles[originalKey] };
          const colorScheme = Appearance.getColorScheme();
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
      }
    );
  };
};
export {
  createUseMixins,
  createWithMixins,
  getSeparateKeysGlobal
};
