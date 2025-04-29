import {
  Annotation,
  AnnotationNormalized,
  IIIFExternalWebResource,
  type CanvasNormalized,
  AnnotationPageNormalized,
} from "@iiif/presentation-3";
import OpenSeadragon from "openseadragon";
import {
  type OverlayOptions,
  type ViewerConfigOptions,
} from "src/context/viewer-context";
import { OsdSvgOverlay } from "src/lib/openseadragon-svg";
import { parseAnnotationTarget } from "src/lib/annotation-helpers";

import { ParsedAnnotationTarget } from "src/types/annotations";
import { getImageServiceURI } from "src/lib/iiif";
import { OpenSeadragonImageTypes } from "src/types/open-seadragon";

export function addOverlaysToViewer(
  viewer: OpenSeadragon.Viewer,
  canvas: CanvasNormalized,
  configOptions: OverlayOptions,
  annotations: Annotation[] | AnnotationNormalized[],
  overlaySelector: string,
  handleAnnotationClickCallback: any,
  selectedAnnotationId?: string,
): void {
  if (!viewer) return;

  const scale = 1 / canvas.width;

  annotations.forEach((annotation) => {
    if (!annotation.target) return;

    const parsedAnnotationTarget = parseAnnotationTarget(annotation.target);
    const { point, rect, svg } = parsedAnnotationTarget;

    if (rect) {
      const { x, y, w, h } = rect;
      addRectangularOverlay(
        viewer,
        x * scale,
        y * scale,
        w * scale,
        h * scale,
        configOptions,
        overlaySelector,
      );
    }

    if (point) {
      const { x, y } = point;
      addPointOverlay(
        viewer,
        x,
        y,
        configOptions,
        overlaySelector,
        annotation,
        handleAnnotationClickCallback,
        selectedAnnotationId,
      );
    }

    if (svg) {
      addSvgOverlay(viewer, svg, configOptions, scale, overlaySelector);
    }
  });
}

export function createOpenSeadragonRect(
  canvas: CanvasNormalized,
  parsedAnnotationTarget: ParsedAnnotationTarget,
  zoomLevel: number,
  xOffset: number = 0,
) {
  let x,
    y,
    w = 40,
    h = 40;

  if (parsedAnnotationTarget.rect) {
    x = parsedAnnotationTarget.rect.x;
    y = parsedAnnotationTarget.rect.y;
    w = parsedAnnotationTarget.rect.w;
    h = parsedAnnotationTarget.rect.h;
  }

  if (parsedAnnotationTarget.point) {
    x = parsedAnnotationTarget.point.x;
    y = parsedAnnotationTarget.point.y;
  }

  // TODO: How to handle SVG where no rect or point exists?
  // @ts-ignore
  if (parseAnnotationTarget.svg) {
  }

  const scale = 1 / canvas.width;
  const rect = new OpenSeadragon.Rect(
    x * scale + xOffset * scale - ((w * scale) / 2) * (zoomLevel - 1),
    y * scale - ((h * scale) / 2) * (zoomLevel - 1),
    w * scale * zoomLevel,
    h * scale * zoomLevel,
  );

  return rect;
}

/**
 * Add a rectangular overlay to an OpenSeadragon viewer
 */
function addRectangularOverlay(
  viewer: OpenSeadragon.Viewer,
  x: number,
  y: number,
  w: number,
  h: number,
  configOptions: OverlayOptions,
  overlaySelector: string,
): void {
  const rect = new OpenSeadragon.Rect(x, y, w, h);
  const div = document.createElement("div");

  if (configOptions) {
    const { backgroundColor, opacity, borderType, borderColor, borderWidth } =
      configOptions;

    div.style.backgroundColor = backgroundColor as string;
    div.style.opacity = opacity as string;
    div.style.border = `${borderType} ${borderWidth} ${borderColor}`;
    div.className = overlaySelector;
  }

  viewer.addOverlay(div, rect);
}

