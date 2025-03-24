import { ExpirationTime } from '@/lib/types';
import { EXPIRATION_TIMES } from '@/lib/nasa-utils';

interface ExpirationOptionsProps {
  onSelect: (expiration: ExpirationTime) => void;
  selected: ExpirationTime | null;
}

export default function ExpirationOptions({ onSelect, selected }: ExpirationOptionsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {EXPIRATION_TIMES.map((time) => (
        <button
          key={time.value}
          className={`
            bg-[#0A0F2B] border border-gray-700 hover:border-[#00F2FF] rounded-lg p-3 
            transition-all flex flex-col items-center
            ${selected?.value === time.value ? 'shadow-[0_0_5px_#00F2FF,0_0_10px_#00F2FF] scale-105' : ''}
          `}
          onClick={() => onSelect(time)}
          type="button"
        >
          <span className="text-lg font-semibold">{time.value}</span>
          <span className="text-sm text-white/80">
            {time.value === 1 ? 'minuto' : 'minutos'}
          </span>
        </button>
      ))}
    </div>
  );
}
