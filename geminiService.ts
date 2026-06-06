/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  // Utilize the latest gemini-3.5-flash model as per standard instruction guidelines
  const ai = new GoogleGenAI({ 
    apiKey: API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
  
  chatSession = ai.chats.create({
    model: 'gemini-3.5-flash',
    config: {
      systemInstruction: `Eres 'Coheren AI', el Consultor Experto en Marketing Digital de 'Coheren Brand House'.
      La agencia se especializa en el crecimiento acelerado de empresas en Colombia y Latinoamérica.
      
      Servicios principales de la agencia:
      1. Gestión estratégica de redes sociales (Instagram, TikTok, LinkedIn).
      2. Campañas publicitarias en Meta Ads (Facebook e Instagram) de alto retorno.
      3. Generación constante de clientes potenciales (Leads calificados).
      4. Optimización avanzada de contenido digital para branding e impacto.
      5. Estrategias completas para aumentar ventas y posicionamiento de marca.
      
      Tono de comunicación: Profesional, inspirador, moderno, creativo y sumamente pragmático. Habla siempre en español. Usa emojis modernos de marketing (🚀, 📈, 🎯, 💡, 💎, 🧠) de forma elegante.
      
      Directrices de interacción:
      - Responde de manera concisa pero con alto valor añadido. Sugiere siempre una táctica accionable.
      - Si el usuario te saluda, dale la bienvenida de parte de Coheren y pregúntale sobre su negocio o en cuál de nuestros servicios está interesado.
      - Si te preguntan sobre precios, indica que los planes son 100% personalizados según el estado actual del negocio y sus metas, pero que pueden rellenar el formulario de Diagnóstico Gratuito de la web para obtener una auditoría inmediata.
      - Mantén las respuestas fluidas y estructuradas con viñetas.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Los sistemas de inteligencia artificial están en modo offline por falta de API Key. Por favor contacta al equipo de Coheren para activarlo.";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Hubo un corte en la señal con Coheren AI. Intenta de nuevo.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "No se pudo establecer conexión con el canal de Coheren AI. Revisa los detalles de red.";
  }
};

/**
 * Generates an instant tailored digital audit / growth strategy for the briefs form!
 */
export const generateInstantAudit = async (
  name: string,
  niche: string,
  goal: string,
  budget: string
): Promise<string> => {
  if (!API_KEY) {
    return "Sin conexión. Es necesario configurar la GEMINI_API_KEY en los secretos.";
  }

  const prompt = `Actúa como Director Estratégico de Coheren Brand House. Genera una micro-auditoría estratégica y un plan de acción para un negocio con estos datos:
  - Nombre del Negocio: ${name}
  - Nivel / Nicho del Mercado: ${niche}
  - Meta Principal: ${goal}
  - Presupuesto mensual estimado para pauta publicitaria: ${budget}
  
  Genera el reporte en ESPAÑOL utilizando Markdown perfectamente estructurado con los siguientes bloques elegantes:
  1. 🌟 **Diagnóstico del Nicho**: Un análisis rápido sobre las oportunidades y debilidades del nicho actual.
  2. ⚡ **Estrategia Meta Ads**: Qué tipo de campaña y embudo haríamos (por ejemplo, Campaña de Clientes Potenciales versus Conversión a WhatsApp/Sitio). Proporciona sugerencias de ganchos creativos.
  3. 📱 **Enfoque de Contenido**: Pilares clave para redes sociales orientados a su producto.
  4. 🎯 **KPIs Estimados**: Qué métricas claves vigilar y un consejo exclusivo de conversión.
  
  Mantén el contenido sumamente persuasivo, directo, profesional e inspirador. Que demuestre por qué Coheren Brand House es el socio ideal para delegar esta gestión en Colombia.`;

  try {
    const ai = new GoogleGenAI({ 
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    return response.text || "No se pudo generar la auditoría.";
  } catch (error) {
    console.error("Audit Generation Error:", error);
    return "Error al procesar el plan de crecimiento. Revisa tu conexión.";
  }
};
