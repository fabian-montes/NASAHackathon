import { useState, useRef } from "react";

import '../css/ImageSelector.css';

export default function ImageSelector({ src }) {
  const containerRef = useRef(null);
  const [selection, setSelection] = useState({ x: 50, y: 50, w: 100, h: 80 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  return (
    <div
      ref={containerRef}
      className="container relative inline-block"
      style={{ userSelect: "none" }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >

      <img src={src} alt="Selectable" className="splash-image max-w-full h-auto block" />
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
    </div>
  );
}
