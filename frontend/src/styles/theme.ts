import { ITheme, ThemeEnum } from "../types/styled";

import { DefaultTheme } from "styled-components";

export const baseTheme: ITheme = {
  colors: {
    primary: "#659FFF",
    secondary: "#2b2b2b",
    success: "#14BE96",
    danger: "#E84D59",

    bg: "#E5E4E8",
    font: "#19191B",
  },

  media: {
    extraLarge: "(max-width: 1140px)",
    large: "(max-width: 960px)",
    medium: "(max-width: 720px)",
    small: "(max-width: 540px)",
  },
};

export const darkTheme: DefaultTheme = {
  ...baseTheme,
  type: ThemeEnum.dark,

  colors: {
    ...baseTheme.colors,
    bg: "#19191B",
    font: "#E5E4E8",
    primary: "#3b3b3b",
    secondary: "#262629",
  },
};
