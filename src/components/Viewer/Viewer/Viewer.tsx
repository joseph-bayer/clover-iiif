import * as Collapsible from "@radix-ui/react-collapsible";

import { AnnotationResource, AnnotationResources } from "src/types/annotations";
import {
  Annotation,
  AnnotationNormalized,
  CanvasNormalized,
  ExternalResourceTypes,
  InternationalString,
  ManifestNormalized,
} from "@iiif/presentation-3";
import React, { useCallback, useEffect, useState } from "react";
import {
  ViewerContextStore,
  useViewerDispatch,
  useViewerState,
} from "src/context/viewer-context";
import {
  addContentSearchOverlays,
  panToTarget,
  removeOverlaysFromViewer,
} from "src/lib/openseadragon-helpers";
import {
  getAnnotationResources,
  getContentSearchResources,
  getPaintingResource,
} from "src/hooks/use-iiif";

import { ContentSearchQuery } from "src/types/annotations";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "src/components/UI/ErrorFallback/ErrorFallback";
import { IIIFExternalWebResource } from "@iiif/presentation-3";
import ViewerContent from "src/components/Viewer/Viewer/Content";
import ViewerHeader from "src/components/Viewer/Viewer/Header";
import { Wrapper } from "src/components/Viewer/Viewer/Viewer.styled";
import { media } from "src/styles/stitches.config";
import { useBodyLocked } from "src/hooks/useBodyLocked";
import { useMediaQuery } from "src/hooks/useMediaQuery";

interface ViewerProps {
  manifest: ManifestNormalized;
  theme?: unknown;
  iiifContentSearchQuery?: ContentSearchQuery;
}

