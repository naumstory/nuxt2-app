<template>
  <field-input
    :value="value"
    v-bind="$attrs"
    v-on="{
      ...$listeners,
      paste: filterPasteValue,
      input: emitSanitizedValue,
    }"
  />
</template>

<script>
const FLOAT_DELIMITER = '.';
const MAX_CHUNK_COUNT = 2;

export default {
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },

  methods: {
    filterPasteValue(event) {
      const data = event.clipboardData.getData('text');

      if (isNaN(data)) {
        event.preventDefault();
      }
    },

    emitSanitizedValue(value) {
      const sanitizedValue = value
        .replace(/[^\d.]/g, '')
        .replace(/^0+/g, '')
        .replace(/\.{2,}/g, '.');
      const sanitizedChunksValue = sanitizedValue
        .split(FLOAT_DELIMITER)
        .slice(0, MAX_CHUNK_COUNT)
        .join(FLOAT_DELIMITER);

      const isDirtyValue = isNaN(value) || sanitizedChunksValue === this.value;
      if (isDirtyValue) {
        this.$emit('input', null);
      }

      this.$emit('input', sanitizedChunksValue);
    },
  },
};
</script>
