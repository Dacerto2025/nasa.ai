// Define currency pairs with their flags
export interface CurrencyPair {
  value: string;
  label: string;
  flags: string;
}

export const currencyPairs: CurrencyPair[] = [
  {
    value: "EUR/USD",
    label: "EUR / USD",
    flags: "🇪🇺 EUR / 🇺🇸 USD"
  },
  {
    value: "GBP/USD",
    label: "GBP / USD",
    flags: "🇬🇧 GBP / 🇺🇸 USD"
  },
  {
    value: "USD/CAD",
    label: "USD / CAD",
    flags: "🇺🇸 USD / 🇨🇦 CAD"
  },
  {
    value: "USD/JPY",
    label: "USD / JPY",
    flags: "🇺🇸 USD / 🇯🇵 JPY"
  },
  {
    value: "AUD/USD",
    label: "AUD / USD",
    flags: "🇦🇺 AUD / 🇺🇸 USD"
  },
  {
    value: "USD/CHF",
    label: "USD / CHF",
    flags: "🇺🇸 USD / 🇨🇭 CHF"
  },
  {
    value: "NZD/USD",
    label: "NZD / USD",
    flags: "🇳🇿 NZD / 🇺🇸 USD"
  },
  {
    value: "USD/BRL",
    label: "USD / BRL",
    flags: "🇺🇸 USD / 🇧🇷 BRL"
  },
];
