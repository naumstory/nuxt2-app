<template>
  <div
    class="ui-alert"
    :class="{
      [`ui-alert_variant_${variant}`]: variant,
    }"
  >
    <div class="ui-alert__inner">
      <div class="ui-alert__body">
        <slot>
          {{ message }}
        </slot>
      </div>

      <div v-if="$slots.footer" class="ui-alert__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
const VARIANTS = {
  SUCCESS: 'success',
  ERROR: 'error',
};

export default {
  props: {
    message: {
      type: String,
      default: null,
    },
    variant: {
      type: String,
      default: VARIANTS.SUCCESS,
      validator: (val) => Object.values(VARIANTS).includes(val),
    },
  },
};
</script>

<style lang="scss">
.ui-alert {
  border: 1px solid;
  border-radius: var(--border-radius-s);

  &_variant {
    &_success {
      border-color: var(--color-success-divider);
      background-color: var(--color-success-background);
      color: var(--color-success-text);
    }

    &_error {
      border-color: var(--color-error-divider);
      background-color: var(--color-error-background);
      color: var(--color-error-text);
    }
  }

  &__inner {
    padding: var(--layout-gap-m);
  }

  &__footer {
    margin-top: var(--layout-gap-m);
  }
}
</style>
