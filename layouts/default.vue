<template>
  <div style="overflow: hidden; height: 100vh;">
    <base-navbar />
    <div id="app">
      <base-sidebar />
      <div class="authenticated-screen__app">
        <nuxt />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<Layout>({
  name: 'Layout',
  middleware: 'isAuthenticated',
})
export default class Layout extends Vue {}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
$bg-gray-common: #e5e5e5;
#app {
  height: 100vh;
  overflow-x: hidden;
  display: flex;
}
.authenticated-screen {
  &__app {
    flex: 1;
    overflow-x: auto;
    width: 100%;
    margin: 0 auto;
    padding: $unit-10;
    background-color: $bg-gray-common;
  }
}
</style>
