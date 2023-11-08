/**
 * 색상
 */
export const StyleColor = {
  PRIMARY: "#3A79EC",
  EMPHASIS: "#E7EFFD",
  BRIGHTEMPHASIS: "#F5F8FE",
  DARKEMPHASIS: "#4C4E64",
  INFOMATION: "#FFEAE9",
  HOVER: "#F0F0F0",
  DISABLE: "#9C9C9C",
  LIGHT: "#FFFFFF",
  DARK: "#000000",
  WARNNING: "#FF4D49",
  BACKGROUND: "#F7F7F9",
  // DARKBACKGROUND: "#282A42",
  DARKBACKGROUND: "#333",
  POSITIVE: "#71E61A",
  FINISH: "#F2994A",
  BORDER: "#D9D9D9",
  DESCRIPTION: "#858796",
  BOXSHADOW: "0 2px 8px rgba(76, 78, 100, 0.22)",
  DEEPSHADOW: "0 2px 8px rgba(76, 78, 100, 0.42)",
  DARKSHADOW: "0 2px 8px rgba(76, 78, 100, 0.62)",
} as const;
export type StyleColor = (typeof StyleColor)[keyof typeof StyleColor];
