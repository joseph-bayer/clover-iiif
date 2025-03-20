import { AnnotationNormalized } from "@iiif/presentation-3";
import React, { useEffect, useState } from "react";
import { useViewerState } from "src/context/viewer-context";
import { CloseButton, CloseIcon, Panel } from "./InformationPanelV2.styled";

interface InformationPanelV2Props {
  annotations: Array<AnnotationNormalized>;
}

export default function InformationPanelV2({
  annotations,
}: InformationPanelV2Props) {
  const { selectedAnnotationId } = useViewerState();
  const [selectedAnnotation, setSelectedAnnotation] =
    useState<AnnotationNormalized | null>(null);

  useEffect(() => {
    if (selectedAnnotationId) {
      const selectedAnnotation = annotations.find(
        (annotation) => annotation.id === selectedAnnotationId,
      );
      setSelectedAnnotation(selectedAnnotation ?? null);
    } else {
      setSelectedAnnotation(null);
    }
  }, [selectedAnnotationId, annotations]);

  // Don't show panel if no annotation is selected
  if (!selectedAnnotation) {
    return null;
  }

  return (
    <Panel>
      {/* TODO: closeHandler */}
      <CloseButton>
        {/* TODO: svg? */}
        <CloseIcon>×</CloseIcon>
      </CloseButton>
      <div>InformationPanelV2</div>
      <div>{JSON.stringify(selectedAnnotation, null, 2)}</div>
    </Panel>
  );
}
