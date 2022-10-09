<template>
  <div class="form-exchange">
    <transition name="fade" mode="out-in">
      <ui-alert v-if="exchangeResponse" key="exchangeSuccess" variant="success">
        {{ messageExchangeResponse }}

        <template #footer>
          <ui-button @click.native="resetForm">Обменять ещё</ui-button>
        </template>
      </ui-alert>

      <ui-alert v-else-if="isExchangeError" key="exchangeError" variant="error">
        Обмен не удался :(

        <template #footer>
          <ui-button @click.native="resetForm">Попробовать ещё раз</ui-button>
        </template>
      </ui-alert>

      <div v-else-if="isInited" key="form" class="form-exchange__inner">
        <ui-card :title="`Обменять ${baseCurrency} на ${quoteCurrency}`">
          <form autocomplete="off" @submit.prevent="exchange">
            <div class="form-exchange__list">
              <field-wrapper label="Вы платите">
                <div class="form-exchange__input">
                  <field-input-number
                    v-model="baseValue"
                    placeholder="Сумма платежа"
                    required
                    @input="calculateQuoteValue"
                    @focus="setCalculateFromBase"
                  />

                  <field-select
                    v-model="baseCurrency"
                    :options="currencies"
                    @change="calculateQuoteValue(), setCalculateFromBase()"
                  />
                </div>
              </field-wrapper>

              <field-wrapper label="Вы получаете">
                <div class="form-exchange__input">
                  <field-input-number
                    v-model="quoteValue"
                    placeholder="Сумма получения"
                    required
                    @input="calculateBaseValue"
                    @focus="setCalculateFromQuote"
                  />

                  <field-select
                    v-model="quoteCurrency"
                    :options="quoteCurrencies"
                    @change="calculateBaseValue(), setCalculateFromQuote()"
                  />
                </div>
              </field-wrapper>

              <div class="form-exchange__action">
                <ui-button
                  type="submit"
                  wide
                  :disabled="$fetchState.pending || isPendingExchange"
                >
                  {{ labelAction }}
                </ui-button>
              </div>
            </div>
          </form>
        </ui-card>

        <ui-card title="Краткое описание">
          <div class="form-exchange__list">
            <div class="form-exchange__info-row">
              Курс: {{ labelExchangeRate }}
            </div>

            <div class="form-exchange__info-row">
              Комиссия: {{ labelComission }}
            </div>
          </div>
        </ui-card>
      </div>

      <ui-loader v-else key="loader" />
    </transition>
  </div>
</template>

<script>
const EXCHANGE_RATES_UPDATE_INTERVAL_MS = 30000;
const VALUE_TYPES = {
  BASE: 'base',
  QUOTE: 'quote',
};

export default {
  data() {
    return {
      isInited: false,

      isPendingExchange: false,
      isExchangeError: false,
      exchangeResponse: null,

      currencyPairs: [],
      exchangeRates: {},

      baseCurrency: null,
      baseValue: '',

      quoteCurrency: null,
      quoteValue: '',

      calculateFrom: VALUE_TYPES.BASE,
    };
  },

  async fetch() {
    this.exchangeRates = await this.$axios.$get('/api/currencies/pairs/rates');
    this.currencyPairs = await this.$axios.$get('/api/currencies/pairs');

    this.isInited = true;
  },

  fetchOnServer: false,

  computed: {
    currencies() {
      return [...new Set(this.currencyPairs.map((p) => p.base_currency))];
    },
    quoteCurrencies() {
      return this.currencies.filter((c) => c !== this.baseCurrency);
    },

    commission() {
      return this.currencyPairs.find(
        (pair) =>
          pair.base_currency === this.baseCurrency &&
          pair.quote_currency === this.quoteCurrency,
      )?.commission;
    },
    commissionRate() {
      return 1 - this.commission / 100;
    },
    rate() {
      const pairKey = `${this.baseCurrency}/${this.quoteCurrency}`;
      return this.exchangeRates[pairKey]?.rate;
    },

    labelExchangeRate() {
      return `1 ${this.baseCurrency} = ${1 * this.rate} ${this.quoteCurrency}`;
    },
    labelComission() {
      return `${this.commission}%`;
    },
    labelAction() {
      return this.$fetchState.pending ? 'Обновляем данные...' : 'Обменять';
    },

    messageExchangeResponse() {
      return (
        this.exchangeResponse &&
        `Обменяли ${this.exchangeResponse.base_value} ${this.exchangeResponse.base_currency} на ${this.exchangeResponse.quote_value} ${this.exchangeResponse.quote_currency}`
      );
    },
  },

  watch: {
    currencies() {
      const isValidBaseCurrency =
        this.baseCurrency && this.currencies.includes(this.baseCurrency);
      if (isValidBaseCurrency) {
        return;
      }

      this.baseCurrency = this.currencies[0];
    },

    baseCurrency() {
      const hasOldQuoteCurrency = this.quoteCurrencies.find(
        (c) => c === this.quoteCurrency,
      );
      if (hasOldQuoteCurrency) {
        return;
      }

      this.quoteCurrency = this.quoteCurrencies[0];
      this.calculateQuoteValue();
    },

    rate() {
      this.calculateValues();
    },
  },

  mounted() {
    const destroyAutoupdater = this.initExchangeRatesAutoupdater();
    this.$once('hook:beforeDestroy', destroyAutoupdater);
  },

  methods: {
    initExchangeRatesAutoupdater() {
      const timerId = setInterval(
        this.$fetch,
        EXCHANGE_RATES_UPDATE_INTERVAL_MS,
      );
      return () => clearInterval(timerId);
    },

    calculateBaseValue() {
      this.baseValue = this.quoteValue
        ? this.quoteValue / this.commissionRate / this.rate
        : null;
    },
    calculateQuoteValue() {
      this.quoteValue = this.baseValue
        ? this.baseValue * this.commissionRate * this.rate
        : null;
    },
    calculateValues() {
      switch (this.calculateFrom) {
        case VALUE_TYPES.QUOTE:
          this.calculateBaseValue();
          break;
        case VALUE_TYPES.BASE:
        default:
          this.calculateQuoteValue();
          break;
      }
    },
    setCalculateFromBase() {
      this.calculateFrom = VALUE_TYPES.BASE;
    },
    setCalculateFromQuote() {
      this.calculateFrom = VALUE_TYPES.QUOTE;
    },

    resetForm() {
      this.baseValue = null;
      this.quoteValue = null;
      this.exchangeResponse = null;
      this.isExchangeError = false;
    },

    async exchange() {
      this.isPendingExchange = true;

      const requestBody = {
        base_currency: this.baseCurrency,
        base_value: this.baseValue,
        quote_currency: this.quoteCurrency,
        quote_value: this.quoteValue,
      };

      try {
        this.exchangeResponse = await this.$axios.$post(
          '/api/exchange',
          requestBody,
        );
      } catch {
        this.isExchangeError = true;
      } finally {
        this.isPendingExchange = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import '@design';

.form-exchange {
  &__inner {
    display: grid;
    row-gap: var(--layout-gap-m);

    @include tablet {
      grid-template-columns: 1fr 1fr;
      align-items: start;
      column-gap: var(--layout-gap-m);
    }
  }

  &__list {
    display: grid;
    row-gap: var(--layout-gap-m);
  }

  &__input {
    display: grid;
    grid-template-columns: 1fr 80px;
    column-gap: var(--layout-gap-s);
  }

  &__action {
    margin-top: var(--layout-gap-m);
  }

  &__info-row {
    @include typography('body-main');
  }
}
</style>
