import { styled } from "src/styles/stitches.config";

const Panel = styled("div", {
  position: "absolute",
  left: "50px",
  top: "150px",
  bottom: "50px",
  width: "33%",
  backgroundColor: "black",
  border: "2px solid white",
  borderRadius: "10px",
  padding: "20px",
  boxSizing: "border-box",
  color: "white",
  overflowY: "auto",
  maxHeight: "calc(100vh - 150px - 50px)", // Adjusted for top and bottom padding
});

const CloseButton = styled("div", {
  position: "absolute",
  right: "10px",
  top: "10px",
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  border: "2px solid white",
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background-color 0.2s ease, border-color 0.2s ease",

  "&:hover": {
    backgroundColor: "white",
    borderColor: "white",
  },
});

const CloseIcon = styled("span", {
  color: "white",
  fontSize: "20px",
  lineHeight: "1",
  transition: "color 0.2s ease", // Smooth transition for hover effect

  [`${CloseButton}:hover &`]: {
    color: "black",
  },
});

export { Panel, CloseButton, CloseIcon };
