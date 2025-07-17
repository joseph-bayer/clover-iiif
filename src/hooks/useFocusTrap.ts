import { useEffect, useRef } from "react";

interface UseFocusTrapOptions {
  isActive: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export const useFocusTrap = ({
  isActive,
  initialFocusRef,
}: UseFocusTrapOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Make the container focusable and part of tab sequence
    container.setAttribute("tabindex", "0");

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      const elements = Array.from(
        container.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), [contenteditable="true"]',
        ),
      ) as HTMLElement[];

      // Include the container itself as the first focusable element
      return [container, ...elements];
    };

    let focusableElements = getFocusableElements();

    // Focus the container by default, or the specified initial element
    const elementToFocus = initialFocusRef?.current || container;
    if (elementToFocus) {
      // Use setTimeout to ensure the element is properly rendered before focusing
      setTimeout(() => {
        elementToFocus.focus();
      }, 0);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Refresh focusable elements in case the DOM changed
      focusableElements = getFocusableElements();

      if (focusableElements.length === 0) return;

      const currentFirstElement = focusableElements[0];
      const currentLastElement =
        focusableElements[focusableElements.length - 1];

      if (e.key === "Tab") {
        if (focusableElements.length === 1) {
          // If there's only one focusable element, prevent tabbing away
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          // Shift + Tab - moving backwards
          if (document.activeElement === currentFirstElement) {
            e.preventDefault();
            currentLastElement?.focus();
          }
        } else {
          // Tab - moving forwards
          if (document.activeElement === currentLastElement) {
            e.preventDefault();
            currentFirstElement?.focus();
          }
        }
      }
    };

    // Handle Escape key to close the panel
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Dispatch a custom event that the parent component can listen to
        const escapeEvent = new CustomEvent("focustrap:escape");
        container.dispatchEvent(escapeEvent);
      }
    };

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);
    container.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("keydown", handleEscape);
      // Remove the tabindex when cleanup
      container.removeAttribute("tabindex");
    };
  }, [isActive, initialFocusRef]);

  return containerRef;
};
