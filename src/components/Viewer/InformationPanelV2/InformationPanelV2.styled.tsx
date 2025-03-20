import { styled } from "src/styles/stitches.config";

export const Panel = styled("div", {
  position: "absolute",
  left: "50px",
  top: "50px",
  bottom: "50px",
  width: "33%",
  backgroundColor: "black",
  border: "2px solid white",
  borderRadius: "10px",
  padding: "20px",
  boxSizing: "border-box",
  color: "white",
  overflowY: "auto",
});

export const CloseButton = styled("div", {
  position: "absolute",
  right: "10px",
  top: "10px",
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  border: "2px solid white", // Outline for default state
  backgroundColor: "transparent", // Transparent background for default state
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background-color 0.2s ease, border-color 0.2s ease", // Smooth transition for hover effect

  "&:hover": {
    backgroundColor: "white", // Solid white background on hover
    borderColor: "white", // Ensure border color matches background on hover
  },
});

export const CloseIcon = styled("span", {
  color: "white", // White "×" for default state
  fontSize: "20px",
  lineHeight: "1",
  transition: "color 0.2s ease", // Smooth transition for hover effect

  [`${CloseButton}:hover &`]: {
    color: "black", // Black "×" on hover
  },
});
