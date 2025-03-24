import { Satellite } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export default function GenerateButton({ onClick, disabled }: GenerateButtonProps) {
  return (
    <div 
      className={`mt-6 flex justify-center transition-all duration-300 ${disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}
    >
      <button
        disabled={disabled}
        onClick={onClick}
        className={`
          bg-[#0B3D91] text-white font-bold py-4 px-8 rounded-lg text-xl
          transition-all transform hover:scale-105 relative overflow-hidden
          ${disabled ? 'cursor-not-allowed' : 'animate-[glow_2s_infinite]'}
        `}
        style={{
          fontFamily: "'Orbitron', sans-serif",
          boxShadow: disabled ? 'none' : '0 0 5px #00F2FF, 0 0 10px #00F2FF, 0 0 15px #00F2FF'
        }}
      >
        <span className="relative z-10 flex items-center">
          <Satellite className="mr-2 h-5 w-5" />
          Gerar Sinal
        </span>
      </button>
    </div>
  );
}
