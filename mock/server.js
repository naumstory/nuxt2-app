import { createServer } from 'miragejs';

import { currencyPairs, getExchangeRates } from './data';

function initServer() {
  createServer({
    routes() {
      this.namespace = 'api';

      this.get('/currencies/pairs', () => currencyPairs);

      this.get('/currencies/pairs/rates', () => getExchangeRates());

      this.post('/exchange', (schema, request) => request.requestBody);
    },
  });
}

export { initServer };
