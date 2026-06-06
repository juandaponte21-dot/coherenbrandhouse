/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { Service } from '../types';
import * as LucideIcons from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
  bottomBarStyle?: React.CSSProperties;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, isSelected, onClick, style, bottomBarStyle }) => {
  // Get icon dynamically from Lucide library
  const IconComponent = (LucideIcons as any)[service.iconName] || LucideIcons.Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={onClick}
      style={style}
      className={`group relative p-6 md:p-8 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected 
          ? 'bg-gradient-to-b from-purple-950/40 via-purple-950/20 to-black border-purple-400 shadow-lg shadow-purple-500/10' 
          : 'bg-zinc-950/40 hover:bg-zinc-900/40 border-zinc-800/80 hover:border-purple-500/30'
      }`}
      data-hover="true"
      data-hover-text="Abrir"
    >
      {/* Decorative top corner accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-tr-2xl transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

      {/* Service Header: Icon and Number */}
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl border transition-colors duration-300 ${
          isSelected 
            ? 'bg-purple-500/20 border-purple-400 text-purple-300' 
            : 'bg-zinc-900 border-zinc-800 text-gray-400 group-hover:text-purple-300 group-hover:border-purple-500/40 group-hover:bg-purple-950/10'
        }`}>
          <IconComponent className="w-6 h-6" />
        </div>
        <span className="text-xs font-mono font-medium text-purple-500/40 group-hover:text-purple-400/60 font-mono">
          0{index + 1}
        </span>
      </div>

      {/* Title & Short description */}
      <h3 className="font-heading text-lg md:text-xl font-bold uppercase tracking-tight text-white mb-3 transition-colors duration-300 group-hover:text-purple-300">
        {service.name}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300">
        {service.shortDesc}
      </p>

      {/* Real statistics / value metric */}
      <div style={bottomBarStyle} className="flex items-center justify-between pt-4 border-t border-zinc-900 group-hover:border-purple-500/10">
        <span className="text-[10px] tracking-wide text-purple-400/80 font-sans leading-relaxed text-left max-w-[65%] block">
          Te damos informes del progreso de tu empresa de manera personalizada
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const contactSection = document.getElementById('contacto');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="text-xs font-semibold font-mono text-purple-200 hover:text-white bg-purple-950/50 hover:bg-purple-600 px-3.5 py-1.5 rounded-full border border-purple-500/30 hover:border-purple-400 shadow-md transition-all cursor-pointer select-none active:scale-95"
        >
          Charlemos
        </button>
      </div>

      {/* Active expand indicator */}
      <div className="absolute bottom-2 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
        <span className="text-[9px] uppercase tracking-widest text-purple-300 font-mono">Saber Más</span>
        <LucideIcons.ArrowRight className="w-3 h-3 text-purple-300" />
      </div>
    </motion.div>
  );
};

export default ServiceCard;
