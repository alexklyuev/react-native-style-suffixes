import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";

const ThemeContext = createContext<ColorSchemeName>("light");

const ThemeListenerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [colorSchemeName, setColorSchemeName] = useState(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    const listener = Appearance.addChangeListener((event) => {
      setColorSchemeName(event.colorScheme);
    });
    return () => listener.remove();
  }, []);

  return (
    <ThemeContext.Provider value={colorSchemeName}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeListenerProvider;
