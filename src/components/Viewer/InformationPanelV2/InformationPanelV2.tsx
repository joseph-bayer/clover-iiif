import {
  CaptionText,
  CloseButton,
  CloseIcon,
  Panel,
  PanelContent,
  PanelContentWrapper,
  PanelHeader,
  PanelTitle,
} from "src/components/Viewer/InformationPanelV2/InformationPanelV2.styled";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnnotationNormalized } from "@iiif/presentation-3";
import { useViewerDispatch, useViewerState } from "src/context/viewer-context";
import Image from "next/image";
import { useFocusTrap } from "src/hooks/useFocusTrap";

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
  const [selectedAnnotationImageAltText, setSelectedAnnotationImageAltText] =
    useState<string | null>(null);
  const viewerDispatch: any = useViewerDispatch();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Set up focus trap - container will be focused by default
  const focusTrapRef = useFocusTrap({
    isActive: !!selectedAnnotation,
  });

  // Function to grap smaller versions of images from WP
  const appendSizeToUrl = (url, size) => {
    return url.replace(/(\.[a-zA-Z0-9]+)$/, `-${size}$1`);
  };

  // Find and set selectedAnnotationText and selectedAnnotationImage
  useEffect(() => {
    if (selectedAnnotationId) {
      const newSelectedAnnotation: any = annotations.find(
        (annotation) => annotation.id === selectedAnnotationId,
      );
      setSelectedAnnotation(newSelectedAnnotation ?? null);
      if (newSelectedAnnotation) {
        let image: any = null;
        if (Array.isArray(newSelectedAnnotation.body)) {
          const text = newSelectedAnnotation.body.find(
            (body) =>
              body.type === "TextualBody" &&
              body.language === activeLanguageCode,
          );
          image = newSelectedAnnotation.body.find(
            (body) => body.type === "Image",
          );
          setSelectedAnnotationText(text ?? null);
          setSelectedAnnotationImage(image ?? null);
        } else {
          const text =
            newSelectedAnnotation.body.type === "TextualBody"
              ? newSelectedAnnotation.body.value
              : null;
          image =
            newSelectedAnnotation.body.type === "Image"
              ? newSelectedAnnotation.body
              : null;
          setSelectedAnnotationText(text ?? null);
          setSelectedAnnotationImage(image ?? null);
        }
        // NOTE: Hack to split english and spanish alt text.
        // Backend must separate English and Spanish alt text with a pipe "|".
        // This issue is due to the "accessibility" field only supporting string and string arrays instead of objects.
        const imageEnglishAltText =
          image?.accessibility?.split("|")[0]?.trim() ?? null;
        const imageSpanishAltText =
          image?.accessibility?.split("|")[1]?.trim() ?? null;
        if (activeLanguageCode === "en") {
          setSelectedAnnotationImageAltText(imageEnglishAltText);
        } else {
          setSelectedAnnotationImageAltText(imageSpanishAltText);
        }
      }
    } else {
      setSelectedAnnotation(null);
      setSelectedAnnotationText(null);
      setSelectedAnnotationImage(null);
    }
  }, [selectedAnnotationId, annotations, activeLanguageCode]);

  const onClose = useCallback(() => {
    // Store the annotation ID before clearing it
    const currentAnnotationId = selectedAnnotationId;

    viewerDispatch({
      type: "updateSelectedAnnotation",
      selectedAnnotationId: null,
    });

    // Return focus to the annotation point that opened this panel
    // Use setTimeout to ensure this happens after the dispatch re-render
    if (currentAnnotationId) {
      setTimeout(() => {
        const annotationButton = document.getElementById(currentAnnotationId);
        if (annotationButton) {
          annotationButton.focus();
        }
      }, 0);
    }
  }, [viewerDispatch, selectedAnnotationId]);

  // Handle escape key from focus trap
  useEffect(() => {
    const handleEscapeEvent = () => {
      onClose();
    };

    const container = focusTrapRef.current;
    if (container) {
      container.addEventListener("focustrap:escape", handleEscapeEvent);
      return () => {
        container.removeEventListener("focustrap:escape", handleEscapeEvent);
      };
    }
  }, [focusTrapRef, onClose]);

  // Don't show panel if no annotation is selected
  if (!selectedAnnotation) {
    return null;
  }

  return (
    <Panel
      ref={focusTrapRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
      tabIndex={0}
      css={{
        borderColor:
          configOptions.annotationOverlays?.highlightedBackgroundColor,
      }}
    >
      <PanelHeader>
        <PanelTitle id="panel-title">
          <div
            dangerouslySetInnerHTML={{
              __html: selectedAnnotationText?.label ?? "",
            }}
          ></div>
        </PanelTitle>
        <CloseButton
          ref={closeButtonRef}
          aria-label="Close information panel"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
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
        <PanelContentWrapper style={{ position: "relative" }} tabIndex={0}>
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
                src={appendSizeToUrl(selectedAnnotationImage.id, "300x300")} // WARNING: Only works when hosted on WP
                alt={selectedAnnotationImageAltText || ""}
                width={500}
                height={500}
                style={{
                  maxWidth: "100%",
                  maxHeight: "calc(100% - 40px)",
                  marginTop: "10px",
                  borderRadius: "5px",
                }}
              />
              {!!selectedAnnotationImage.label?.[activeLanguageCode ?? "en"]
                ?.length && (
                <CaptionText>
                  {selectedAnnotationImage.label[activeLanguageCode ?? "en"] ??
                    ""}
                </CaptionText>
              )}
            </>
          )}
        </PanelContentWrapper>
      </PanelContent>
    </Panel>
  );
};

export default InformationPanelV2;
