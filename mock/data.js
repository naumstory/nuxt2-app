const CURRENCIES = [
  'USD',
  'JPY',
  'EUR',
  'CNY',
  'GBP',
  'KRW',
  'INR',
  'CAD',
  'HKD',
  'BRL',
];

const COMMISSIONS = [1, 2, 3, 4, 5];

const currencyPairs = generateCurrencyPairs();

function generateCurrencyPairs() {
  const currencyPairs = [];

  CURRENCIES.forEach((baseCurrency) => {
    CURRENCIES.forEach((quoteCurrency, i) => {
      if (baseCurrency === quoteCurrency) {
        return;
      }

      currencyPairs.push({
        base_currency: baseCurrency,
        quote_currency: quoteCurrency,
        commission: COMMISSIONS[i % COMMISSIONS.length],
      });
    });
  });

  return currencyPairs;
}

function getExchangeRates() {
  return Object.fromEntries(
    currencyPairs.map((pair, i) => {
      const pairKey = `${pair.base_currency}/${pair.quote_currency}`;
      return [
        pairKey,
        {
          rate: generateRandomRate(),
        },
      ];
    }),
  );
}

function generateRandomRate(min = 10, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { currencyPairs, getExchangeRates };
