/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  size: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
  opacity: number;
  colorClass: string;
  glow: boolean;
}

const StarField = () => {
  // Generate beautiful randomized stars with depth layers
  const stars = useMemo<Star[]>(() => {
    const starColors = [
      'bg-white',
      'bg-purple-200',
      'bg-violet-300',
      'bg-fuchsia-200',
      'bg-[#eed6ff]',
    ];

    return Array.from({ length: 85 }).map((_, i) => {
      const size = Math.random() * 1.8 + 0.6;
      // Some foreground stars have a subtle glow
      const glow = size > 1.8 && Math.random() > 0.4;
      
      return {
        id: i,
        size,
        x: Math.random() * 100,
        y: Math.random() * 100,
        // Slow constant offset drift to simulate orbital cosmic motion
        driftX: (Math.random() - 0.5) * 5,
        driftY: (Math.random() - 0.5) * 5,
        duration: Math.random() * 6 + 4, // Twinkle speed
        delay: Math.random() * 4,
        opacity: Math.random() * 0.7 + 0.2,
        colorClass: starColors[Math.floor(Math.random() * starColors.length)],
        glow,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className={`absolute rounded-full ${star.colorClass} will-change-[opacity,transform]`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: star.glow ? `0 0 8px 1.5px rgba(216, 180, 254, 0.7)` : 'none',
            transform: 'translateZ(0)',
          }}
          animate={{
            opacity: [star.opacity * 0.4, star.opacity, star.opacity * 0.4],
            scale: [0.9, 1.25, 0.9],
            x: [0, star.driftX, 0],
            y: [0, star.driftY, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const ShootingStars = () => {
  // 3 subtle shooting stars that streak across the sky on repeating random patterns
  const meteors = useMemo(() => {
    return Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      x: Math.random() * 60 + 20, // start X
      y: Math.random() * 40,      // start Y
      delay: i * 8 + Math.random() * 6,
      duration: Math.random() * 1.2 + 1.2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          className="absolute h-[1.5px] bg-gradient-to-r from-purple-400 via-fuchsia-200/90 to-transparent rounded-full will-change-transform"
          style={{
            left: `${meteor.x}%`,
            top: `${meteor.y}%`,
            width: '80px',
            transform: 'rotate(-40deg)',
          }}
          animate={{
            x: [0, -320],
            y: [0, 260],
            scaleX: [0, 1.2, 0],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: meteor.duration,
            repeat: Infinity,
            repeatDelay: 12 + Math.random() * 10,
            delay: meteor.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC = () => {
  return (
    // Solid pitch black base layout with dark purple gradient hues
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030108]">
      
      {/* Dynamic Starfield with varying scale and glowing orbits */}
      <StarField />
      
      {/* Shooting Stars (Stardust meteors) */}
      <ShootingStars />

      {/* Layer 1: Left Top Deep Purple Nebula */}
      <motion.div
        className="absolute top-[-30%] left-[-20%] w-[110vw] h-[110vw] rounded-full bg-purple-900/12 mix-blend-screen filter blur-[110px] will-change-transform"
        animate={{
          x: [0, 45, -30, 0],
          y: [0, -40, 35, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Layer 2: Middle-Right Vibrant Lilac / Fuchsia Nebula */}
      <motion.div
        className="absolute top-[20%] right-[-25%] w-[95vw] h-[95vw] rounded-full bg-[#3b0764]/18 mix-blend-screen filter blur-[120px] will-change-transform"
        animate={{
          x: [0, -50, 25, 0],
          y: [0, 45, -35, 0],
          scale: [0.95, 1.05, 1, 0.95],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Layer 3: Central-Bottom Soft Orchid / Indigo Nebula */}
      <motion.div
        className="absolute bottom-[-30%] left-[15%] w-[100vw] h-[100vw] rounded-full bg-[#2e1065]/15 mix-blend-screen filter blur-[130px] will-change-transform"
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 45, 0],
          scale: [1, 0.92, 1.06, 1],
        }}
        transition={{
          duration: 52,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Layer 4: Floating Ultra Soft Lilac Dust Spec */}
      <motion.div
        className="absolute top-[45%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-500/5 mix-blend-screen filter blur-[90px] will-change-transform"
        animate={{
          x: [-30, 40, -30],
          y: [30, -40, 30],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Subtle organic noise overlay for cinematic film texture */}
      <div className="absolute inset-0 opacity-[0.035] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
      
      {/* Real Vignette to dim edges down to pure rich cosmic black */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(3,1,8,0.65)_70%,rgba(3,1,8,0.98)_100%)] pointer-events-none" />
    </div>
  );
};

export default FluidBackground;
