<template>
  <header class="app-header">
    <ui-container>
      <div class="app-header__inner">
        <ui-logo />
      </div>
    </ui-container>
  </header>
</template>

<style lang="scss">
.app-header {
  background-color: var(--color-accent-background);
  color: var(--color-accent-text);
  box-shadow: var(--box-shadow-main);

  &__inner {
    display: flex;
    align-items: center;
    min-height: 64px;
  }
}
</style>
