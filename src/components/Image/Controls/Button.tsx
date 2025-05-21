import { Item } from "src/components/Image/Controls/Button.styled";
import React from "react";

interface ButtonProps {
  className?: string;
  id: string;
  label: string;
  children: React.ReactChild;
  viewBoxX?: number;
  viewBoxY?: number;
  onClick?: (() => void) | undefined;
}

const Button: React.FC<ButtonProps> = ({
  className,
  id,
  label,
  children,
  viewBoxX = 512,
  viewBoxY = 512,
  onClick,
}) => {
  const dataButton = label.toLowerCase().replace(/\s/g, "-");
  return (
    <Item
      id={id}
      className={className}
      data-testid="openseadragon-button"
      data-button={dataButton}
      onClick={onClick}
      onTouchStart={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby={`${id}-svg-title`}
        data-testid="openseadragon-button-svg"
        focusable="false"
        viewBox={`0 0 ${viewBoxX} ${viewBoxY}`}
        role="img"
      >
        <title id={`${id}-svg-title`}>{label}</title>
        {children}
      </svg>
    </Item>
  );
};

export default Button;
