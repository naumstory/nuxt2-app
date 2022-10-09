<template>
  <div class="ui-container">
    <slot />
  </div>
</template>

<style lang="scss">
.ui-container {
  width: 100%;
  max-width: var(--layout-width-m);
  padding: 0 var(--layout-gap-l);
  margin: 0 auto;
}
</style>
