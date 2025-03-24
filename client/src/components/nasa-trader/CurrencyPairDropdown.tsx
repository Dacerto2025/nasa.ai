import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CURRENCY_PAIRS } from '@/lib/nasa-utils';
import { CurrencyPair } from '@/lib/types';

interface CurrencyPairDropdownProps {
  onSelect: (currencyPair: CurrencyPair) => void;
  selected: CurrencyPair | null;
}

export default function CurrencyPairDropdown({ onSelect, selected }: CurrencyPairDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (pair: CurrencyPair) => {
    onSelect(pair);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        className={`w-full bg-[#0A0F2B] border border-gray-700 hover:border-[#00F2FF] rounded-lg p-3 flex items-center justify-between transition-colors ${selected ? 'shadow-[0_0_5px_#00F2FF,0_0_10px_#00F2FF]' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {selected ? (
          <span className="flex items-center">
            <span className="mr-1">{selected.firstFlag}</span>
            <span>{selected.firstCode} /</span>
            <span className="mx-1">{selected.secondFlag}</span>
            <span>{selected.secondCode}</span>
          </span>
        ) : (
          <span>Selecione um par de moedas</span>
        )}
        <ChevronDown className="h-4 w-4 text-[#00F2FF]" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#0A0F2B] border border-gray-700 rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
          <ul className="py-2">
            {CURRENCY_PAIRS.map((pair) => (
              <li
                key={pair.value}
                className="px-4 py-3 hover:bg-black/40 cursor-pointer flex items-center"
                onClick={() => handleSelect(pair)}
              >
                <span>{pair.firstFlag}</span>
                <span className="ml-2">{pair.firstCode} /</span>
                <span className="ml-2">{pair.secondFlag}</span>
                <span className="ml-2">{pair.secondCode}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
