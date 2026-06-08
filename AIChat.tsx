/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from './geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lazy initialize standard welcome message in Spanish representing Coheren Brand House
    if (messages.length === 0) {
      setMessages([
        { 
          role: 'model', 
          text: '¡Hola! Soy Coheren AI, tu consultor digital en Coheren Brand House. Platícame sobre tu negocio y te daré ideas innovadoras para aumentar tus ventas e impacto. 🚀' 
        }
      ]);
    }
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Minor delay to let state render before scrolling
    setTimeout(scrollToBottom, 50);

    const responseText = await sendMessageToGemini(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[90vw] md:w-[400px] bg-black/90 backdrop-blur-2xl border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10"
          >
            {/* Header / Brand identity */}
            <div className="bg-gradient-to-r from-purple-950/60 to-black p-4 flex justify-between items-center border-b border-purple-500/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                <div>
                  <h3 className="font-heading font-medium text-white text-xs tracking-wider">COHEREN AI</h3>
                  <p className="text-[10px] text-purple-300">Asesor de Crecimiento Digital</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/50 hover:text-white transition-colors" 
                data-hover="true"
                data-hover-text="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat message logs */}
            <div 
              ref={chatContainerRef}
              className="h-72 md:h-96 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/20 scroll-smooth bg-black/40"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600/90 text-white rounded-tr-none shadow-md shadow-purple-500/5'
                        : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* User typing box */}
            <div className="p-3 border-t border-purple-500/10 bg-black/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Escribe tu nicho (ej: restaurante, tienda)..."
                  className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-xs focus:outline-none border border-purple-500/10 focus:border-purple-500/30 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-600 p-2.5 rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  data-hover="true"
                  data-hover-text="Enviar"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-[9px] text-center text-purple-400/40 mt-2">
                Potenciado por Gemini 3.5 Flash
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/573008231876?text=Hola%20David,%20me%20gustaría%20agendar%20una%20reunión%20personalizada%20con%20Coheren"
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 md:w-14 md:h-14 mb-3 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-purple-400/30 z-50 group cursor-pointer transition-colors"
        data-hover="true"
        data-hover-text="WhatsApp"
      >
        <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </motion.a>

      {/* Launcher Bubble */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-purple-800 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-purple-500/30 z-50 group cursor-pointer"
        data-hover="true"
        data-hover-text={isOpen ? "Cerrar" : "Charlar"}
      >
        {isOpen ? (
          <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
        ) : (
          <motion.div
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.05, 0.95, 1.05, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
