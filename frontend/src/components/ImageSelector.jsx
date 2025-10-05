import { useState, useRef } from "react";

import '../css/ImageSelector.css';

export default function ImageSelector({ src }) {
  const containerRef = useRef(null);
  const [selection, setSelection] = useState({ x: 50, y: 50, w: 100, h: 80 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left - selection.x ,
      y: e.clientY - rect.top - selection.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    let newX = e.clientX - rect.left - offset.x;
    let newY = e.clientY - rect.top - offset.y;

    // keep inside image bounds
    newX = Math.max(0, Math.min(newX, rect.width - selection.w));
    newY = Math.max(0, Math.min(newY, rect.height - selection.h));

    setSelection({ ...selection, x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const toggleZoom = () => setIsZoomed(!isZoomed);

  return (
    <div
      ref={containerRef}
      className="container relative inline-block"
      style={{ userSelect: "none" }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >

      {/* <img src={src} alt="Selectable" className="splash-image max-w-full h-auto block" /> */}
      {/* Image with zoom */}
      <img
        src={src}
        alt="Selectable"
        className="splash-image max-w-full h-auto block"
        style={{
          transform: isZoomed ? "scale(2)" : "scale(1)",
          transition: "transform 0.4s ease",
          transformOrigin: "center center",
        }}
        onClick={toggleZoom}
      />

      {/* Selection Rectangle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          top: selection.y,
          left: selection.x,
          width: selection.w,
          height: selection.h,
          border: "2px solid red",
          cursor: "move",
          background: "rgba(255,0,0,0.1)",
        }}
      ></div>

      {/* Collapse zoom button */}
      {isZoomed && (
        <button
          onClick={toggleZoom}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            padding: "6px 10px",
            border: "none",
            borderRadius: "6px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            cursor: "pointer",
            zIndex: 20,
          }}
        >
          Collapse
        </button>
      )}

    </div>
  );
}
