export interface ITheme {
  label: string;
  value: string;
  isFavorite?: boolean;
  light?: boolean;
}

export const CODE_THEMES: ITheme[] = [
  {
    label: "Ayu Dark",
    value: "ayu-dark",
    isFavorite: true
  },
  {
    label: "Aurora X",
    value: "aurora-x",
    isFavorite: true
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
    isFavorite: true
  },
  {
    label: "LaserWave",
    value: "laserwave"
  },
  {
    label: "Vitesse Light",
    value: "vitesse-light",
    light: true
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
    isFavorite: true
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
    label: "Gruvbox Dark Medium",
    value: "gruvbox-dark-medium"
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
    isFavorite: true
  },
  {
    label: "GitHub Dark",
    value: "github-dark"
  },
  {
    label: "GitHub Dark Default",
    value: "github-dark-default",
    isFavorite: true
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
    label: "Everforest Dark",
    value: "everforest-dark"
  },
  {
    label: "Solarized Dark",
    value: "solarized-dark"
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
    label: "Rose Pine Dawn",
    value: "rose-pine-dawn",
    light: true
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
    isFavorite: true
  }
];

export const LIGHT_THEMES: ITheme[] = CODE_THEMES.filter(t => t.light);
