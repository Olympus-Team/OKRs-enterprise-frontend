<template>
  <el-row class="reset-password-page" type="flex" justify="center" align="center">
    <el-col :xs="24" :sm="24" :md="8" :lg="8" class="reset-password__image">
      <img src="@/assets/images/account/tiny-reset-password.png" alt="reset password image" />
    </el-col>
    <el-col :xs="24" :sm="24" :md="8" :lg="8">
      <account-reset-password :token="token" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AuthRepository from '@/repositories/AuthRepository';
import { notifyErrorResetPassword } from '@/constants/app.notify';
@Component<ResetPasswordPage>({
  name: 'ResetPasswordPage',
  head() {
    return {
      title: 'Đặt lại mật khẩu',
    };
  },
  middleware: 'isGuest',
  watchQuery: ['token'],
  async asyncData({ query, redirect }) {
    if (query.token) {
      try {
        await AuthRepository.verifyResetPassword(query.token as string);
        return {
          token: query.token,
        };
      } catch (error) {
        notifyErrorResetPassword(error);
        redirect('/dang-nhap');
      }
    } else {
      redirect('/dang-nhap');
    }
  },
  layout: 'empty',
})
export default class ResetPasswordPage extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.reset-password-page {
  padding-top: calc(100vh * (3 / 24));
  @include breakpoint-down(phone) {
    flex-direction: column;
    padding-top: 0;
  }
  &__image {
    align-self: center;
  }
}
</style>
