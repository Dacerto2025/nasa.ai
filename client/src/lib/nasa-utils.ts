import { format, addMinutes } from 'date-fns';
import { CurrencyPair, ExpirationTime } from './types';

export const CURRENCY_PAIRS: CurrencyPair[] = [
  {
    value: 'EUR/USD',
    label: 'EUR / USD',
    firstFlag: '🇪🇺',
    firstCode: 'EUR',
    secondFlag: '🇺🇸',
    secondCode: 'USD'
  },
  {
    value: 'GBP/USD',
    label: 'GBP / USD',
    firstFlag: '🇬🇧',
    firstCode: 'GBP',
    secondFlag: '🇺🇸',
    secondCode: 'USD'
  },
  {
    value: 'USD/CAD',
    label: 'USD / CAD',
    firstFlag: '🇺🇸',
    firstCode: 'USD',
    secondFlag: '🇨🇦',
    secondCode: 'CAD'
  },
  {
    value: 'USD/JPY',
    label: 'USD / JPY',
    firstFlag: '🇺🇸',
    firstCode: 'USD',
    secondFlag: '🇯🇵',
    secondCode: 'JPY'
  },
  {
    value: 'AUD/USD',
    label: 'AUD / USD',
    firstFlag: '🇦🇺',
    firstCode: 'AUD',
    secondFlag: '🇺🇸',
    secondCode: 'USD'
  },
  {
    value: 'USD/CHF',
    label: 'USD / CHF',
    firstFlag: '🇺🇸',
    firstCode: 'USD',
    secondFlag: '🇨🇭',
    secondCode: 'CHF'
  },
  {
    value: 'NZD/USD',
    label: 'NZD / USD',
    firstFlag: '🇳🇿',
    firstCode: 'NZD',
    secondFlag: '🇺🇸',
    secondCode: 'USD'
  },
  {
    value: 'USD/BRL',
    label: 'USD / BRL',
    firstFlag: '🇺🇸',
    firstCode: 'USD',
    secondFlag: '🇧🇷',
    secondCode: 'BRL'
  }
];

export const EXPIRATION_TIMES: ExpirationTime[] = [
  { value: 1, label: '1 minuto' },
  { value: 2, label: '2 minutos' },
  { value: 5, label: '5 minutos' }
];

// Get current time in Brasília timezone
export const getBrasiliaTime = (): Date => {
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

// Format time for display (HH:mm:ss)
export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm:ss');
};

// Format time for entry (HH:mm)
export const formatEntryTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

// Calculate entry time (1 or 2 minutes in the future from current time)
export const calculateEntryTime = (): Date => {
  const now = getBrasiliaTime();
  // Determinar aleatoriamente se adiciona 1 ou 2 minutos
  const addMinutesCount = Math.random() < 0.5 ? 1 : 2;
  return addMinutes(now, addMinutesCount);
};

// Generate a random direction (up or down)
export const generateDirection = (): 'up' | 'down' => {
  return Math.random() > 0.5 ? 'up' : 'down';
};

// Find currency pair by value
export const findCurrencyPair = (value: string): CurrencyPair | undefined => {
  return CURRENCY_PAIRS.find(pair => pair.value === value);
};

// Find expiration time by value
export const findExpirationTime = (value: number): ExpirationTime | undefined => {
  return EXPIRATION_TIMES.find(time => time.value === value);
};
