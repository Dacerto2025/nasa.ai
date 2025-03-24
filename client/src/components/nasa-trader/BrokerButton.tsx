import React, { useState, useEffect } from 'react';
import { Rocket, Gift } from 'lucide-react';

export default function BrokerButton() {
  // URL oficial da corretora ExNova
  const brokerUrl = "https://exnova.com/lp/start-trading/?aff=751488&aff_model=revenue&afftrack=";
  
  const [attention, setAttention] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // Efeito para chamar atenção para o botão periodicamente (intervalo maior)
  useEffect(() => {
    const attentionInterval = setInterval(() => {
      setAttention(true);
      setTimeout(() => setAttention(false), 1000);
    }, 30000); // Aumentado para 30 segundos
    
    // Expansão automática do botão com menos frequência
    const expandInterval = setInterval(() => {
      setExpanded(true);
      setTimeout(() => setExpanded(false), 3000);
    }, 60000); // Aumentado para 60 segundos
    
    return () => {
      clearInterval(attentionInterval);
      clearInterval(expandInterval);
    };
  }, []);
  
  const handleClick = () => {
    window.open(brokerUrl, '_blank');
  };

  return (
    <div className="fixed z-50 bottom-5 right-1/2 translate-x-1/2 flex flex-col items-center">
      {/* Botão principal */}
      <button 
        onClick={handleClick}
        className={`
          transition-all duration-300 ease-in-out
          ${expanded ? 'scale-110' : ''}
          ${attention ? 'scale-105' : ''}
          flex items-center gap-2 
          bg-gradient-to-r from-[#FC3D21] to-[#F5A623] 
          text-white font-semibold 
          shadow-lg hover:shadow-xl 
          hover:scale-105 
          border-2 border-white
          rounded-full
          
          /* Mobile positioning */
          sm:px-3 sm:py-2
          sm:text-sm
          
          /* Desktop positioning */
          md:px-5 md:py-3
          md:text-base
          
          px-4 py-3
        `}
        style={{ 
          boxShadow: '0 0 20px rgba(252, 61, 33, 0.8)',
          fontFamily: "'Orbitron', sans-serif"
        }}
      >
        <Rocket className="h-5 w-5" />
        <span className="whitespace-nowrap">
          {expanded ? 'LUCRE COM OPÇÕES HOJE!' : 'ABRIR CONTA AGORA'}
        </span>
      </button>
      
      {/* Texto promocional abaixo do botão - versão mais discreta */}
      <div className="mt-2 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-md text-center text-xs md:text-sm text-white border border-yellow-500/30 shadow-md">
        <div className="flex items-center justify-center gap-1">
          <Gift className="h-3 w-3 text-yellow-400" />
          <span className="font-bold text-yellow-400">CÓDIGO: NASA300</span>
        </div>
        <p className="text-[10px] md:text-xs">
          No seu primeiro depósito, ganhe 3x o valor depositado!
        </p>
      </div>
    </div>
  );
}