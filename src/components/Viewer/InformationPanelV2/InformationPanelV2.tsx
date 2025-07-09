import {
  CaptionText,
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
import Image from "next/image";

interface InformationPanelV2Props {
  annotations: Array<AnnotationNormalized>;
}

export const InformationPanelV2: React.FC<InformationPanelV2Props> = ({
  annotations,
}) => {
  const { selectedAnnotationId, activeLanguageCode, configOptions } =
    useViewerState();
  const [selectedAnnotation, setSelectedAnnotation] =
    useState<AnnotationNormalized | null>(null);
  const [selectedAnnotationText, setSelectedAnnotationText] = useState<
    any | null
  >(null);
  const [selectedAnnotationImage, setSelectedAnnotationImage] = useState<
    any | null
  >(null);
  const viewerDispatch: any = useViewerDispatch();

  useEffect(() => {
    if (selectedAnnotationId) {
      const newSelectedAnnotation: any = annotations.find(
        (annotation) => annotation.id === selectedAnnotationId,
      );
      setSelectedAnnotation(newSelectedAnnotation ?? null);
      if (newSelectedAnnotation) {
        if (Array.isArray(newSelectedAnnotation.body)) {
          const text = newSelectedAnnotation.body.find(
            (body) =>
              body.type === "TextualBody" &&
              body.language === activeLanguageCode,
          );
          const image = newSelectedAnnotation.body.find(
            (body) => body.type === "Image",
          );
          setSelectedAnnotationText(text ?? null);
          setSelectedAnnotationImage(image ?? null);
        } else {
          const text =
            newSelectedAnnotation.body.type === "TextualBody"
              ? newSelectedAnnotation.body.value
              : null;
          const image =
            newSelectedAnnotation.body.type === "Image"
              ? newSelectedAnnotation.body
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
  }, [selectedAnnotationId, annotations, activeLanguageCode]);

  const onClose = () => {
    viewerDispatch({
      type: "updateSelectedAnnotation",
      selectedAnnotationId: null,
    });
  };

  // Don't show panel if no annotation is selected
  if (!selectedAnnotation) {
    return null;
  }

  return (
    <Panel
      css={{
        borderColor:
          configOptions.annotationOverlays?.highlightedBackgroundColor,
      }}
    >
      <PanelHeader>
        <PanelTitle>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedAnnotationText?.label ?? "",
            }}
          ></div>
        </PanelTitle>
        <CloseButton
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
            }
          }}
          onPointerUp={onClose}
        >
          <CloseIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="inherit"
            >
              <path
                d="M2.32639 21.1111L0.25 19.0347L8.55556 10.7291L0.25 2.42356L2.32639 0.347168L10.6319 8.65272L18.9375 0.347168L21.0139 2.42356L12.7083 10.7291L21.0139 19.0347L18.9375 21.1111L10.6319 12.8055L2.32639 21.1111Z"
                fill="inherit"
              />
            </svg>
          </CloseIcon>
        </CloseButton>
      </PanelHeader>
      <PanelContent>
        <div style={{ position: "relative" }}>
          {/* Text */}
          <div
            dangerouslySetInnerHTML={{
              __html: selectedAnnotationText?.value ?? "",
            }}
          ></div>

          {/* Image */}
          {selectedAnnotationImage && (
            <>
              <Image
                src={selectedAnnotationImage.id}
                alt="Annotation"
                width={500}
                height={500}
                style={{
                  maxWidth: "100%",
                  maxHeight: "calc(100% - 40px)",
                  marginTop: "10px",
                  borderRadius: "5px",
                }}
              />
              {selectedAnnotationImage.label && (
                <CaptionText>
                  {selectedAnnotationImage.label[activeLanguageCode ?? "en"] ??
                    ""}
                </CaptionText>
              )}
            </>
          )}
        </div>
      </PanelContent>
    </Panel>
  );
};

export default InformationPanelV2;
