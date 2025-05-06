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
  padding: "20px 0 20px 20px",
  boxSizing: "border-box",
  color: "white",
  overflowY: "hidden",
  height: "min-content",
  maxHeight: "calc(100% - 150px - 50px)", // Adjusted for top and bottom padding
  display: "flex",
  flexDirection: "column",
});

const PanelHeader = styled("div", {
  position: "relative",
  height: "36px",
  marginBottom: "10px",
  flexShrink: 0,
});

const PanelTitle = styled("div", {
  fontWeight: "600",
  fontSize: "20px",
  paddingRight: "60px", // Space for close button
});

const PanelContent = styled("div", {
  flex: 1,
  overflowY: "auto",
  paddingRight: "10px",
  display: "contents",
});

const CloseButton = styled("div", {
  position: "absolute",
  right: "10px",
  top: "-10px",
  width: "36px",
  height: "36px",
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
  fontSize: "20px",
  lineHeight: "1",
  transition: "all 0.2s ease", // Smooth transition for hover effect

  svg: {
    fill: "white",
    padding: "3px 2px 3px 3px",
  },

  [`${CloseButton}:hover &`]: {
    fill: "black",
    svg: {
      fill: "black",
    },
  },
});

const CaptionText = styled("div", {
  fontWeight: "400",
  fontSize: "16px",
  fontStyle: "italic",
  lineHeight: "100%",
  letterSpacing: "0%",
  marginTop: "1rem",
});

export {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
  CloseButton,
  CloseIcon,
  CaptionText,
};
