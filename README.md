# react-natvie-style-suffixes #

Library for convinient management of themed colors in react native styles.

Just define themed colors mixins and add these mixins names as suffixes to style names. Then use these style names without suffixes to your components views. Names are type safe, your editor will suggest you the right ones.

## Example ##
- define `withMixins` (see `./withMixins.ts`)
- apply mixins to style names (see `./App.tsx`, `./button.tsx`)

## Settings ##
- you can set any delimeter in the second argument of `createWithMixins`, so original keys of `Stylesheet.create` could be something like this:
  - `block invertedBackground` (delimeter is one space, final style key would be `block`)
  - `description < textColor` (delimeter is ` < `, final style key would be `description`)

## Known Issues ##
- you can apply text style property to a `View` and you won`t get typescript error
