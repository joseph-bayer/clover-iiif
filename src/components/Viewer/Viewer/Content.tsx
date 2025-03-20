import {
  AnnotationNormalized,
  AnnotationPageNormalized,
  Canvas,
  IIIFExternalWebResource,
} from "@iiif/presentation-3";
import { AnnotationResource, AnnotationResources } from "src/types/annotations";
import {
  CollapsibleTrigger,
  Content,
  Main,
  MediaWrapper,
} from "src/components/Viewer/Viewer/Viewer.styled";

import Media from "src/components/Viewer/Media/Media";
import Painting from "../Painting/Painting";
import React from "react";
import { useTranslation } from "react-i18next";
import { useViewerState } from "src/context/viewer-context";
import InformationPanelV2 from "../InformationPanelV2/InformationPanelV2";

export interface ViewerContentProps {
  activeCanvas: string;
  annotationResources: AnnotationResources;
  searchServiceUrl?: string;
  setContentSearchResource: React.Dispatch<
    React.SetStateAction<AnnotationPageNormalized | undefined>
  >;
  contentSearchResource?: AnnotationResource;
  painting: IIIFExternalWebResource[];
  items: Canvas[];
  isAudioVideo: boolean;
  annotations: Array<AnnotationNormalized>;
  handleAnnotationClickCallback: any; // TODO: type
}

const ViewerContent: React.FC<ViewerContentProps> = ({
  activeCanvas,
  annotationResources,
  isAudioVideo,
  items,
  painting,
  annotations,
  handleAnnotationClickCallback,
}) => {
  const { t } = useTranslation();
  const { isInformationOpen, configOptions } = useViewerState();
  const { informationPanel } = configOptions;

  /**
   * The information panel should be rendered if toggled true and if
   * there is content (About or Supplementing Resources) to display.
   */

  const isAside = informationPanel?.renderAbout && isInformationOpen;

  // const isForcedAside =
  //   informationPanel?.renderAnnotation &&
  //   annotationResources.length > 0 &&
  //   !informationPanel.open;
  return (
    <Content
      className="clover-viewer-content"
      data-testid="clover-viewer-content"
    >
      <Main>
        <Painting
          activeCanvas={activeCanvas}
          annotationResources={annotationResources}
          isMedia={isAudioVideo}
          painting={painting}
          annotations={annotations}
          handleAnnotationClickCallback={handleAnnotationClickCallback}
        />

        {isAside && (
          <CollapsibleTrigger>
            <span>{t("informationPanelToggle")}</span>
          </CollapsibleTrigger>
        )}

        {items.length > 1 && (
          <MediaWrapper className="clover-viewer-media-wrapper">
            <Media items={items} activeItem={0} />
          </MediaWrapper>
        )}
      </Main>

      <InformationPanelV2 annotations={annotations} />
      {/* {isAside ||
        (isForcedAside && (
          // TODO: make aside float over Painting
          <Aside>
            <CollapsibleContent>
              <InformationPanel
                activeCanvas={activeCanvas}
                annotationResources={annotationResources}
                searchServiceUrl={searchServiceUrl}
                setContentSearchResource={setContentSearchResource}
                contentSearchResource={contentSearchResource}
              />
            </CollapsibleContent>
          </Aside>
        ))} */}
    </Content>
  );
};

export default ViewerContent;
