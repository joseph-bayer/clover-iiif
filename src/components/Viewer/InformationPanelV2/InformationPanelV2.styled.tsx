import { styled } from "src/styles/stitches.config";

const Panel = styled("div", {
  position: "absolute",
  left: "1rem",
  top: "132px",
  bottom: "50px",
  width: "33%",
  backgroundColor: "black",
  border: "2px solid white",
  borderRadius: "10px",
  padding: "20px 0 20px 20px",
  boxSizing: "border-box",
  color: "white",
  display: "flex",
  flexDirection: "column",
  maxHeight: "calc(100% - 150px - 50px)", // Adjusted for the top and bottom spacing
  height: "fit-content",
  boxShadow: "black 0px 0px 8px 0px",

  "&:focus": {
    outline: "2px solid #60a5fa",
    outlineOffset: "2px",
  },

  "@sm": {
    width: "50%",
    left: "15px",
    top: "15px",
    bottom: "15px",
    maxHeight: "calc(100% - 30px)", // Adjusted for the top and bottom spacing
  },
});

const PanelHeader = styled("div", {
  position: "relative",
  minHeight: "36px",
  marginBottom: "10px",
  flexShrink: 0,
});

const PanelTitle = styled("div", {
  fontWeight: "600",
  fontSize: "20px",
  paddingRight: "60px", // Space for close button
});

const PanelContent = styled("div", {
  position: "relative",
  overflowY: "auto",
  paddingRight: "10px",
  paddingBottom: "20px",
  flex: "1 1 auto",
  minHeight: 0,
});

const PanelContentWrapper = styled("div", {
  "&:focus": {
    outline: "2px solid #60a5fa",
    outlineOffset: "2px",
  },
});

const CloseButton = styled("button", {
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
  transition: "$all",

  "&:hover": {
    backgroundColor: "rgb(61, 17, 13)",
    borderColor: "rgb(224, 89, 42)",
  },
});

const CloseIcon = styled("span", {
  fontSize: "20px",
  lineHeight: "1",
  transition: "$all",
  svg: {
    transition: "$all",
    fill: "white",
    padding: "3px 2px 3px 3px",
  },

  [`${CloseButton}:hover &`]: {
    fill: "rgb(224, 89, 42)",
    svg: {
      fill: "rgb(224, 89, 42)",
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
  PanelContentWrapper,
  CloseButton,
  CloseIcon,
  CaptionText,
};
