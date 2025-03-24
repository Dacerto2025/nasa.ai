import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function BrasiliaTime() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Função para obter o horário de Brasília (GMT-3)
    const getBrasiliaTime = () => {
      // Brasília timezone é UTC-3
      const now = new Date();
      // Ajustar para o fuso horário brasileiro (GMT-3)
      const brasiliaOffset = -3 * 60; // minutos
      const localOffset = now.getTimezoneOffset(); // local offset em minutos
      
      // Calcular a diferença de offset entre local e Brasília
      const offsetDiff = localOffset + brasiliaOffset;
      
      // Adicionar a diferença ao horário atual
      return new Date(now.getTime() + offsetDiff * 60 * 1000);
    };

    // Formatar o horário
    const formatBrasiliaTime = () => {
      const brasiliaTime = getBrasiliaTime();
      return format(brasiliaTime, 'HH:mm:ss');
    };

    // Atualizar o horário imediatamente
    setCurrentTime(formatBrasiliaTime());

    // Configurar o intervalo para atualizar a cada segundo
    const timer = setInterval(() => {
      setCurrentTime(formatBrasiliaTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-black/60 px-5 py-3 rounded-xl flex items-center border border-[#003366]/30 shadow-lg backdrop-blur-sm">
        <Clock className="text-[#00F2FF] mr-3 h-5 w-5" />
        <span className="font-mono text-lg font-semibold tracking-wider">{currentTime}</span>
        <span className="ml-2 text-xs text-white/80">Horário de Brasília</span>
      </div>
    </div>
  );
}
