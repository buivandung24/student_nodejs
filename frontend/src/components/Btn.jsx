import { useState } from "react";
import { C, S } from "../constants/styles";

const hoverColors = {
  primary: C.primaryHover,
  danger: C.dangerHover,
  secondary: C.darkHover,
  outline: "#F3F4F6",
};

export default function Btn({ variant = "primary", size = "md", onClick, children, style }) {
  const [hover, setHover] = useState(false);
  const base = S.btn(variant, size);
  return (
    <button
      style={{ ...base, ...(hover ? { background: hoverColors[variant] } : {}), ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
