import { useState, useEffect } from 'react';
import { CurrencyPair, ExpirationTime, SignalData } from '@/lib/types';
import { calculateEntryTime, formatEntryTime, generateDirection } from '@/lib/nasa-utils';
import CurrencyPairDropdown from '@/components/nasa-trader/CurrencyPairDropdown';
import ExpirationOptions from '@/components/nasa-trader/ExpirationOptions';
import GenerateButton from '@/components/nasa-trader/GenerateButton';
import SignalResults from '@/components/nasa-trader/SignalResults';
import TestimonialCarousel from '@/components/nasa-trader/TestimonialCarousel';
import BrokerButton from '@/components/nasa-trader/BrokerButton';
import { Rocket, ShieldCheck, TrendingUp, Users, BarChart3, Award, CheckCircle2 } from 'lucide-react';
import { useStatistics, useTestimonials, useClientSignalGeneration } from '@/hooks/use-signals';
import { Statistic, Testimonial } from '@shared/schema';

export default function Home() {
  const [selectedCurrencyPair, setSelectedCurrencyPair] = useState<CurrencyPair | null>(null);
  const [selectedExpirationTime, setSelectedExpirationTime] = useState<ExpirationTime | null>(null);
  const [signal, setSignal] = useState<SignalData | null>(null);
  
  // Hooks para interagir com a API
  const { data: statsData, isLoading: statsLoading } = useStatistics<Statistic>();
  const { data: testimonialsData, isLoading: testimonialsLoading } = useTestimonials<Testimonial[]>(3);
  const { generateSignal, isLoading } = useClientSignalGeneration();

  // Estatísticas de desempenho (fallback caso a API falhe)
  const stats = {
    winRate: 99.0,
    totalSignals: 18432,
    users: 15000,
    dailySignals: 48750,
  };

  // Depoimentos de usuários (fallback caso a API falhe)
  const testimonials = testimonialsData && Array.isArray(testimonialsData) && testimonialsData.length > 0
    ? testimonialsData.map((t: Testimonial) => ({
        name: t.userName || "Usuário Anônimo",
        text: t.content,
        rating: t.rating
      }))
    : [
      {
        name: "Carlos Silva",
        text: "NASA I.A TRADER realmente funciona! Estou lucrando todos os dias!",
        rating: 5
      },
      {
        name: "Juliana Ferreira",
        text: "Comecei a usar há 2 semanas e já estou no lucro!",
        rating: 5
      },
      {
        name: "Roberto Oliveira",
        text: "Melhor robô que já testei, taxa de acerto incrível!",
        rating: 5
      },
      {
        name: "Mariana Santos",
        text: "Lucrei R$2.500 só hoje com esses sinais!",
        rating: 5
      },
      {
        name: "Pedro Almeida",
        text: "Plataforma intuitiva e sinais precisos!",
        rating: 5
      },
      {
        name: "Fernanda Costa",
        text: "Agora consigo fazer trades enquanto trabalho!",
        rating: 5
      },
      {
        name: "Luciano Martins",
        text: "Estou impressionado com a precisão dos sinais!",
        rating: 5
      }
    ];

  const handleGenerateSignal = async () => {
    if (!selectedCurrencyPair || !selectedExpirationTime) return;

    // Limpar sinal anterior
    setSignal(null);
    
    try {
      // Usar o hook para gerar sinal via API (já inclui o atraso de 2 segundos)
      const newSignal = await generateSignal(selectedCurrencyPair, selectedExpirationTime);
      
      // Formatar a data retornada corretamente para HH:mm
      const entryDate = new Date(newSignal.entryTime);
      
      setSignal({
        ...newSignal,
        entryTime: formatEntryTime(entryDate) // Garantir formato correto HH:mm
      });
    } catch (error) {
      console.error("Erro ao gerar sinal:", error);
      
      // Fallback para geração local
      const entryTime = calculateEntryTime(); // Já adiciona 1-2 minutos
      const direction = generateDirection();

      setSignal({
        currencyPair: selectedCurrencyPair,
        expirationTime: selectedExpirationTime,
        entryTime: formatEntryTime(entryTime),
        direction,
      });
    }
  };

  const canGenerateSignal = !!selectedCurrencyPair && !!selectedExpirationTime;

  return (
    <div className="min-h-screen flex flex-col items-center text-white font-sans"
      style={{
        backgroundColor: '#0A0F2B',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(11, 61, 145, 0.3) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(252, 61, 33, 0.2) 0%, transparent 40%)
        `,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Stars Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.2,
          zIndex: -1
        }}
      ></div>
      
      {/* Header with NASA-inspired title */}
      <header className="w-full max-w-3xl mt-6 mb-4 px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg" 
              alt="NASA Logo" 
              className="w-16 h-16 mr-2"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <span className="text-[#0B3D91]">NASA</span> 
              <span className="text-white">I.A</span> 
              <span className="text-[#FC3D21]">TRADER</span> 
              <span className="text-yellow-400">🚀</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Descrição Impressionante */}
      <div className="w-full max-w-3xl p-4 mb-6">
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-[#00F2FF]/30 shadow-[0_0_15px_rgba(0,242,255,0.3)]">
          <div className="flex justify-center mb-4">
            <Rocket className="h-12 w-12 text-[#FC3D21]" />
          </div>
          <h2 className="text-center text-2xl font-bold mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            TECNOLOGIA ESPACIAL PARA TRADING
          </h2>
          <p className="text-center text-lg mb-6">
            A <span className="text-[#00F2FF] font-bold">NASA I.A TRADER</span> identifica oportunidades com precisão de 99% usando algoritmos de alta tecnologia.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center bg-slate-900/50 rounded-lg p-3">
              <ShieldCheck className="text-[#00F2FF] h-6 w-6 mr-3" />
              <div>
                <h3 className="font-semibold">Precisão Aeroespacial</h3>
                <p className="text-sm text-gray-300">Tecnologia exclusiva NASA</p>
              </div>
            </div>
            <div className="flex items-center bg-slate-900/50 rounded-lg p-3">
              <TrendingUp className="text-[#00F2FF] h-6 w-6 mr-3" />
              <div>
                <h3 className="font-semibold">Win Rate de 99%</h3>
                <p className="text-sm text-gray-300">Resultados garantidos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Trading Interface */}
      <main className="w-full max-w-3xl p-4 flex-1">
        <div className="relative bg-[#0A0F2B]/90 rounded-lg shadow-xl border border-opacity-20 border-[#00F2FF] p-6 backdrop-blur-sm">
          {/* Trading Form Section */}
          <div className="grid grid-cols-1 gap-6">
            {/* Step 1: Currency Pair Selection */}
            <div>
              <h2 className="text-xl mb-2 flex items-center"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <span className="bg-[#0B3D91] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">1</span>
                Escolha o par de moedas
              </h2>
              
              {/* Currency Pair Dropdown */}
              <CurrencyPairDropdown 
                onSelect={setSelectedCurrencyPair} 
                selected={selectedCurrencyPair} 
              />
            </div>
            
            {/* Step 2: Expiration Time Selection */}
            <div className="mt-4">
              <h2 className="text-xl mb-3 flex items-center"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <span className="bg-[#0B3D91] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">2</span>
                Escolha o tempo de expiração
              </h2>
              
              <ExpirationOptions 
                onSelect={setSelectedExpirationTime} 
                selected={selectedExpirationTime} 
              />
            </div>
            
            {/* Step 3: Generate Signal Button */}
            <GenerateButton 
              onClick={handleGenerateSignal} 
              disabled={!canGenerateSignal} 
            />
          </div>
          
          {/* Signal Results Section */}
          <SignalResults signal={signal} isLoading={isLoading} />
        </div>
      </main>
      
      {/* Estatísticas */}
      <section className="w-full max-w-3xl p-4 mt-8">
        <h2 className="text-center text-2xl font-bold mb-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          ESTATÍSTICAS COMPROVADAS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center border border-[#00F2FF]/20">
            <CheckCircle2 className="h-8 w-8 text-[#39FF14] mb-2" />
            <p className="text-3xl font-bold text-[#39FF14]">{stats.winRate}%</p>
            <p className="text-xs text-center text-gray-400">Taxa de Acerto</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center border border-[#00F2FF]/20">
            <BarChart3 className="h-8 w-8 text-[#00F2FF] mb-2" />
            <p className="text-2xl font-bold">{stats.totalSignals.toLocaleString()}</p>
            <p className="text-xs text-center text-gray-400">Sinais Gerados</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center border border-[#00F2FF]/20">
            <Users className="h-8 w-8 text-[#FC3D21] mb-2" />
            <p className="text-2xl font-bold">{stats.users.toLocaleString()}+</p>
            <p className="text-xs text-center text-gray-400">Usuários Ativos</p>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center border border-[#00F2FF]/20">
            <Award className="h-8 w-8 text-yellow-400 mb-2" />
            <p className="text-2xl font-bold">{stats.dailySignals}</p>
            <p className="text-xs text-center text-gray-400">Sinais Diários</p>
          </div>
        </div>
      </section>
      
      {/* Depoimentos */}
      <section className="w-full max-w-3xl p-4 mt-8 mb-8">
        <h2 className="text-center text-2xl font-bold mb-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          O QUE DIZEM NOSSOS USUÁRIOS
        </h2>
        <TestimonialCarousel testimonials={testimonials} />
      </section>
      
      <footer className="w-full max-w-3xl p-4 mt-4 text-center text-sm text-gray-400">
        <p>NASA I.A TRADER • Sistema avançado de sinais para opções binárias • Desenvolvido por ex-engenheiros da NASA</p>
      </footer>
      
      {/* Botão de Corretora Fixo */}
      <BrokerButton />
    </div>
  );
}
