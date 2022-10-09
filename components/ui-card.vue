<template>
  <div class="ui-card">
    <div class="ui-card__inner">
      <div v-if="title" class="ui-card__header">
        <span class="ui-card__title">
          {{ title }}
        </span>
      </div>

      <div class="ui-card__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss">
@import '@design';

.ui-card {
  background-color: var(--color-highlight-background);
  color: var(--color-highlight-text);
  border-radius: var(--border-radius-s);
  border: 1px solid var(--color-divider);

  &__inner {
    padding: var(--layout-gap-l);
  }

  &__header {
    margin-bottom: var(--layout-gap-l);
    padding-bottom: var(--layout-gap-m);

    border-bottom: 1px solid var(--color-divider);
  }

  &__title {
    @include typography('h2');
  }
}
</style>
