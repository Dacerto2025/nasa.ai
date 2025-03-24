import { useState, useEffect } from 'react';
import { SignalData } from '@/lib/types';
import { Loader2, ArrowUp, ArrowDown } from 'lucide-react';

interface SignalResultsProps {
  signal: SignalData | null;
  isLoading: boolean;
}

export default function SignalResults({ signal, isLoading }: SignalResultsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (signal || isLoading) {
      setIsVisible(true);
    }
  }, [signal, isLoading]);

  if (!isVisible) {
    return null;
  }

  const getDirectionStyles = (direction: 'up' | 'down') => {
    return direction === 'up'
      ? { text: 'text-[#39FF14]', bg: 'bg-green-900/30' }
      : { text: 'text-[#FF3131]', bg: 'bg-red-900/30' };
  };

  return (
    <div className="mt-8">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0F2B]/80 rounded-lg z-10">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 animate-spin">
                <Loader2 className="h-12 w-12 text-[#00F2FF]" />
              </div>
              <p className="mt-3 text-[#00F2FF]">Analisando mercado...</p>
            </div>
          </div>
        )}
        
        <div className="bg-black/50 rounded-lg border border-gray-800 p-6">
          <h3 className="text-xl mb-4 text-center" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Sinal Gerado
          </h3>
          
          {signal && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#0A0F2B]/70 p-3 rounded-lg">
                  <p className="text-sm text-white/70">Par de Moedas</p>
                  <p className="font-semibold text-lg">
                    <span>{signal.currencyPair.firstFlag} {signal.currencyPair.firstCode} / </span>
                    <span>{signal.currencyPair.secondFlag} {signal.currencyPair.secondCode}</span>
                  </p>
                </div>
                <div className="bg-[#0A0F2B]/70 p-3 rounded-lg">
                  <p className="text-sm text-white/70">Expiração</p>
                  <p className="font-semibold text-lg">
                    {signal.expirationTime.value} {signal.expirationTime.value === 1 ? 'minuto' : 'minutos'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 bg-[#0A0F2B]/70 p-3 rounded-lg">
                  <p className="text-sm text-white/70">Horário de Entrada</p>
                  <p className="font-mono text-xl font-bold">{signal.entryTime}</p>
                </div>
                <div className={`flex-1 p-3 rounded-lg ${getDirectionStyles(signal.direction).bg}`}>
                  <p className="text-sm text-white/70">Direção</p>
                  <p className={`font-mono text-xl font-bold flex items-center justify-center gap-2 ${getDirectionStyles(signal.direction).text}`}>
                    {signal.direction === 'up' 
                      ? <><ArrowUp className="w-6 h-6" strokeWidth={3} /> ACIMA</> 
                      : <><ArrowDown className="w-6 h-6" strokeWidth={3} /> ABAIXO</>}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <a 
                  href="https://exnova.com/lp/start-trading/?aff=751488&aff_model=revenue&afftrack=" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-[#FC3D21] hover:bg-red-600 text-white py-4 rounded-lg text-center text-lg transition-all transform hover:scale-105 animate-pulse"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Acesse a Corretora da NASA
                </a>
                <p className="text-center mt-2 text-sm text-white/80">
                  Aqui os sinais funcionam!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
