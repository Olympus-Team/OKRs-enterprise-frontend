<template>
  <fragment>
    <base-navbar />
    <div class="authenticated-screen">
      <base-sidebar />
      <div class="authenticated-screen__app">
        <nuxt />
      </div>
    </div>
  </fragment>
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
.authenticated-screen {
  height: 92vh;
  display: flex;
  &__app {
    background-color: $bg-gray-common;
    min-height: calc(100vh - 60px);
    margin-left: 170px;
    width: 100%;
    padding: $unit-8;
  }
}
</style>
