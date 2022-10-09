<template>
  <span class="field-select">
    <ui-button class="field-select__button">
      {{ value }}
    </ui-button>

    <select
      :value="value"
      class="field-select__input"
      @change="$emit('change', $event.target.value)"
    >
      <option v-for="(option, i) in options" :key="i" :value="option">
        {{ option }}
      </option>
    </select>
  </span>
</template>

<script>
export default {
  model: {
    event: 'change',
  },

  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@import '@design';

.field-select {
  position: relative;

  &__button {
    width: 100%;
  }

  &__input {
    @include overlay;
    @include input-reset;

    opacity: 0;
    cursor: pointer;
  }
}
</style>
