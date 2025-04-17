import {
  CloseButton,
  CloseIcon,
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "src/components/Viewer/InformationPanelV2/InformationPanelV2.styled";
import React, { useEffect, useState } from "react";
import { AnnotationNormalized } from "@iiif/presentation-3";
import { useViewerDispatch, useViewerState } from "src/context/viewer-context";

interface InformationPanelV2Props {
  annotations: Array<AnnotationNormalized>;
}

export const InformationPanelV2: React.FC<InformationPanelV2Props> = ({
  annotations,
}) => {
  const { selectedAnnotationId } = useViewerState();
  const [selectedAnnotation, setSelectedAnnotation] =
    useState<AnnotationNormalized | null>(null);
  const [selectedAnnotationText, setSelectedAnnotationText] = useState<
    string | null
  >(null);
  const [selectedAnnotationImage, setSelectedAnnotationImage] = useState<
    string | null
  >(null);
  const viewerDispatch: any = useViewerDispatch();

  // TODO: handle weird type errors
  useEffect(() => {
    if (selectedAnnotationId) {
      const newSelectedAnnotation: any = annotations.find(
        (annotation) => annotation.id === selectedAnnotationId,
      );
      setSelectedAnnotation(newSelectedAnnotation ?? null);
      if (newSelectedAnnotation) {
        if (Array.isArray(newSelectedAnnotation.body)) {
          // TODO: Handle multilingual
          const text = newSelectedAnnotation.body.find(
            (body) => body.type === "TextualBody",
          )?.value;
          const image = newSelectedAnnotation.body.find(
            (body) => body.type === "Image",
          )?.id;
          setSelectedAnnotationText(text ?? null);
          setSelectedAnnotationImage(image ?? null);
        } else {
          const text =
            newSelectedAnnotation.body.type === "TextualBody"
              ? newSelectedAnnotation.body.value
              : null;
          const image =
            newSelectedAnnotation.body.type === "Image"
              ? newSelectedAnnotation.body.id
              : null;
          setSelectedAnnotationText(text ?? null);
          setSelectedAnnotationImage(image ?? null);
        }
      }
    } else {
      setSelectedAnnotation(null);
      setSelectedAnnotationText(null);
      setSelectedAnnotationImage(null);
    }
  }, [selectedAnnotationId, annotations]);

  const onClose = () => {
    viewerDispatch({
      type: "updateSelectedAnnotation",
      selectedAnnotationId: null,
    });
    // TODO: reset to default zoom?
  };

  // Don't show panel if no annotation is selected
  if (!selectedAnnotation) {
    return null;
  }

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>{selectedAnnotation.label?.["en"] ?? ""}</PanelTitle>
        <CloseButton onClick={onClose}>
          {/* TODO: svg? */}
          <CloseIcon>×</CloseIcon>
        </CloseButton>
      </PanelHeader>
      <PanelContent>
        {/* Text */}
        <div
          dangerouslySetInnerHTML={{ __html: selectedAnnotationText ?? "" }}
        ></div>

        {/* Image */}
        {selectedAnnotationImage && (
          <img
            src={selectedAnnotationImage}
            alt="Annotation"
            style={{
              maxWidth: "100%",
              maxHeight: "calc(100% - 40px)",
              marginTop: "10px",
              borderRadius: "5px",
            }}
          />
        )}
      </PanelContent>
    </Panel>
  );
};

export default InformationPanelV2;
