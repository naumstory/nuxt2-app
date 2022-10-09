<template>
  <div class="layout-default">
    <app-header />

    <div class="layout-default__content">
      <ui-container>
        <nuxt />
      </ui-container>
    </div>

    <app-footer />
  </div>
</template>

<style lang="scss">
.layout-default {
  position: relative;

  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__content {
    display: grid;
    grid-template-columns: 100%;
    flex: 1;
    padding: var(--layout-gap-l) 0;
  }
}
</style>
