<template>
  <button
    class="ui-button"
    :class="{
      'ui-button_wide': wide,
    }"
    type="button"
  >
    <span class="ui-button__label">
      <slot>
        {{ label }}
      </slot>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null,
    },
    wide: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
@import '@design';

.ui-button {
  @include button-reset;

  height: var(--input-height-m);
  padding: 0 var(--layout-gap-m);

  background-color: var(--color-accent-background);
  color: var(--color-accent-text);
  border-radius: var(--border-radius-s);
  transition: filter var(--transition-speed-m) ease-out,
    opacity var(--transition-speed-m) ease-out;

  &:not(:disabled):active {
    transform: translateY(1px);
  }

  &:disabled {
    filter: grayscale(1);
    opacity: 0.5;
  }

  &_wide {
    width: 100%;
  }

  &__label {
    @include typography('button-main');
  }
}
</style>
