/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Rocket, 
  Target, 
  Share2, 
  Flame, 
  TrendingUp, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  BarChart3, 
  Sparkles, 
  X, 
  Menu, 
  ChevronRight, 
  ChevronDown, 
  Send, 
  Phone, 
  Award, 
  UserCheck, 
  RefreshCcw,
  BookOpen,
  DollarSign,
  Mail,
  User,
  Database,
  Lock,
  Globe,
  Plus,
  Compass,
  Check,
  AlertCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import FluidBackground from './FluidBackground';
import GradientText from './GlitchText';
import CustomCursor from './customCursor';
import AIChat from './AIChat';
import ServiceCard from './ServiceCard';
import { Service, DynamicAuditRequest } from './types';
import { generateInstantAudit } from './services/geminiService';

// Marketing Agency Services
const SERVICES: Service[] = [
  {
    id: 'redes',
    name: 'Gestión de Redes Sociales',
    shortDesc: 'Construimos comunidades fieles, elevamos el engagement orgánico y diseñamos contenido disruptivo que enamora en Instagram, TikTok y LinkedIn.',
    description: 'Nuestra gestión estratégica va más allá del simple posteo diario. Analizamos a fondo el comportamiento de tu audiencia promedio en Colombia, estructuramos pilares creativos diferenciales y ejecutamos una producción ágil de contenido visual y copys de alta retención.',
    details: [
      'Auditoría completa de perfiles actuales contra competidores líderes.',
      'Planificación y diseño mensual de grillas estilizadas con alta estética visual.',
      'Estrategias orgánicas de crecimiento continuo apoyadas por tendencias.',
      'Copys persuasivos dirigidos a conversión inmediata y generación de comunidad.'
    ],
    iconName: 'Share2',
    resultsMetric: '+140% Interacción'
  },
  {
    id: 'meta-ads',
    name: 'Campañas de Meta Ads',
    shortDesc: 'Segmentación láser en Facebook e Instagram para escalar conversiones reales, dominando el algoritmo para rentabilizar tu presupuesto.',
    description: 'La pauta digital no es adivinar, es ciencia de datos. Diseñamos embudos de anuncios robustos optimizados para el mercado local colombiano, configurando presupuestos dinámicos, testeando creativos en tiempo récord y maximizando el Retorno sobre la Inversión Publicitaria (ROAS).',
    details: [
      'Configuración e integración técnica (Meta Pixel, API de Conversiones).',
      'Creación de públicos personalizados, similares (Lookalike) e intereses refinados.',
      'A/B Testing constante de copys, ganchos visuales y llamados de acción.',
      'Reportes técnicos claros sobre costo por clic (CPC) y costo de adquisición (CPA).'
    ],
    iconName: 'Flame',
    resultsMetric: 'ROAS Promedio 4.2x'
  },
  {
    id: 'leads',
    name: 'Generación de Clientes',
    shortDesc: 'Suministramos un flujo continuo de contactos precalificados (Leads) listos para comprar, listos para tu equipo comercial.',
    description: 'Creamos sistemas predecibles para capturar clientes interesados. Usamos formularios de pauta directa de Meta nativos de alta velocidad, embudos de landing pages minimalistas y disparadores automáticos para que tu equipo reciba notificaciones instantáneas de interesados reales.',
    details: [
      'Creación de imanes de clientes (Lead Magnets) irresistibles.',
      'Filtros de segmentación por preguntas clave para calificar la intención del lead.',
      'Integración automatizada con bases de datos o WhatsApp Business.',
      'Sistemas de nutrición rápida para asegurar conversiones de alta efectividad.'
    ],
    iconName: 'Target',
    resultsMetric: 'CPA Reducido -35%'
  },
  {
    id: 'contenido',
    name: 'Optimización de Contenido',
    shortDesc: 'Formulamos scripts persuasivos y editamos videos magnéticos orientados a retener la atención del usuario en menos de 3 segundos.',
    description: 'La atención es el nuevo oro digital. Coheren estructura piezas audiovisuales en formato vertical (Reels y TikTok) de alta retención, utilizando ganchos audaces, subtitulado dinámico de alto impacto y una narrativa rápida para vender sin parecer que estás vendiendo.',
    details: [
      'Investigación minuciosa de hooks / ganchos ganadores en tu categoría.',
      'Redacción científica de scripts enfocados en las zonas calientes del video.',
      'Dirección creativa para grabaciones móviles ultra-profesionales de impacto.',
      'Edición de ritmo rápido con efectos acústicos, musicales y visuales lilas/morados.'
    ],
    iconName: 'Rocket',
    resultsMetric: '2.5M+ Vistas Demo'
  },
  {
    id: 'ventas',
    name: 'Estrategias de Venta',
    shortDesc: 'Consultoría e ingeniería integral de embudos comerciales de alta conversión para posicionarte como líder del mercado.',
    description: 'Tus campañas solo funcionan si tienes un norte claro. Evaluamos el ecosistema comercial de tu marca en Colombia, identificamos fugas en tu proceso de ventas de WhatsApp o Checkout y configuramos una ruta clara para aumentar el valor promedio de ticket por cliente.',
    details: [
      'Consultoría estratégica uno-a-uno para planeación táctica anual.',
      'Optimización de flujos de cierre por chat (WhatsApp, DM de Instagram).',
      'Estrategias de fidelización de marca y recompra directa del consumidor.',
      'Ecosistema integrado de posicionamiento de marca premium.'
    ],
    iconName: 'TrendingUp',
    resultsMetric: '+85% Ventas Netas'
  }
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Custom calculator state
  const [budgetSlider, setBudgetSlider] = useState<number>(1500000); // 1.5M COP defaults
  const [ticketValue, setTicketValue] = useState<number>(120000); // 120k COP ticket val
  const [conversionType, setConversionType] = useState<'leads' | 'direct'>('leads');
  const [targetConversionRate, setTargetConversionRate] = useState<number>(12); // Dynamic conversion target (12% for leads initial)
  const [isBudgetFocused, setIsBudgetFocused] = useState(false);
  const [isTicketFocused, setIsTicketFocused] = useState(false);
  const [isTargetFocused, setIsTargetFocused] = useState(false);

  // Instant AI Audit form
  const [auditForm, setAuditForm] = useState<DynamicAuditRequest>({
    businessName: '',
    niche: '',
    primaryGoal: 'Aumentar Ventas',
    targetBudget: '1.5M - 3M COP'
  });
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [auditProgressMessage, setAuditProgressMessage] = useState('');

  // Contact simulated form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Formspree connection configurations
  const [formspreeId, setFormspreeId] = useState<string>(() => {
    return localStorage.getItem('eclipse_formspree_id') || import.meta.env.VITE_FORMSPREE_FORM_ID || '';
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactErrorMsg, setContactErrorMsg] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  // Dynamic calculations computed synchronously in render phase (zero lag, instant modification)
  const calcMetaReach = Math.floor((budgetSlider / 100000) * 14000);
  const calcClicks = Math.floor(calcMetaReach * 0.018);
  const calcLeads = conversionType === 'leads' 
    ? Math.max(1, Math.floor(calcClicks * 0.10)) 
    : Math.max(1, Math.floor(calcClicks * 0.05));
  const calcSales = conversionType === 'leads' 
    ? Math.max(1, Math.floor(calcLeads * (targetConversionRate / 100))) 
    : Math.max(1, Math.floor(calcClicks * (targetConversionRate / 100)));
  const calcRevenue = calcSales * ticketValue;
  const calcROI = budgetSlider > 0 ? parseFloat((calcRevenue / budgetSlider).toFixed(1)) : 0;

  // Handle Dynamic Audit submission to Gemini API
  const handleGenerateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditForm.businessName.trim() || !auditForm.niche.trim()) {
      alert("Por favor completa el nombre de tu negocio y tu nicho.");
      return;
    }

    setAuditLoading(true);
    setAuditProgressMessage("Alineando satélites con Coheren...");
    
    const messages = [
      "Analizando el ecosistema digital de tu marca...",
      "Configurando ganchos comerciales potentes...",
      "Estructurando embudo de conversión optimizado para Colombia...",
      "Últimos ajustes creativos de Coheren AI..."
    ];

    let msgIdx = 0;
    const interval = setInterval(() => {
      if (msgIdx < messages.length) {
        setAuditProgressMessage(messages[msgIdx]);
        msgIdx++;
      }
    }, 1500);

    const result = await generateInstantAudit(
      auditForm.businessName,
      auditForm.niche,
      auditForm.primaryGoal,
      auditForm.targetBudget
    );

    clearInterval(interval);
    setAuditResult(result);
    setAuditLoading(false);

    // Scroll smoothly to output
    setTimeout(() => {
      const el = document.getElementById('audit-report-container');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;

    setContactSubmitting(true);
    setContactErrorMsg(null);

    if (formspreeId) {
      try {
        const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            message: contactMsg,
            _subject: `⚡ NUEVO LEAD AGENDADO: ${contactName} - Coheren`
          })
        });

        if (response.ok) {
          setContactSent(true);
          setContactName('');
          setContactEmail('');
          setContactPhone('');
          setContactMsg('');
          setTimeout(() => {
            setContactSent(false);
          }, 6000);
        } else {
          throw new Error('Servidor de correo no aceptó la petición');
        }
      } catch (err: any) {
        console.error("Formspree Send Error:", err);
        setContactErrorMsg("Error al conectar con Formspree. Por favor verifica tu Formspree ID de formulario o inténtalo de nuevo.");
      } finally {
        setContactSubmitting(false);
      }
    } else {
      // Offline/Demo Simulated submission mode
      // Let's hold for 1.2s to simulate sending, then show the visual confirmation
      setTimeout(() => {
        setContactSent(true);
        setContactSubmitting(false);
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactMsg('');
        setTimeout(() => {
          setContactSent(false);
        }, 6000);
      }, 1200);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Safe client-side Markdown to HTML renderer utility
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Bold text parser utility helper
      const formatBold = (str: string) => {
        const parts = str.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, pidx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pidx} className="font-extrabold text-purple-300">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });
      };

      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-purple-200 mt-5 mb-2 font-heading tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            {formatBold(trimmed.substring(4))}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-white mt-6 mb-3 font-heading border-b border-purple-500/10 pb-1.5 tracking-tight">
            {formatBold(trimmed.substring(3))}
          </h3>
        );
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={idx} className="text-xl font-black text-white mt-8 mb-4 font-heading tracking-tight uppercase">
            {formatBold(trimmed.substring(2))}
          </h2>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="list-none flex items-start gap-2.5 text-gray-300 text-xs md:text-sm leading-relaxed mb-2.5 ml-1">
            <span className="text-purple-400 mt-1.5 shrink-0 text-xs">&#9670;</span>
            <span className="flex-1">{formatBold(trimmed.substring(2))}</span>
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={idx} className="h-2.5" />;
      }
      return (
        <p key={idx} className="text-gray-300 text-xs md:text-sm leading-relaxed mb-3">
          {formatBold(line)}
        </p>
      );
    });
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-purple-600 selection:text-white cursor-auto overflow-x-hidden bg-black">
      {/* Custom Spring Cursor */}
      <CustomCursor />
      
      {/* Immersive Cosmic Purple Background */}
      <FluidBackground />
      
      {/* Floating Chatbot Widget (Eclipse AI) */}
      <AIChat />

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-xl border-b border-purple-950/20 px-6 md:px-12 py-5 flex items-center justify-between">
        <div 
          onClick={() => scrollToSection('hero')} 
          className="flex items-center gap-2.5 font-heading text-lg md:text-xl font-bold tracking-widest text-white cursor-pointer z-50 select-none"
          data-hover="true"
          data-hover-text="Inicio"
        >
          {/* High-Resolution Typographic Emblem for Coheren Brand House (eclipse O style) */}
          <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-black/60 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-transform duration-300 hover:scale-105 select-none shrink-0">
            <div className="absolute inset-[1.5px] rounded-full bg-gradient-to-tr from-purple-500 via-white to-fuchsia-400 opacity-90" />
            <motion.div 
              className="absolute w-[18px] h-[18px] rounded-full bg-[#03000a]"
              animate={{ x: [-0.5, 0.5, -0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="flex flex-col items-start leading-none select-none">
            <span className="font-heading text-xs md:text-sm tracking-[0.16em] text-white">
              C<span className="text-purple-400 relative inline-block mx-[1px] font-bold">O</span>HEREN
            </span>
            <span className="text-[7px] md:text-[7.5px] tracking-[0.25em] text-gray-400 font-mono font-bold uppercase mt-1">
              BRAND HOUSE
            </span>
          </div>
        </div>
        
        {/* Desktop navbar navigation links */}
        <div className="hidden md:flex gap-8 text-[11px] font-bold tracking-widest uppercase">
          {[
            { tag: 'servicios', label: 'Servicios' },
            { tag: 'auditoria', label: 'Auditoría IA' },
            { tag: 'calculadora', label: 'Estadísticas ROI' }
          ].map((item) => (
            <button 
              key={item.tag} 
              onClick={() => scrollToSection(item.tag)}
              className="hover:text-purple-300 transition-colors text-white duration-200 cursor-pointer bg-transparent border-none"
              data-hover="true"
              data-hover-text={item.label}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => scrollToSection('contacto')}
          className="hidden md:inline-block border border-purple-500/40 bg-purple-950/15 hover:bg-purple-600 hover:border-purple-400 hover:text-white px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 text-white cursor-pointer rounded-full"
          data-hover="true"
          data-hover-text="Charlemos"
        >
          Agendar Cita
        </button>

        {/* Mobile menu triggers */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile drawer overlays */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden px-4"
          >
            {[
              { tag: 'servicios', label: 'Servicios' },
              { tag: 'auditoria', label: 'Auditoría IA' },
              { tag: 'calculadora', label: 'Estadísticas ROI' }
            ].map((item) => (
              <button
                key={item.tag}
                onClick={() => scrollToSection(item.tag)}
                className="text-2xl font-heading font-medium text-white hover:text-purple-400 transition-colors uppercase bg-transparent border-none"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('contacto')}
              className="mt-8 border border-purple-500 bg-purple-600 px-8 py-3.5 text-xs font-bold tracking-widest uppercase text-white rounded-full"
            >
              Agendar Cita
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO HERO SECTION */}
      <section id="hero" className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4 pt-24 md:pt-0">
        <div className="z-10 text-center flex flex-col items-center w-full max-w-5xl pb-16 md:pb-6">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2.5 text-[10px] md:text-xs font-mono text-purple-300 tracking-[0.2em] md:tracking-[0.34em] uppercase mb-6 bg-purple-950/30 border border-purple-500/10 px-5 py-2 rounded-full backdrop-blur-md"
          >
            <span>Growth Agency</span>
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"/>
            <span>Colombia</span>
          </motion.div>

          <div className="relative w-full flex justify-center items-center select-none">
            {/* Elegant Background Eclipse Halo Graphic */}
            <motion.div 
               className="absolute -z-20 w-[60vw] h-[60vw] max-w-[450px] max-h-[450px] bg-purple-600/10 blur-[90px] rounded-full pointer-events-none will-change-transform"
               animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.4, 0.6, 0.4] }}
               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
               style={{ transform: 'translateZ(0)' }}
            />

            {/* Custom Spelled COHEREN Logo with highly stylized Eclipse O */}
            <div className="flex items-center justify-center h-auto">
              <GradientText 
                text="C" 
                as="h1" 
                className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter text-center uppercase" 
              />
              
              {/* Standout Animated Eclipse O Container */}
              <div className="relative w-[11.5vw] h-[11.5vw] md:w-[8.2vw] md:h-[8.2vw] mx-[0.01em] flex items-center justify-center">
                
                {/* Corona Flare/Aura behind the O */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-350 blur-[8px] md:blur-[12px] opacity-85"
                  animate={{ 
                    scale: [0.95, 1.1, 0.95],
                    rotate: 360 
                  }}
                  transition={{ 
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 15, repeat: Infinity, ease: "linear" }
                  }}
                />
                
                {/* Golden light outline ring of the sun */}
                <div className="absolute inset-[0.1em] rounded-full bg-gradient-to-r from-white via-amber-200 to-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.7)]" />
                
                {/* Dark lunar disk that offsets slightly to create a crescent eclipse */}
                <motion.div 
                  className="absolute w-[80%] h-[80%] rounded-full bg-[#03000a] border border-purple-500/20 shadow-inner"
                  animate={{ 
                    x: [-1.2, 1.2, -1.2],
                    y: [-0.8, 0.8, -0.8] 
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                
                {/* Spark / Diamond ring flare at the edge of the eclipse */}
                <motion.div 
                  className="absolute inset-0 rounded-full pointer-events-none"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-[5%] left-[5%] w-2 h-2 md:w-3 md:h-3 rounded-full bg-white shadow-[0_0_10px_2px_#fff,0_0_18px_4px_rgba(168,85,247,0.9)] animate-pulse" />
                </motion.div>
                
              </div>

              <GradientText 
                text="HEREN" 
                as="h1" 
                className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter text-center uppercase" 
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[4vw] md:text-[2vw] font-heading font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-400 mt-4 uppercase"
          >
            BRAND HOUSE
          </motion.div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.2, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-xl h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mt-6 mb-6 md:mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xs md:text-lg font-light max-w-2xl mx-auto text-gray-300 leading-relaxed drop-shadow-md px-4"
          >
            Somos una <strong className="text-purple-300 font-semibold">Brand House</strong> que busca que tu negocio tenga posicionamiento digital por medio de la implementación de <strong className="text-purple-300 font-semibold">estrategias digitales</strong>, buscamos que tus ventas se disparen. <strong className="text-white font-semibold">Coheren</strong> busca simetría en tu negocio logrando un potencial de marca.
          </motion.p>

          {/* Call to Actions buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-16 md:mt-24 w-full justify-center px-6"
            style={{ marginTop: '100px' }}
          >
            <button
              onClick={() => scrollToSection('contacto')}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-[12px] uppercase tracking-widest px-10 py-4.5 transition-all duration-300 rounded-full shadow-lg shadow-purple-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              data-hover="true"
              data-hover-text="Agendar"
            >
              <span>Agendar Cita</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('auditoria')}
              className="w-full sm:w-auto border border-purple-500/30 hover:border-purple-400 bg-purple-950/20 hover:bg-purple-900/40 text-white font-bold text-[11px] uppercase tracking-wider px-8 py-4 transition-all duration-300 rounded-full cursor-pointer"
              data-hover="true"
              data-hover-text="Probar IA"
            >
              Obtener Auditoría IA Gratis
            </button>
            <button
              onClick={() => scrollToSection('calculadora')}
              className="w-full sm:w-auto border border-white/10 hover:border-purple-500/30 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-bold text-[11px] uppercase tracking-wider px-8 py-4 transition-all duration-300 rounded-full cursor-pointer hidden md:inline-block"
              data-hover="true"
              data-hover-text="Calcular"
            >
              Calcular ROI de Pauta
            </button>
          </motion.div>
        </div>

        {/* Dynamic running banner representing Colombian success keywords */}
        <div className="absolute bottom-6 left-0 w-full py-3.5 bg-black border-y border-purple-500/10 overflow-hidden select-none">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="text-[10px] md:text-xs font-mono font-medium tracking-widest text-purple-300/60 uppercase px-8 flex items-center gap-4">
                    Manejo de redes <span className="text-purple-500/20 text-xs">●</span> 
                    Optimización de embudos <span className="text-purple-500/20 text-xs">●</span> 
                    Creación de contenido <span className="text-purple-500/20 text-xs">●</span> 
                    Crecimiento empresarial <span className="text-purple-500/20 text-xs">●</span> 
                    Lead calificado <span className="text-purple-500/20 text-xs">●</span> 
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CORE SERVICES SECTION */}
      <section id="servicios" className="relative z-10 py-24 md:py-32 px-4 md:px-8 border-t border-purple-950/15 bg-black/40">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20">
            <div>
              <p className="text-purple-400 font-mono text-[10px] uppercase tracking-widest mb-2.5" style={{ paddingLeft: '60px', paddingTop: '0px', marginLeft: '0px' }}>Puedes estar a otro nivel</p>
              <h2 className="text-3xl md:text-5xl font-heading font-black uppercase text-white tracking-tight">
                SERVICIOS QUE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400">PRESTAMOS</span>
              </h2>
            </div>
            <p className="text-gray-400 text-xs md:text-sm max-w-sm mt-4 md:mt-0 font-light leading-relaxed">
              Diseñamos tácticas minimalistas pero ferozmente eficientes. Cada servicio está concebido para aumentar la facturación y el valor digital.
            </p>
          </div>

          {/* Grid Layout of Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, idx) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={idx} 
                isSelected={selectedService?.id === service.id}
                onClick={() => setSelectedService(service)} 
                style={idx === 4 ? {
                  paddingTop: '0px',
                  paddingBottom: '0px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  marginTop: '96px',
                  marginRight: '0px',
                  marginBottom: '24px'
                } : undefined}
                bottomBarStyle={idx === 4 ? {
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  paddingTop: '32px',
                  paddingBottom: '32px'
                } : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* DETAILED SERVICES MODAL DRAWER */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-zinc-950 border border-purple-500/20 rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-purple-500/5 p-6 md:p-10"
            >
              {/* Close controls button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900 border border-white/5 text-gray-400 hover:text-white hover:border-purple-500/30 transition-all cursor-pointer"
                data-hover="true"
                data-hover-text="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-purple-400 font-mono text-[10px] uppercase tracking-widest bg-purple-950/40 px-3 py-1.5 rounded-full border border-purple-500/10">
                  {selectedService.resultsMetric}
                </span>

                <h3 className="text-xl md:text-3xl font-heading font-black uppercase text-white tracking-tight mt-6 mb-4">
                  {selectedService.name}
                </h3>
                
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed mb-8">
                  {selectedService.description}
                </p>

                <div className="h-px w-full bg-zinc-900 mb-6" />

                <h4 className="text-[10px] uppercase tracking-wider font-mono text-purple-300 mb-4 font-sans">
                  Lo que incluye la entrega de este servicio:
                </h4>
                
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedService.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-3.5 text-xs text-gray-400 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex justify-end gap-3">
                  <button
                    onClick={() => { setSelectedService(null); scrollToSection('contacto'); }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] tracking-widest uppercase px-6 py-3 rounded-full transition-colors cursor-pointer"
                  >
                    Cotizar Servicio
                  </button>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="border border-zinc-800 text-gray-400 hover:text-white px-6 py-3 rounded-full text-[10px] tracking-widest uppercase transition-colors hover:bg-zinc-900 cursor-pointer"
                  >
                    Cerrar Detalle
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DYNAMIC IA AUDITOR DIAGNOSIS */}
      <section id="auditoria" className="relative z-10 py-24 md:py-32 bg-black/30 border-y border-purple-500/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Descriptive side column */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 text-xs text-purple-400 font-mono mb-3">
                <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                <span>Auditoría de Crecimiento Gratuita</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-black mb-6 leading-tight uppercase text-white">
                DIAGNÓSTICO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400">INSTANTÁNEO</span>
              </h2>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light mb-8">
                ¿Tu marca está estancada? Rellena los datos básicos de tu negocio y nuestro agente inteligente <strong>Coheren AI</strong> estructurará una micro-auditoría estratégica con ideas de anuncios y tácticas de redes exclusivas para ti.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-500/15 flex items-center justify-center text-xs font-mono text-purple-300 font-semibold shadow-sm shadow-purple-500/5">1</div>
                  <span className="text-xs text-gray-400 font-light">Escribe tu nicho y tu meta comercial.</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-500/15 flex items-center justify-center text-xs font-mono text-purple-300 font-semibold shadow-sm shadow-purple-500/5">2</div>
                  <span className="text-xs text-gray-400 font-light">Estructura un presupuesto coherente.</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-500/15 flex items-center justify-center text-xs font-mono text-purple-300 font-semibold shadow-sm shadow-purple-500/5">3</div>
                  <span className="text-xs text-gray-400 font-light">Obtén un informe inmediato listo para implementar.</span>
                </div>
              </div>
            </div>

            {/* Form side column */}
            <div className="lg:col-span-12 xl:col-span-7 rounded-3xl border border-purple-500/10 bg-zinc-950/35 p-6 md:p-10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-800 via-violet-500 to-fuchsia-400" />
              
              <form onSubmit={handleGenerateAudit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-2">Nombre de tu Negocio / Marca *</label>
                    <input
                      type="text"
                      required
                      value={auditForm.businessName}
                      onChange={(e) => setAuditForm({ ...auditForm, businessName: e.target.value })}
                      placeholder="Ej: Hamburguesas Smash"
                      className="w-full bg-black/60 rounded-xl px-4 py-3.5 border border-purple-500/10 focus:border-purple-500/40 text-xs md:text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-2">Nicho de Mercado / Sector *</label>
                    <input
                      type="text"
                      required
                      value={auditForm.niche}
                      onChange={(e) => setAuditForm({ ...auditForm, niche: e.target.value })}
                      placeholder="Ej: Gastronomía, Ropa Femenina, Dentista"
                      className="w-full bg-black/60 rounded-xl px-4 py-3.5 border border-purple-500/10 focus:border-purple-500/40 text-xs md:text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-2">Meta Principal</label>
                    <select
                      value={auditForm.primaryGoal}
                      onChange={(e) => setAuditForm({ ...auditForm, primaryGoal: e.target.value })}
                      className="w-full bg-black/60 rounded-xl px-4 py-3.5 border border-purple-500/10 focus:border-purple-500/40 text-xs text-white focus:outline-none transition-colors appearance-none"
                    >
                      <option className="bg-zinc-950" value="Aumentar Ventas">Incrementar Ventas Totales</option>
                      <option className="bg-zinc-950" value="Captar Clientes Potenciales / Leads">Conseguir Clientes Potenciales (Leads)</option>
                      <option className="bg-zinc-950" value="Posicionamiento de Marca">Hacer Branding / Presencia Digital</option>
                      <option className="bg-zinc-950" value="Profesionalizar Redes Sociales">Estructurar Contenido Relevante</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-2">Presupuesto de Pauta Estimado</label>
                    <select
                      value={auditForm.targetBudget}
                      onChange={(e) => setAuditForm({ ...auditForm, targetBudget: e.target.value })}
                      className="w-full bg-black/60 rounded-xl px-4 py-3.5 border border-purple-500/10 focus:border-purple-500/40 text-xs text-white focus:outline-none transition-colors appearance-none"
                    >
                      <option className="bg-zinc-950" value="Menos de 1M COP">Menos de $1,000,000 COP al mes</option>
                      <option className="bg-zinc-950" value="1M - 3M COP">$1,000,000 - $3,000,000 COP al mes</option>
                      <option className="bg-zinc-950" value="3M - 5M COP">$3,000,000 - $5,000,000 COP al mes</option>
                      <option className="bg-zinc-950" value="Más de 5M COP">Más de $5,000,000 COP al mes</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={auditLoading}
                  className="w-full bg-gradient-to-r from-purple-700 to-violet-500 hover:from-purple-600 hover:to-violet-400 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-purple-500/10 transition-all cursor-pointer disabled:opacity-40"
                  data-hover="true"
                  data-hover-text="Generar"
                >
                  {auditLoading ? `${auditProgressMessage}` : "✨ GENERAR DIAGNÓSTICO IA ✨"}
                </button>
              </form>
            </div>
          </div>

          {/* AI Audit response layout block */}
          <AnimatePresence>
            {auditResult && (
              <motion.div
                id="audit-report-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6 }}
                className="mt-12 md:mt-16 rounded-3xl border border-purple-400/30 bg-gradient-to-b from-purple-950/20 via-zinc-950/60 to-black p-6 md:p-12 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/50 border border-purple-500/20 px-2.5 py-1 rounded-full uppercase">
                    Diagnóstico Completo por Coheren AI
                  </span>
                  <button
                    onClick={() => setAuditResult(null)}
                    className="text-gray-400 hover:text-white p-1 rounded-full bg-white/5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/30">
                      <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg md:text-xl font-bold uppercase tracking-tight text-white">
                        {auditForm.businessName}
                      </h3>
                      <p className="text-purple-300 text-xs">Estrategia táctica de escala</p>
                    </div>
                  </div>

                  <div className="text-gray-500 h-px w-full bg-purple-500/10 mb-8" />
                  
                  {/* Generated report renderer */}
                  <div className="space-y-4">
                    {parseMarkdown(auditResult)}
                  </div>

                  <div className="mt-10 pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs font-light text-center sm:text-left">
                      ¿Quieres delegar la ejecución técnica de esta estrategia en profesionales chilenos y colombianos?
                    </p>
                    <button
                      onClick={() => scrollToSection('contacto')}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] tracking-widest uppercase px-8 py-3.5 rounded-full transition-all cursor-pointer shadow-lg shadow-purple-500/10 shrink-0"
                    >
                      Solicitar Presupuesto Completo
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* INTERACTIVE CAMPAIGN ROI / SALES CALCULATOR */}
      <section id="calculadora" className="relative z-10 py-24 md:py-32 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <span className="text-purple-400 font-mono text-[10px] uppercase tracking-widest bg-purple-950/30 px-3 py-1.5 rounded-full border border-purple-500/10">
            Datos Científicos de Pauta
          </span>
          <h2 className="text-3xl md:text-6xl font-heading font-black tracking-tight text-white uppercase mt-4">
            ESTIMADOR DIGITAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400 font-bold">DE ESCALA ROI</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto font-light mt-4 leading-relaxed">
            Descubre qué tan rentable es tu inversión en Facebook e Instagram Ads en Colombia. Ajusta los controles con tu presupuesto mensual real para estimar el alcance y conversiones netas.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Range controls inputs card */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/20 p-6 md:p-8 flex flex-col justify-between gap-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full pointer-events-none" />
            
            <div>
              <h3 className="font-heading text-sm font-semibold uppercase text-purple-300 tracking-wider mb-8">
                Configura tus Parámetros
              </h3>

              {/* Conversion goals selectors */}
              <div className="mb-8">
                <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-3">Tácticas de Conversión</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setConversionType('leads');
                      setTargetConversionRate(12);
                    }}
                    className={`py-3.5 px-4 rounded-xl text-[10px] md:text-xs font-bold uppercase transition-colors cursor-pointer text-center ${
                      conversionType === 'leads' 
                        ? 'bg-purple-600/20 border border-purple-400 text-purple-200' 
                        : 'bg-zinc-900 border border-zinc-800 text-gray-400'
                    }`}
                  >
                    Leads / WhatsApp (Servicios)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConversionType('direct');
                      setTargetConversionRate(2.2);
                    }}
                    className={`py-3.5 px-4 rounded-xl text-[10px] md:text-xs font-bold uppercase transition-colors cursor-pointer text-center ${
                      conversionType === 'direct' 
                        ? 'bg-purple-600/20 border border-purple-400 text-purple-200' 
                        : 'bg-zinc-900 border border-zinc-800 text-gray-400'
                    }`}
                  >
                    Compra Web (E-commerce)
                  </button>
                </div>
              </div>

              {/* Monthly pauta budgets */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400">Presupuesto Mensual</label>
                  <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 focus-within:border-purple-500 rounded-xl px-2.5 py-1.5 transition-all">
                    <span className="text-zinc-500 text-xs font-mono font-bold">$</span>
                    <input
                      type="text"
                      value={isBudgetFocused ? (budgetSlider === 0 ? '' : budgetSlider.toString()) : budgetSlider.toLocaleString('es-CO')}
                      onFocus={() => setIsBudgetFocused(true)}
                      onBlur={() => setIsBudgetFocused(false)}
                      onChange={(e) => {
                        const cleanVal = e.target.value.replace(/[^0-9]/g, '');
                        const numVal = parseInt(cleanVal) || 0;
                        setBudgetSlider(Math.min(25000000, numVal));
                      }}
                      className="w-24 md:w-28 bg-transparent text-right text-xs font-mono font-bold text-white outline-none focus:ring-0 border-none p-0 selection:bg-purple-600/40"
                    />
                    <span className="text-zinc-500 text-[10px] font-mono ml-0.5">COP</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={400000}
                  max={8000000}
                  step={100000}
                  value={budgetSlider > 8000000 ? 8000000 : budgetSlider < 400000 ? 400000 : budgetSlider}
                  onChange={(e) => setBudgetSlider(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer outline-none transition-all duration-200 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(168,85,247,0.85)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-153 [&::-webkit-slider-thumb]:hover:scale-115 [&::-webkit-slider-thumb]:active:scale-95 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(168,85,247,0.85)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-153 [&::-moz-range-thumb]:hover:scale-115 [&::-moz-range-thumb]:active:scale-95"
                />
                <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-2">
                  <span>Min: 400K COP</span>
                  <span>Max: 8M COP</span>
                </div>
                
                {/* Presets buttons */}
                <div className="flex gap-2.5 mt-3 flex-wrap">
                  {[500000, 1500000, 3000000, 5000000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBudgetSlider(preset)}
                      className={`px-3 py-1.5 text-[10px] font-mono rounded-lg border transition-all cursor-pointer ${
                        budgetSlider === preset
                          ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-gray-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {preset >= 1000000 ? `$${preset / 1000000}M COP` : `$${preset / 1000}K COP`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing / Ticket values */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400">Precio promedio de servicio</label>
                  <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 focus-within:border-purple-500 rounded-xl px-2.5 py-1.5 transition-all">
                    <span className="text-zinc-500 text-xs font-mono font-bold">$</span>
                    <input
                      type="text"
                      value={isTicketFocused ? (ticketValue === 0 ? '' : ticketValue.toString()) : ticketValue.toLocaleString('es-CO')}
                      onFocus={() => setIsTicketFocused(true)}
                      onBlur={() => setIsTicketFocused(false)}
                      onChange={(e) => {
                        const cleanVal = e.target.value.replace(/[^0-9]/g, '');
                        const numVal = parseInt(cleanVal) || 0;
                        setTicketValue(Math.min(5000000, numVal));
                      }}
                      className="w-24 md:w-28 bg-transparent text-right text-xs font-mono font-bold text-white outline-none focus:ring-0 border-none p-0 selection:bg-purple-600/40"
                    />
                    <span className="text-zinc-500 text-[10px] font-mono ml-0.5">COP</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={500000}
                  step={10000}
                  value={ticketValue > 500000 ? 500000 : ticketValue < 25000 ? 25000 : ticketValue}
                  onChange={(e) => setTicketValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer outline-none transition-all duration-200 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(168,85,247,0.85)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-153 [&::-webkit-slider-thumb]:hover:scale-115 [&::-webkit-slider-thumb]:active:scale-95 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(168,85,247,0.85)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-153 [&::-moz-range-thumb]:hover:scale-115 [&::-moz-range-thumb]:active:scale-95"
                />
                <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-2">
                  <span>Min: 25K COP</span>
                  <span>Max: 500K COP</span>
                </div>

                {/* Pricing Presets */}
                <div className="flex gap-2.5 mt-3 flex-wrap">
                  {[50000, 150000, 300000, 500000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTicketValue(preset)}
                      className={`px-3 py-1.5 text-[10px] font-mono rounded-lg border transition-all cursor-pointer ${
                        ticketValue === preset
                          ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-gray-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {preset >= 1000000 ? `$${preset / 1000000}M COP` : `$${preset / 1000}K COP`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasa de Conversión/Cierre Target */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400">
                    {conversionType === 'leads' ? 'Tasa de Cierre Comercial (Target)' : 'Tasa de Conversión Web (Target)'}
                  </label>
                  <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 focus-within:border-purple-500 rounded-xl px-2.5 py-1.5 transition-all">
                    <input
                      type="text"
                      className="w-16 bg-transparent text-right text-xs font-mono font-bold text-white outline-none focus:ring-0 border-none p-0 selection:bg-purple-600/40"
                      value={isTargetFocused ? (targetConversionRate === 0 ? '' : targetConversionRate.toString()) : `${targetConversionRate}%`}
                      onFocus={() => setIsTargetFocused(true)}
                      onBlur={() => setIsTargetFocused(false)}
                      onChange={(e) => {
                        const cleanVal = e.target.value.replace(/[^0-9.]/g, '');
                        const numVal = parseFloat(cleanVal) || 0;
                        setTargetConversionRate(Math.min(50, numVal));
                      }}
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={30}
                  step={0.5}
                  value={targetConversionRate > 30 ? 30 : targetConversionRate < 0.5 ? 0.5 : targetConversionRate}
                  onChange={(e) => setTargetConversionRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer outline-none transition-all duration-200 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-500 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(168,85,247,0.85)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-153 [&::-webkit-slider-thumb]:hover:scale-115 [&::-webkit-slider-thumb]:active:scale-95 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(168,85,247,0.85)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-153 [&::-moz-range-thumb]:hover:scale-115 [&::-moz-range-thumb]:active:scale-95"
                />
                <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-2">
                  <span>Min: 0.5%</span>
                  <span>{conversionType === 'leads' ? 'Sugerido: ~10% - 15% (WhatsApp)' : 'Sugerido: ~1% - 3% (Web)'}</span>
                  <span>Max: 30%</span>
                </div>

                {/* Presets de Tasa */}
                <div className="flex gap-2.5 mt-3 flex-wrap">
                  {(conversionType === 'leads' ? [5, 10, 12, 20] : [1, 2.2, 5, 10]).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTargetConversionRate(preset)}
                      className={`px-3 py-1.5 text-[10px] font-mono rounded-lg border transition-all cursor-pointer ${
                        targetConversionRate === preset
                          ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-gray-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Sección de KPI y Métricas en Tiempo Real */}
              <div className="mt-8 pt-6 border-t border-zinc-900 grid grid-cols-1 gap-4">
                {/* Metric: Financial ROAS */}
                <div className="bg-purple-950/20 p-4 rounded-2xl border border-purple-500/10 hover:border-purple-500/20 transition-colors flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-wider text-purple-400/80 mb-1">Facturación / Ventas Brutas</p>
                    <p className="text-sm md:text-base font-mono font-extrabold text-white">{formatCOP(calcRevenue)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono uppercase tracking-wider text-purple-300 mb-1">Retorno ROAS</p>
                    <span className="text-xs md:text-sm font-mono font-bold text-purple-200">{calcROI}x de Retorno</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-purple-950/15 border border-purple-500/10 rounded-2xl block text-center">
              <span className="text-[10px] text-purple-300 leading-relaxed font-light">
                * Cálculos estimados basados en costos CPC promedios de Meta Ads en Colombia para sectores pyme competitivos.
              </span>
            </div>

            <div className="mt-4 pt-6 border-t border-zinc-900/60 flex justify-center">
              <button
                onClick={() => scrollToSection('contacto')}
                className="w-full bg-purple-600 hover:bg-purple-505 text-white font-bold text-[10px] tracking-widest uppercase py-4 rounded-full transition-colors cursor-pointer text-center"
                data-hover="true"
                data-hover-text="Agendar"
              >
                Me interesa esta pauta
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* MINIMAL CONTACT BRIEF SUBMISSION */}
      <section id="contacto" className="relative z-10 py-24 md:py-32 px-4 md:px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-zinc-800/80 bg-zinc-950/20 p-6 md:p-12 backdrop-blur-xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-700 via-purple-500 to-fuchsia-400" />
          
          <div className="max-w-md mx-auto mb-10">
            <span className="text-purple-400 font-mono text-[10px] uppercase tracking-widest bg-purple-950/30 px-3 py-1.5 rounded-full border border-purple-500/10">
              Contacto Práctico
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-white uppercase mt-4 mb-3">
              ¿HAGAMOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400">MAGIA?</span>
            </h2>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Completa los datos y te responderemos por WhatsApp o Correo en menos de 12 horas con un presupuesto detallado.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6 text-left max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Tu nombre aquí"
                  className="w-full bg-black/60 rounded-xl px-4 py-3.5 border border-purple-500/10 focus:border-purple-500/40 text-xs md:text-sm text-white focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-2">WhatsApp / Número de Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Ej: +57 301 2345678"
                  className="w-full bg-black/60 rounded-xl px-4 py-3.5 border border-purple-500/10 focus:border-purple-500/40 text-xs md:text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-2">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-black/60 rounded-xl px-4 py-3.5 border border-purple-500/10 focus:border-purple-500/40 text-xs md:text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-2">¿Platícanos brevemente de tu marca o tus necesidades?</label>
              <textarea
                value={contactMsg}
                rows={4}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="Ej: Necesitamos estructurar campañas en Meta Ads para captar reservas de restaurante..."
                className="w-full bg-black/60 rounded-xl px-4 py-3.5 border border-purple-500/10 focus:border-purple-500/40 text-xs md:text-sm text-white focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={contactSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-purple-500/10 transition-all cursor-pointer flex justify-center items-center gap-2"
              data-hover="true"
              data-hover-text={contactSubmitting ? "Enviando..." : "Enviar"}
            >
              {contactSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
              <span>{contactSubmitting ? 'Conectando Servidor...' : 'Enviar Mensaje'}</span>
            </button>
          </form>

          {/* Toast submission notification feedback */}
          <AnimatePresence>
            {contactSent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 text-purple-300 text-xs leading-relaxed max-w-md mx-auto"
              >
                🎉 ¡Formulario enviado de forma exitosa! {formspreeId ? 'Ya ha sido remitido a tu correo juandaponte21@gmail.com.' : 'Nos pondremos en contacto contigo en las próximas 12 horas. Gracias por confiar en Coheren.'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error submission notification feedback */}
          <AnimatePresence>
            {contactErrorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-xs leading-relaxed max-w-md mx-auto flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{contactErrorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* SECCIÓN TRATO PERSONALIZADO & ECLIPSE VISUAL */}
      <section className="relative z-10 py-16 md:py-24 border-t border-[#1e112c]/60 overflow-hidden bg-gradient-to-b from-black via-zinc-950/90 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.04)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            
            {/* visual interactivo de eclipse */}
            <div className="relative flex items-center justify-center h-64 md:h-80 select-none">
              
              {/* Corona Solar - Brillo externo pulsante y giratorio */}
              <motion.div
                animate={{
                  scale: [0.95, 1.05, 0.95],
                  rotate: 360
                }}
                transition={{
                  scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" }
                }}
                className="absolute w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-300 blur-2xl opacity-70"
                style={{ mixBlendMode: 'screen' }}
              />

              {/* Corona Secundaria para efecto más orgánico y místico */}
              <motion.div
                animate={{
                  scale: [1.05, 0.92, 1.05],
                  rotate: -360
                }}
                transition={{
                  scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 35, repeat: Infinity, ease: "linear" }
                }}
                className="absolute w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-bl from-indigo-500 via-teal-400 to-fuchsia-500 blur-xl opacity-50"
                style={{ mixBlendMode: 'screen' }}
              />

              {/* Aura Radiante Dorada para el borde del eclipse */}
              <div className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full bg-amber-400/20 blur-md pointer-events-none" />

              {/* El Cuerpo del Eclipse - Disco Lunar Oscuro que genera el bloqueo total del sol */}
              <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-zinc-950 border border-purple-500/20 flex items-center justify-center relative shadow-[inset_0_0_25px_rgba(168,85,247,0.35),0_0_35px_rgba(147,51,234,0.4)]">
                {/* Corona interior plateada brillante - el anillo de diamantes */}
                <div className="absolute inset-0.5 rounded-full border border-white/5 opacity-40" />
                
                {/* Micro destello estelar dinámico y giratorio (Anillo de Diamante del Eclipse) */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center w-6 h-6">
                    {/* Destello central con brillo pulsante */}
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_14px_3px_#fff,0_0_24px_6px_rgba(168,85,247,0.9)] animate-pulse" />
                    {/* Destellos de lente en cruz */}
                    <div className="absolute w-8 h-[1px] bg-white/85 blur-[0.2px]" />
                    <div className="absolute w-[1px] h-8 bg-white/85 blur-[0.2px]" />
                  </div>
                </motion.div>
                
                {/* Símbolo central minimalista y elegante de Coheren */}
                <div className="absolute inset-2 flex flex-col items-center justify-center select-none leading-none">
                  <span className="font-heading text-lg md:text-xl font-bold tracking-[0.12em] text-white">
                    C<span className="text-purple-400 font-extrabold relative inline-block animate-pulse" style={{ textShadow: '0 0 10px rgba(168,85,247,0.8)' }}>O</span>HEREN
                  </span>
                  <span className="text-[6.5px] font-mono tracking-[0.2em] text-gray-400 font-bold uppercase mt-1.5">
                    BRAND HOUSE
                  </span>
                </div>
              </div>

            </div>

            {/* Información de contacto */}
            <div className="text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-950/40 border border-purple-500/20 rounded-full text-[10px] font-mono text-purple-300 uppercase tracking-widest">
                ● Trato 100% Directo
              </span>

              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-heading font-black text-white leading-tight uppercase tracking-wider">
                  ¿Prefieres un contacto <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-300">más rápido y exclusivo</span>?
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans font-light">
                  Entendemos que cada marca audaz busca decisiones ejecutivas prontas. Hablemos sin intermediarios ni papeleo para coordinar de inmediato el impulso comercial de tu marca.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-950/60 to-purple-800/20 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase text-zinc-500">Director Ejecutivo / Fundador</h4>
                    <p className="text-sm font-heading font-black text-white tracking-wide mt-0.5">David Aponte</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900/60 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/573008231876?text=Hola%20David,%20me%20gustaría%20agendar%20una%20reunión%20personalizada%20con%20Coheren"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-mono text-[10px] uppercase font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer text-center"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp: 300 8231876</span>
                  </a>

                  <a
                    href="tel:+573008231876"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-gray-300 font-mono text-[10px] uppercase font-bold rounded-xl transition-all cursor-pointer text-center"
                  >
                    Llamar Ahora
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FOOTER FOOTER */}
      <footer className="relative z-10 border-t border-purple-950/20 py-16 md:py-20 bg-black/95">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          <div className="md:col-span-6">
            <div className="flex items-center gap-2.5 font-heading text-lg font-bold tracking-widest text-white mb-4">
              {/* Custom Vector Emblem for Coheren */}
              <div className="relative w-6 h-6 rounded-full flex items-center justify-center bg-black/60 border border-purple-500/25 shadow-[0_0_8px_rgba(168,85,247,0.3)] select-none shrink-0">
                <div className="absolute inset-[1px] rounded-full bg-gradient-to-tr from-purple-500 via-white to-fuchsia-400 opacity-90" />
                <div className="absolute w-[14px] h-[14px] rounded-full bg-[#03000a] top-[1.5px] left-[2.5px]" />
              </div>
              <div className="flex flex-col items-start leading-none select-none">
                <span className="font-heading text-xs tracking-[0.16em] text-white">
                  C<span className="text-purple-400 relative inline-block mx-[1px] font-bold">O</span>HEREN
                </span>
                <span className="text-[6.5px] tracking-[0.25em] text-gray-400 font-mono font-bold uppercase mt-1">
                  BRAND HOUSE
                </span>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed font-light max-w-sm">
              Somos una agencia estelar de Marketing Digital en Colombia enfocada puramente en el retorno de inversión comercial y posicionamiento de marcas audaces.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-heading text-xs uppercase tracking-widest text-[#d8b4fe] font-bold mb-4">Coheren</h4>
            <div className="flex flex-col gap-2.5 text-xs text-gray-400 font-light">
              <a onClick={() => scrollToSection('servicios')} className="hover:text-purple-300 transition-colors cursor-pointer">Nuestros Servicios</a>
              <a onClick={() => scrollToSection('auditoria')} className="hover:text-purple-300 transition-colors cursor-pointer">Auditoría con IA</a>
              <a onClick={() => scrollToSection('calculadora')} className="hover:text-purple-300 transition-colors cursor-pointer">ROI de Pauta</a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-heading text-xs uppercase tracking-widest text-[#d8b4fe] font-bold mb-4">Contacto Directo</h4>
            <div className="flex flex-col gap-2.5 text-xs text-gray-400 font-light">
              <span>Bogotá, Colombia</span>
              <a href="mailto:juandaponte21@gmail.com" className="hover:text-purple-300 transition-colors">juandaponte21@gmail.com</a>
              <a href="https://wa.me/573008231876?text=Hola%20David,%20me%20gustaría%20agendar%20una%20reunión%20personalizada%20con%20Coheren" target="_blank" rel="noreferrer" className="hover:text-purple-300 transition-colors flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-purple-400" /> +57 (300) 823-1876
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 font-mono">
          <span>&copy; {new Date().getFullYear()} Coheren Brand House. Todos los derechos reservados.</span>
          <span className="mt-2 sm:mt-0">Colombia &amp; Latinoamérica</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