// CUSTOM: Make contribution to official library
// Add a point overlay that stays the same size on zoom/pan
function addPointOverlay(
  viewer: OpenSeadragon.Viewer,
  x: number,
  y: number,
  configOptions: OverlayOptions,
  overlaySelector: string,
  annotation: Annotation | AnnotationNormalized,
  handleAnnotationClickCallback: any,
  selectedAnnotationId?: string,
) {
  // Fixed size for the overlay (in pixels)
  const overlaySize = 20; // Example size in pixels

  // Create a div for the overlay
  const overlayElement = document.createElement("button");
  overlayElement.style.width = `${overlaySize}px`;
  overlayElement.style.height = `${overlaySize}px`;
  overlayElement.style.borderRadius = "50%"; // Make it a circle
  overlayElement.style.position = "absolute";
  overlayElement.className = overlaySelector;
  overlayElement.id = annotation.id;
  overlayElement.addEventListener("click", () => {
    handleAnnotationClickCallback(annotation.id);
  });
  overlayElement.addEventListener("touchstart", () => {
    handleAnnotationClickCallback(annotation.id);
  });

  const {
    backgroundColor,
    borderColor,
    highlightedBorderColor,
    highlightedBackgroundColor,
    opacity,
    borderType,
    borderWidth,
  } = configOptions;

  overlayElement.style.opacity = opacity as string;
  overlayElement.style.border = "2px solid white";
  overlayElement.style.outlineOffset = "0";

  if (annotation.id === selectedAnnotationId) {
    overlayElement.style.backgroundColor =
      highlightedBackgroundColor ?? "rgba(249, 207, 72, 1)";
    overlayElement.style.outline = `${borderWidth} ${borderType} ${highlightedBorderColor ?? "rgba(249, 208, 71, 0.7)"}`;
  } else {
    overlayElement.style.backgroundColor = backgroundColor as string;
    overlayElement.style.outline = `${borderWidth} ${borderType} ${borderColor}`;
  }

  // Append the overlay to the viewer's container.
  // By attaching it to the container instead of the viewer itself, the overlay will stay the same size and in the correct place when the viewer is zoomed.
  viewer.container.appendChild(overlayElement);

  // Keep overlay in the correct position on zoom/pan
  const updateOverlayPosition = () => {
    // Convert the image coordinates to viewport coordinates
    const viewportPoint = viewer.viewport.imageToViewportCoordinates(
      new OpenSeadragon.Point(x, y),
    );

    // Convert viewport coordinates to pixel coordinates in the viewer's container
    const pixelPoint =
      viewer.viewport.viewportToViewerElementCoordinates(viewportPoint);

    // Position the overlay absolutely in the viewer's container
    overlayElement.style.left = `${pixelPoint.x - overlaySize / 2}px`; // Center the overlay
    overlayElement.style.top = `${pixelPoint.y - overlaySize / 2}px`; // Center the overlay
  };

  // Update the overlay position on zoom/pan
  viewer.addHandler("viewport-change", updateOverlayPosition);

  // Initial position update
  updateOverlayPosition();
}

function convertSVGStringToHTML(svgString) {
  if (!svgString) return null;
  const template = document.createElement("template");
  template.innerHTML = svgString.trim();
  const result = template.content.children;

  return result[0];
}

export function addSvgOverlay(
  viewer: any,
  svgString: string,
  configOptions: OverlayOptions,
  scale: number,
  overlaySelector: string,
) {
  const svgEl = convertSVGStringToHTML(svgString);
  if (svgEl) {
    for (const child of svgEl.children) {
      svg_processChild(viewer, child, configOptions, scale, overlaySelector);
    }
  }
}

function svg_processChild(
  viewer: any,
  child: ChildNode,
  configOptions: OverlayOptions,
  scale: number,
  overlaySelector: string,
) {
  if (child.nodeName === "#text") {
    svg_handleTextNode(child);
  } else {
    const newElement = svg_handleElementNode(child, configOptions, scale);
    const overlay = OsdSvgOverlay(viewer);
    overlay.node().append(newElement);
    overlay._svg?.setAttribute("class", overlaySelector);

    // BUG: svg with children elements aren't formated correctly.
    child.childNodes.forEach((child) => {
      svg_processChild(viewer, child, configOptions, scale, overlaySelector);
    });
  }
}

