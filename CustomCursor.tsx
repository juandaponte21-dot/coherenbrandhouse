/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [hoverText, setHoverText] = useState('Ver');
  
  // Initialize off-screen to prevent flash
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (!target) return;

      const sliderEl = target.closest('input[type="range"]');
      const textInputEl = target.closest('input:not([type="range"]):not([type="button"]):not([type="submit"])') || 
                          target.closest('textarea');
      const clickable = target.closest('button') || 
                        target.closest('a') || 
                        target.closest('[data-hover="true"]') ||
                        sliderEl;
      
      setIsTextInput(!!textInputEl);

      if (clickable) {
        setIsHovering(true);
        const dataText = (clickable as HTMLElement).getAttribute('data-hover-text');
        setHoverText(dataText || (sliderEl ? 'Deslizar' : 'Ver'));
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-screen flex items-center justify-center hidden md:flex will-change-transform"
      style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="relative rounded-full border border-purple-500/50 bg-black/60 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center backdrop-blur-sm pointer-events-none"
        style={{ width: 80, height: 80 }}
        animate={{
          scale: isTextInput ? 0.12 : (isHovering ? 1.3 : 0.35), 
          backgroundColor: isTextInput 
            ? "rgba(255, 255, 255, 0.9)" 
            : (isHovering ? "rgba(168, 85, 247, 0.2)" : "rgba(0, 0, 0, 0.6)"),
          borderColor: isTextInput
            ? "rgba(255, 255, 255, 0.9)"
            : (isHovering ? "rgba(216, 180, 254, 1)" : "rgba(168, 85, 247, 0.5)"),
          boxShadow: isTextInput
            ? "0 0 8px rgba(255,255,255,0.6)"
            : (isHovering ? "0 0 20px rgba(168,85,247,0.5)" : "0 0 10px rgba(168,85,247,0.2)")
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        <motion.span 
          className="z-10 text-white font-bold uppercase tracking-widest text-[10px] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovering && !isTextInput ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        >
          {hoverText}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
