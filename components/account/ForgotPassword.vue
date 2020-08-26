<template>
  <el-row class="fpass">
    <div class="fpass__title">
      <span>Quên mật khẩu</span>
    </div>
    <el-form
      ref="forgotPasswordForm"
      :model="forgotPasswordForm"
      :rules="rules"
      :status-icon="true"
      :hide-required-asterisk="false"
      label-width="150px"
      label-position="top"
      @submit.native.prevent="handleForgotPasswordForm"
    >
      <el-form-item prop="email" label="Email liên kết" class="custom-label">
        <el-input v-model="forgotPasswordForm.email" class="fpass__email" placeholder="Tên đăng nhập hoặc email"></el-input>
      </el-form-item>
      <el-row type="flex" justify="space-between" class="fpass__warning">
        <el-col :span="1" class="fpass__warning--star">(*)</el-col>
        <el-col :span="23">
          <p>
            <strong>Quên mật khẩu ?</strong> Điền email liên kết với tài khoản của bạn. Chúng tôi sẽ gửi đến địa chỉ email đó một link liên kết giúp
            bạn đặt lại mật khẩu mới.
          </p>
        </el-col>
      </el-row>

      <el-row class="fpass__action" type="flex" justify="space-between">
        <el-col :span="24">
          <el-button :loading="loading" class="el-button el-button--purple el-button--medium" @click="handleForgotPasswordForm">
            Lấy lại mật khẩu
          </el-button>
        </el-col>
        <el-col :span="24">
          <nuxt-link to="/dang-nhap"><strong>Quay lại trang</strong> <span class="fpass__action--login">Đăng nhập</span></nuxt-link>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';

import { max255Char } from './account.constant';
import { notificationConfig } from '@/constants/app.constant';
import { Maps, Rule } from '@/constants/app.type';
import AuthRepository from '@/repositories/AuthRepository';
import { MailResetPassDTO } from '@/constants/app.interface';
@Component<ForgotPassword>({
  name: 'Login',
})
export default class ForgotPassword extends Vue {
  private loading: boolean = false;
  private forgotPasswordForm: MailResetPassDTO = {
    email: '',
  };

  private handleForgotPasswordForm(): void {
    this.loading = true;
    (this.$refs.forgotPasswordForm as Form).validate(async (isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        try {
          await AuthRepository.sendMailToResetPassword(this.forgotPasswordForm);
          this.loading = false;
          this.$notify.success({
            ...notificationConfig,
            message: 'Đã gửi yêu cầu. Vui lòng kiểm tra email của bạn',
          });
          this.$router.push('/dang-nhap');
        } catch (error) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      }
      if (invalidatedFields) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }

  public rules: Maps<Rule[]> = {
    email: [
      { required: true, message: 'Vui lòng nhập địa chỉ email', trigger: 'blur' },
      { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' },
      max255Char,
    ],
  };
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.fpass {
  @include account-form;
  &__title {
    text-align: center;
    font-size: 1.75rem;
    color: $neutral-primary-4;
    padding-bottom: $unit-4;
  }
  &__warning {
    font-size: $unit-2;
    &--star {
      padding-right: $unit-6;
    }
  }
  &__action {
    flex-direction: column;
    &--login {
      color: $blue-primary-2;
    }
    .el-col {
      a {
        text-decoration: none;
        color: $neutral-primary-4;
      }
      text-align: center;
      &:nth-child(2) {
        padding-top: $unit-4;
      }
    }
  }
  .el-row {
    .el-col {
      font-size: 0.875rem;
      &:first-child {
        color: #f56c6c;
      }
    }
  }
  .el-button {
    margin-top: $unit-10;
    width: 100%;
  }
}
</style>
