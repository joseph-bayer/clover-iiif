import { styled } from "src/styles/stitches.config";

const Wrapper = styled("div", {
  position: "absolute",
  zIndex: "1",
  bottom: "1rem",
  right: "1rem",
  display: "flex",

  "@sm": {
    height: "fit-content",
    flexDirection: "column",
    zIndex: "2",
  },

  variants: {
    hasPlaceholder: {
      true: {
        right: "3.618rem",

        "@sm": {
          top: "3.618rem",
          right: "1rem",
        },
      },

      false: {
        right: "1rem",

        "@sm": {
          top: "178px",
          right: "1rem",
        },
      },
    },
  },
});

export { Wrapper };
