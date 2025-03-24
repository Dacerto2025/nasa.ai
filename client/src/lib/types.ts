export interface CurrencyPair {
  value: string;
  label: string;
  firstFlag: string;
  firstCode: string;
  secondFlag: string;
  secondCode: string;
}

export interface ExpirationTime {
  value: number;
  label: string;
}

export interface SignalData {
  currencyPair: CurrencyPair;
  expirationTime: ExpirationTime;
  entryTime: string;
  direction: 'up' | 'down';
}
