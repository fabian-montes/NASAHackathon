import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import '../css/SplashScreen.css';
import ImageSelector from "./ImageSelector";

import hubbleImg from "../assets/hubble5kb.jpg";

export default function SplashScreen({ onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h1 className="splash-logo">🚀 MyApp</h1>
        <button className="splash-close" onClick={handleClose}>
          X
        </button>
        <ImageSelector src={hubbleImg}/>
      </div>
    </div>
  );
}
