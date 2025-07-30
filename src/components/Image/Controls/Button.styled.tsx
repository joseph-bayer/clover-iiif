import { styled } from "src/styles/stitches.config";

const Item = styled("button", {
  display: "flex",
  height: "2.5rem",
  width: "2.5rem",
  borderRadius: "2.5rem",
  padding: "0",
  margin: "0",
  fontFamily: "inherit",
  background: "none",
  backgroundColor: "black",
  border: "2px solid white",
  cursor: "pointer",
  marginLeft: "0.618rem",
  boxShadow: "black 0px 0px 8px 0px",
  transition: "$all",
  boxSizing: "content-box !important",

  "&:first-child": {
    marginLeft: "0",
  },

  "@sm": {
    marginBottom: "0.618rem",
    marginLeft: "0",

    "&:last-child": {
      marginBottom: "0",
    },
  },

  svg: {
    height: "60%",
    width: "60%",
    padding: "20%",
    fill: "white",
    stroke: "white",
    filter: "drop-shadow(2px 2px 5px #0003)",
    transition: "$all",
    boxSizing: "inherit",
  },

  "&:hover": {
    backgroundColor: "rgb(61, 17, 13)",
    borderColor: "rgb(224, 89, 42)",
    svg: {
      fill: "rgb(224, 89, 42)",
      stroke: "rgb(224, 89, 42)",
    },
  },

  "&:focus, &:focus-visible": {
    outline: "2px solid #60a5fa",
    outlineOffset: "2px",
    boxShadow: "inherit",
    transition: "none",
  },

  "&[data-button=rotate-right]": {
    "&:hover, &:focus": {
      svg: {
        rotate: "45deg",
      },
    },
  },

  "&[data-button=rotate-left]": {
    transform: "scaleX(-1)",

    "&:hover, &:focus": {
      svg: {
        rotate: "45deg",
      },
    },
  },

  "&[data-button=reset]": {
    svg: {
      paddingLeft: "22%",
    },
  },

  "&[data-button=zoom-in]": {
    svg: {
      paddingLeft: "18%",
    },
  },

  "&[data-button=zoom-out]": {
    svg: {
      paddingLeft: "18%",
    },
  },
});

export { Item };