const Viewer: React.FC<ViewerProps> = ({
  manifest,
  theme,
  iiifContentSearchQuery,
}) => {
  /**
   * Viewer State
   */
  const viewerState: ViewerContextStore = useViewerState();
  const viewerDispatch: any = useViewerDispatch();
  const {
    activeCanvas,
    isInformationOpen,
    vault,
    contentSearchVault,
    configOptions,
    openSeadragonViewer,
    selectedAnnotationId,
    unVaultedIIIFContent,
  } = viewerState;

  const absoluteCanvasHeights = ["100%", "auto"];
  const isAbsolutePosition =
    configOptions?.canvasHeight &&
    absoluteCanvasHeights.includes(configOptions?.canvasHeight);

  /**
   * Local state
   */
  const [isInformationPanel, setIsInformationPanel] = useState<boolean>(false);
  const [isAudioVideo, setIsAudioVideo] = useState(false);
  const [painting, setPainting] = useState<IIIFExternalWebResource[]>([]);
  const [annotationResources, setAnnotationResources] =
    useState<AnnotationResources>([]);
  const [contentSearchResource, setContentSearchResource] =
    useState<AnnotationResource>();

  const [isBodyLocked, setIsBodyLocked] = useBodyLocked(false);
  const isSmallViewport = useMediaQuery(media.sm);
  const [searchServiceUrl, setSearchServiceUrl] = useState();

  const setInformationOpen = useCallback(
    (open: boolean) => {
      viewerDispatch({
        type: "updateInformationOpen",
        isInformationOpen: open,
      });
    },
    [viewerDispatch],
  );

  /** Retrieve annotations from Vault */
  const annotations: Array<AnnotationNormalized> = [];
  annotationResources[0]?.items?.forEach((item) => {
    // Hack: The vault removes data from annotations for some reason. We are using unVaultedIIIFContent so we know that we have all the data we need
    const annotationResource =
      unVaultedIIIFContent?.items[0].annotations?.[0].items?.find(
        (annotationItem) => item.id === annotationItem.id,
      ) as Annotation;
    annotations.push(annotationResource as unknown as AnnotationNormalized);
  });

  /** Update Selected Annotation in viewer context */
  const handleAnnotationClickCallback = (annotationId: string) => {
    viewerDispatch({
      type: "updateSelectedAnnotation",
      selectedAnnotationId: annotationId,
    });

    // Pan to the selected annotation
    const canvas = vault.get({
      id: activeCanvas,
      type: "Canvas",
    }) as CanvasNormalized;
    const zoomLevel = configOptions.annotationOverlays?.zoomLevel || 1;
    const annotation = annotations.find(
      (annotation) => annotation.id === annotationId,
    )?.target;
    panToTarget(openSeadragonViewer, zoomLevel, annotation, canvas, -200);
  };

  useEffect(() => {
    if (configOptions?.informationPanel?.open) {
      setInformationOpen(!isSmallViewport);
    }
  }, [
    isSmallViewport,
    configOptions?.informationPanel?.open,
    setInformationOpen,
  ]);

  useEffect(() => {
    if (!isSmallViewport) {
      setIsBodyLocked(false);
      return;
    }
    setIsBodyLocked(isInformationOpen);
  }, [isInformationOpen, isSmallViewport, setIsBodyLocked]);

  useEffect(() => {
    const painting = getPaintingResource(vault, activeCanvas);

    if (painting) {
      setIsAudioVideo(
        ["Sound", "Video"].indexOf(painting[0].type as ExternalResourceTypes) >
          -1
          ? true
          : false,
      );
      setPainting(painting);
    }
    getAnnotationResources(vault, activeCanvas).then((resources) => {
      if (resources.length > 0) {
        viewerDispatch({
          type: "updateInformationOpen",
          isInformationOpen: true,
        });
      }
      setAnnotationResources(resources);
      setIsInformationPanel(resources.length !== 0);
    });
  }, [activeCanvas, annotationResources.length, vault, viewerDispatch]);

  const hasSearchService = manifest.service.some(
    (service: any) => service.type === "SearchService2",
  );

  // check if search service exists in the manifest
  useEffect(() => {
    if (hasSearchService) {
      const searchService: any = manifest.service.find(
        (service: any) => service.type === "SearchService2",
      );
      if (searchService) {
        setSearchServiceUrl(searchService.id);
      }
    }
  }, [manifest, hasSearchService]);

  // make request to content search service using iiifContentSearchQuery prop
  useEffect(() => {
    if (!searchServiceUrl) return;
    if (configOptions.informationPanel?.renderContentSearch === false) return;

    getContentSearchResources(
      contentSearchVault,
      searchServiceUrl,
      configOptions.localeText?.contentSearch?.tabLabel as string,
      iiifContentSearchQuery,
    ).then((contentSearch) => {
      setContentSearchResource(contentSearch);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchServiceUrl]);

  // add overlays for content search
  useEffect(() => {
    if (!openSeadragonViewer) return;
    if (!contentSearchResource) return;

    const canvas = vault.get({
      id: activeCanvas,
      type: "Canvas",
    }) as CanvasNormalized;

    removeOverlaysFromViewer(
      openSeadragonViewer,
      "content-search-overlay",
      handleAnnotationClickCallback,
    );
    addContentSearchOverlays(
      contentSearchVault,
      contentSearchResource,
      openSeadragonViewer,
      canvas,
      configOptions,
      handleAnnotationClickCallback,
      selectedAnnotationId ?? "",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSeadragonViewer, contentSearchResource]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Wrapper
        className={`${theme} clover-viewer`}
        css={{ background: configOptions?.background }}
        data-body-locked={isBodyLocked}
        data-absolute-position={isAbsolutePosition}
        data-information-panel={isInformationPanel}
        data-information-panel-open={isInformationOpen}
      >
        <Collapsible.Root
          open={isInformationOpen}
          onOpenChange={setInformationOpen}
        >
          <ViewerHeader
            manifestLabel={manifest.label as InternationalString}
            manifestId={manifest.id}
          />
          <ViewerContent
            activeCanvas={activeCanvas}
            painting={painting}
            annotationResources={annotationResources}
            searchServiceUrl={searchServiceUrl}
            setContentSearchResource={setContentSearchResource}
            contentSearchResource={contentSearchResource}
            items={manifest.items}
            isAudioVideo={isAudioVideo}
            annotations={annotations}
            handleAnnotationClickCallback={handleAnnotationClickCallback}
          />
        </Collapsible.Root>
      </Wrapper>
    </ErrorBoundary>
  );
};

export default Viewer;
