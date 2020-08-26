<template>
  <el-row class="change-password-page" type="flex" justify="center" align="center">
    <el-col :xs="24" :sm="24" :md="8" :lg="8" class="change-password-page__image">
      <img src="@/assets/images/account/tiny-change-password.png" alt="login image" />
    </el-col>
    <el-col :xs="24" :sm="24" :md="7" :lg="7">
      <account-change-password />
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component<ChangePasswordPage>({
  name: 'ChangePasswordPage',
  head() {
    return {
      title: 'Đổi mật khẩu',
    };
  },
})
export default class ChangePasswordPage extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.change-password-page {
  @include account-layout;
  @include breakpoint-down(phone) {
    flex-direction: column;
    padding: 0;
    &__image {
      display: flex;
      justify-content: center;
      margin-right: 0 !important;
      margin-left: 0 !important;
      img {
        padding: $unit-4;
        width: inherit;
      }
    }
  }
  &__image {
    align-self: center;
    margin-right: $unit-6;
    margin-left: -$unit-40;
  }
}
</style>
