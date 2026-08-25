// Letterboxd-inspired dark palette.
// The `primary/secondary/black/gray` keys are kept as backward-compat aliases
// so screens outside the home-screen redesign (favorites, movie detail, auth)
// keep resolving `colors.primary` etc. and inherit the new palette automatically.

const colors = {
  primary: "#14181C",
  surface: "#1F252D",
  surfaceElevated: "#2C3440",
  divider: "#2C3440",
  border: "#3A424D",

  text: {
    DEFAULT: "#FFFFFF",
    muted: "#99AABB",
    dim: "#6C7683",
  },

  accent: {
    green: "#00E054",
    blue: "#40BCF4",
    orange: "#FF8000",
    amber: "#F5C518",
  },

  secondary: {
    DEFAULT: "#FF8000",
    100: "#FF8000",
    200: "#FF8000",
  },
  black: {
    DEFAULT: "#000000",
    100: "#1F252D",
    200: "#14181C",
  },
  gray: {
    100: "#FFFFFF",
    200: "#99AABB",
  },
};

export default colors;
