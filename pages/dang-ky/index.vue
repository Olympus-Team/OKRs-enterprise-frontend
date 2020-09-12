<template>
  <el-row class="register-page">
    <el-col :xs="24" :sm="24" :md="8" :lg="8" class="register-page__image">
      <img src="@/assets/images/account/tiny-register.png" alt="register image" />
    </el-col>
    <el-col :xs="24" :sm="24" :md="7" :lg="7">
      <account-register :token="token" />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AuthRepository from '@/repositories/AuthRepository';
import { notifyErrorRegister } from '@/constants/app.notify';

@Component<LoginPage>({
  name: 'LoginPage',
  head() {
    return {
      title: 'Đăng ký',
    };
  },
  middleware: 'isGuest',
  layout: 'empty',
  watchQuery: ['token'],
  async asyncData({ query, redirect }) {
    if (query.token) {
      try {
        await AuthRepository.verifyLinkInvite(query.token as string);
        return {
          token: query.token,
        };
      } catch (error) {
        notifyErrorRegister(error);
        redirect('/dang-nhap');
      }
    } else {
      redirect('/dang-nhap');
    }
  },
})
export default class LoginPage extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.register-page {
  min-height: calc(100vh - 45px);
  padding: 1rem 0;
  display: flex;
  place-content: center;
  align-items: center;
  @include breakpoint-down(phone) {
    flex-direction: column;
    padding: 0;
  }
  &__image {
    align-self: center;
  }
}
</style>
