# react-native-style-suffixes #

Library for convinient management of themed colors in react native styles.

Just define themed colors mixins and add these mixins names as suffixes to style names. Then use these style names without suffixes to your components views. Names are type safe, your editor will suggest you the right ones.

## Example ##
- define `withMixins` (see `./withMixins.ts`)
- apply mixins to style names (see `./App.tsx`, `./button.tsx`)

## Example code ##
Another example with complete code:
```tsx
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { Appearance, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { createWithMixins } from 'react-native-style-suffixes';

export default function App() {
  const colorScheme = useColorScheme();

  const changeColorScheme = useCallback(() => {
    Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.mainText}>current color scheme: {colorScheme}</Text>
      <TouchableOpacity onPress={changeColorScheme}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Change color scheme</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const withMixins = createWithMixins({
  bg: {backgroundColor: {dark: "#000", light: "#fff"}}, // app default background
  bgi: {backgroundColor: {dark: "#fff", light: "#000"}}, // inverted background
  t: {color: {dark: "#fff", light: "#000"}}, // default text color
  ti: {color: {dark: "#000", light: "#fff"}}, // inverted text color
}, {delimeter: "_"})

const styles = withMixins(StyleSheet.create({
  container_bg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_bgi: {
    padding: 15,
    borderColor: "lightgreen",
    borderWidth: 3,
    borderRadius: 10,
  },
  mainText_t: {
    marginBottom: 20,
  },
  buttonText_ti: {},
}));
```

## Settings ##
- you can set any delimeter in the second argument of `createWithMixins`, so original keys of `Stylesheet.create` could be something like this:
  - `block invertedBackground` (delimeter is one space, final style key would be `block`)
  - `description < textColor` (delimeter is ` < `, final style key would be `description`)

## Behavior ##

### Errors ###
- If base name, cleaned of suffixes, is empty, error would be thrown.
- If two or more base names, cleaned of suffixes, are equal, error would be thrown.
- If even one suffix in style name is misspelled, error would be thrown.

## Known Issues ##
- you can apply text style property to a `View` and you won`t get typescript error
