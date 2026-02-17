export interface ITheme {
  label: string;
  value: string;
  favorite?: boolean;
  light?: boolean;
}

export const CODE_THEMES: ITheme[] = [
  {
    label: "Ayu Dark",
    value: "ayu-dark",
    favorite: true
  },
  {
    label: "Aurora X",
    value: "aurora-x",
    favorite: true
  },
  {
    label: "Dracula",
    value: "dracula"
  },
  {
    label: "Andromeeda",
    value: "andromeeda"
  },
  {
    label: "Houston",
    value: "houston",
    favorite: true
  },
  {
    label: "LaserWave",
    value: "laserwave"
  },
  {
    label: "Vitesse Dark",
    value: "vitesse-dark"
  },
  {
    label: "Vitesse Black",
    value: "vitesse-black"
  },
  {
    label: "Vesper(Default)",
    value: "vesper",
    favorite: true
  },
  {
    label: "Poimandres",
    value: "poimandres"
  },
  {
    label: "Tokyo Night",
    value: "tokyo-night"
  },
  {
    label: "Synthwave 84",
    value: "synthwave-84"
  },
  {
    label: "Kanagawa Dragon",
    value: "kanagawa-dragon"
  },
  {
    label: "Kanagawa Wave",
    value: "kanagawa-wave"
  },

  {
    label: "Light Plus",
    value: "light-plus",
    light: true
  },
  {
    label: "Gruvbox Dark Hard",
    value: "gruvbox-dark-hard"
  },
  {
    label: "Material Theme",
    value: "material-theme"
  },
  {
    label: "Material Theme Darker",
    value: "material-theme-darker"
  },
  {
    label: "Material Theme Ocean",
    value: "material-theme-ocean",
    favorite: true
  },
  {
    label: "GitHub Dark",
    value: "github-dark-default",
    favorite: true
  },
  {
    label: "GitHub Light Default",
    value: "github-light-default",
    light: true
  },
  {
    label: "GitHub Dark High Contrast",
    value: "github-dark-high-contrast"
  },
  {
    label: "Slack Dark",
    value: "slack-dark"
  },
  {
    label: "Rose Pine Moon",
    value: "rose-pine-moon"
  },
  {
    label: "Rose Pine",
    value: "rose-pine"
  },
  {
    label: "Dark Plus",
    value: "dark-plus"
  },
  {
    label: "Night Owl",
    value: "night-owl"
  },
  {
    label: "Catppuccin Mocha",
    value: "catppuccin-mocha"
  },
  {
    label: "Catppuccin Macchiato",
    value: "catppuccin-macchiato"
  },
  {
    label: "One Dark Pro",
    value: "one-dark-pro",
    favorite: true
  }
];

export const LIGHT_THEMES: ITheme[] = CODE_THEMES.filter(t => t.light);

export const THEME_PRIMARY_BG = {
  andromeeda: "#23262e",
  "aurora-x": "#07090f",
  "ayu-dark": "#0b0e14",
  dracula: "#282a36",
  houston: "#17191e",
  laserwave: "#27212e",
  "vitesse-dark": "#121212",
  "vitesse-black": "#000000",
  vesper: "#101010",
  poimandres: "#1b1e28",
  "tokyo-night": "#1a1b26",
  "synthwave-84": "#262335",
  "kanagawa-dragon": "#181616",
  "kanagawa-wave": "#1f1f28",
  "light-plus": "#ffffff",
  "gruvbox-dark-hard": "#1d2021",
  "material-theme": "#263238",
  "material-theme-darker": "#212121",
  "material-theme-ocean": "#0f111a",
  "github-dark-default": "#0d1117",
  "github-light-default": "#ffffff",
  "github-dark-high-contrast": "#0a0c10",
  "slack-dark": "#222222",
  "rose-pine-moon": "#232136",
  "rose-pine": "#191724",
  "dark-plus": "#1e1e1e",
  "night-owl": "#011627",
  "catppuccin-mocha": "#1e1e2e",
  "catppuccin-macchiato": "#24273a",
  "one-dark-pro": "#282c34"
};
