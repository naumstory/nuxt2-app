<template>
  <footer class="app-footer">
    <ui-container>
      <div class="app-footer__inner">© 2022</div>
    </ui-container>
  </footer>
</template>

<style lang="scss">
.app-footer {
  border-top: 1px solid var(--color-divider);
  color: var(--color-text-secondary);

  &__inner {
    display: flex;
    align-items: center;
    min-height: 64px;
  }
}
</style>
