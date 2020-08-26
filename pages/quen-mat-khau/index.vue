<template>
  <el-row class="forgot-password-page" type="flex" justify="center" align="center">
    <el-col :xs="24" :sm="24" :md="8" :lg="8" class="forgot-password-page__image">
      <img src="@/assets/images/account/tiny-forgot-password.png" alt="login image" />
    </el-col>
    <el-col :xs="24" :sm="24" :md="8" :lg="8">
      <account-forgot-password />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<ForgotPasswordPage>({
  name: 'ForgotPasswordPage',
  layout: 'empty',
  middleware: 'isGuest',
  head() {
    return {
      title: 'Quên mật khẩu',
    };
  },
})
export default class ForgotPasswordPage extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.forgot-password-page {
  @include account-layout;
  @include breakpoint-down(phone) {
    padding-top: 0;
    flex-direction: column;
  }
  &__image {
    align-self: center;
  }
  .el-col {
    &:nth-child(2) {
      padding-top: $unit-12;
    }
  }
}
</style>
