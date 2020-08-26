<template>
  <el-row class="login-page">
    <el-col :xs="24" :sm="24" :md="8" :lg="8" class="login-page__image">
      <img src="@/assets/images/account/tiny-login.png" alt="login image" />
    </el-col>
    <el-col :xs="24" :sm="24" :md="7" :lg="7">
      <account-login />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<LoginPage>({
  name: 'LoginPage',
  head() {
    return {
      title: 'Đăng nhập',
    };
  },
  middleware: 'isGuest',
  layout: 'empty',
})
export default class LoginPage extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.login-page {
  @include account-layout;
  @include breakpoint-down('phone') {
    padding-top: 0;
    flex-direction: column;
  }
}
</style>
