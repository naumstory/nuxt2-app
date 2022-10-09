<template>
  <div class="field-wrapper">
    <div v-if="label || $slots.label" class="field-wrapper__header">
      <span class="field-wrapper__label">
        <slot name="label">
          {{ label }}
        </slot>
      </span>
    </div>

    <div class="field-wrapper__body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null,
    },
    tip: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss">
@import '@design';

.field-wrapper {
  &__header {
    margin-bottom: var(--layout-gap-s);
  }

  &__label {
    @include typography('h5');
  }
}
</style>
