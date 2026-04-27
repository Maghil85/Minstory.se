/**
 * Minstory Design System & Theme
 * Mjuk, elegant färgpalett för personliga berättelser
 */

export const colors = {
  // Primär guld (magisk)
  primary: "#F59E0B",
  primaryLight: "#FCD34D",
  primaryDark: "#D97706",

  // Accent guld
  accent: "#F59E0B",
  accentLight: "#FCD34D",
  accentDark: "#D97706",

  // Pastell påfyllning - varm/guldig
  pastelLila: "#FFF7E6",
  pastelBlue: "#FFF3D6",
  pastelPink: "#FFEED4",
  pastelGreen: "#FFF8E8",

  // Neutrala - varm bakgrund
  white: "#FFFFFF",
  light: "#FFFBF2",
  lightGray: "#FFF7E6",
  gray: "#FFF1D6",
  mediumGray: "#D4D4D4",
  darkGray: "#999999",
  text: "#1F2937",
  textLight: "#6B7280",
  textLighter: "#999999",
  border: "#F3E2B8",

  // Dark mode
  darkBg: "#0B0B10",
  darkInput: "rgba(255,255,255,0.06)",
  darkBorder: "rgba(255,255,255,0.18)",

  // Accent
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
};

export const fonts = {
  size: {
    xs: "12px",
    sm: "13px",
    base: "14px",
    md: "15px",
    lg: "16px",
    xl: "18px",
    "2xl": "20px",
    "3xl": "24px",
    "4xl": "34px",
    "5xl": "52px",
  },
  weight: {
    normal: 400,
    medium: 600,
    semibold: 700,
    bold: 800,
    extrabold: 900,
  },
};

export const spacing = {
  xs: "6px",
  sm: "10px",
  md: "12px",
  lg: "16px",
  xl: "18px",
  "2xl": "24px",
  "3xl": "28px",
  "4xl": "32px",
  "5xl": "60px",
};

export const radius = {
  sm: "8px",
  md: "12px",
  lg: "14px",
  xl: "16px",
  "2xl": "18px",
  full: "999px",
};

export const shadows = {
  sm: "0 2px 4px rgba(0,0,0,0.04)",
  md: "0 4px 12px rgba(0,0,0,0.06)",
  lg: "0 10px 30px rgba(0,0,0,0.06)",
  xl: "0 15px 40px rgba(0,0,0,0.08)",
};

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

/**
 * Typiska story-ämnen för design inspiration
 */
export const storyTypes = [
  {
    id: "fairy-tale",
    name: "Barnsaga",
    description: "En magisk saga där barnet är hjälten",
    color: "#FFD4EA",
    icon: "✨",
  },
  {
    id: "love-story",
    name: "Kärlekshistoria",
    description: "En romantisk historia för par",
    color: "#FFE8F0",
    icon: "💕",
  },
  {
    id: "adventure",
    name: "Äventyr",
    description: "Spännande äventyr och utmaningar",
    color: "#E3F0FF",
    icon: "🗺️",
  },
  {
    id: "humor",
    name: "Humoristisk berättelse",
    description: "En rolig och skrattretande historia",
    color: "#FFF4E3",
    icon: "😄",
  },
  {
    id: "life-story",
    name: "Livsberättelse",
    description: "En personlig livsresa och minnen",
    color: "#E8E5FF",
    icon: "📖",
  },
  {
    id: "custom",
    name: "Anpassad berättelse",
    description: "Helt fri skapande utan begränsningar",
    color: "#E8F5E9",
    icon: "🎨",
  },
];