export function svg_handleElementNode(
  child: any,
  configOptions: OverlayOptions,
  scale: number,
) {
  let hasStrokeColor = false;
  let hasStrokeWidth = false;
  let hasFillColor = false;
  let hasFillOpacity = false;

  const newElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    child.nodeName,
  );

  if (child.attributes.length > 0) {
    for (let index = 0; index < child.attributes.length; index++) {
      const element = child.attributes[index];
      switch (element.name) {
        case "fill":
          hasFillColor = true;
          break;
        case "stroke":
          hasStrokeColor = true;
          break;
        case "stroke-width":
          hasStrokeWidth = true;
          break;
        case "fill-opacity":
          hasFillOpacity = true;
          break;
      }
      newElement.setAttribute(element.name, element.textContent);
    }
  }

  if (!hasStrokeColor) {
    newElement.style.stroke = configOptions?.borderColor as string;
  }
  if (!hasStrokeWidth) {
    newElement.style.strokeWidth = configOptions?.borderWidth as string;
  }
  if (!hasFillColor) {
    newElement.style.fill = configOptions?.backgroundColor as string;
  }
  if (!hasFillOpacity) {
    newElement.style.fillOpacity = configOptions?.opacity as string;
  }
  newElement.setAttribute("transform", `scale(${scale})`);

  return newElement;
}

function svg_handleTextNode(child: ChildNode) {
  if (!child.textContent) {
    return;
  }
  if (child.textContent.includes("\n")) {
    return;
  }
  console.log(
    "nodeName:",
    child.nodeName,
    ", textContent:",
    child.textContent,
    ", childNodes.length",
    child.childNodes.length,
  );
}

export const parseImageBody = (body: IIIFExternalWebResource) => {
  const hasImageService =
    Array.isArray(body?.service) && body?.service.length > 0;

  const uri = hasImageService ? getImageServiceURI(body?.service) : body?.id;
  const imageType: OpenSeadragonImageTypes = hasImageService
    ? OpenSeadragonImageTypes.TiledImage
    : OpenSeadragonImageTypes.SimpleImage;

  return {
    uri,
    imageType,
  };
};

export const parseSrc = (src: string, isTiledImage: boolean) => {
  const imageType = isTiledImage
    ? OpenSeadragonImageTypes.TiledImage
    : OpenSeadragonImageTypes.SimpleImage;

  return {
    uri: src,
    imageType,
  };
};
export function removeOverlaysFromViewer(
  viewer: OpenSeadragon.Viewer,
  overlaySelector: string,
  clickHandlerToRemove: any,
) {
  if (!viewer) return;

  if (!overlaySelector.startsWith(".")) {
    overlaySelector = "." + overlaySelector;
  }
  const elements = document.querySelectorAll(overlaySelector);
  if (elements) {
    elements.forEach((element) => {
      element.removeEventListener("click", clickHandlerToRemove);
      element.removeEventListener("touchstart", clickHandlerToRemove);
      viewer.removeOverlay(element);
    });

    // Point annotations need to be removed differently since they are added to the viewer's container, not the viewer itself
    const remainingElements = document.querySelectorAll(overlaySelector);
    if (remainingElements) {
      remainingElements.forEach((element) => {
        element.remove();
      });
    }
  }
}

export function panToTarget(
  openSeadragonViewer,
  zoomLevel,
  target,
  canvas,
  xOffset = 0,
) {
  const parsedAnnotationTarget = parseAnnotationTarget(target);

  const { point, rect, svg } = parsedAnnotationTarget;

  if (point || rect || svg) {
    const rect = createOpenSeadragonRect(
      canvas,
      parsedAnnotationTarget,
      zoomLevel,
      xOffset,
    );
    openSeadragonViewer?.viewport.fitBounds(rect);
  }
}

export function addContentSearchOverlays(
  contentSearchVault: any,
  contentSearch: AnnotationPageNormalized,
  openSeadragonViewer,
  canvas: CanvasNormalized,
  configOptions: ViewerConfigOptions,
  handleAnnotationClickCallback: any,
  selectedAnnotationId: string,
) {
  if (!contentSearch?.items) return;
  if (contentSearch?.items.length === 0) return;

  const annotations: Array<AnnotationNormalized> = [];
  contentSearch.items.forEach((item) => {
    const annotation = contentSearchVault.get(item.id) as AnnotationNormalized;

    if (typeof annotation.target === "string") {
      if (annotation.target.startsWith(canvas.id)) {
        annotations.push(annotation as unknown as AnnotationNormalized);
      }
    }
  });

  if (openSeadragonViewer && configOptions.contentSearch?.overlays) {
    addOverlaysToViewer(
      openSeadragonViewer,
      canvas,
      configOptions.contentSearch.overlays,
      annotations,
      "content-search-overlay",
      handleAnnotationClickCallback,
      selectedAnnotationId,
    );
  }
}
