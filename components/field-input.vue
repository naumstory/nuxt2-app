<template>
  <input
    :value="value"
    class="field-input"
    type="text"
    v-bind="$attrs"
    v-on="{
      ...$listeners,
      input: (event) => $emit('input', event.target.value),
    }"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },
};
</script>

<style lang="scss">
@import '@design';

.field-input {
  @include input-reset;
  @include typography('body-main');

  width: 100%;
  height: var(--input-height-m);
  padding: 0 var(--layout-gap-m);

  border-radius: var(--border-radius-s);
  border: 1px solid var(--color-divider);
}
</style>
