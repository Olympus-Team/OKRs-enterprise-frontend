<template>
  <el-row class="change-password" type="flex" justify="center">
    <div class="change-password__title">
      <span>Đổi mật khẩu</span>
    </div>
    <el-form
      ref="changePasswordForm"
      class="change-password__form"
      :model="changePasswordForm"
      :rules="rules"
      :status-icon="true"
      :hide-required-asterisk="false"
      label-width="150px"
      label-position="top"
      @submit.native.prevent="handleUpdatePasswordForm"
    >
      <div class="change-password__form__input">
        <el-form-item prop="password" label="Mật khẩu cũ" class="custom-label">
          <el-input
            v-model="changePasswordForm.password"
            type="password"
            class="change-password__form__input__old-password"
            placeholder="Nhập mật khẩu cũ"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="Mật khẩu mới" class="custom-label">
          <el-input
            v-model="changePasswordForm.newPassword"
            type="password"
            class="change-password__form__input__new-password"
            placeholder="Nhập mật khẩu"
          ></el-input>
        </el-form-item>
        <el-form-item prop="matchPassword" label="Nhập lại mật khẩu mới" class="custom-label">
          <el-input
            v-model="changePasswordForm.matchPassword"
            type="password"
            class="change-password__form__input__match-password"
            placeholder="Nhập mật khẩu"
          ></el-input>
        </el-form-item>
      </div>
      <el-row class="change-password__form__action" type="flex" justify="space-between">
        <el-col :span="24">
          <el-button :loading="loading" class="el-button el-button--purple el-button--medium" @click="handleUpdatePasswordForm"
            >Đổi mật khẩu</el-button
          >
        </el-col>
        <el-col :span="24">
          <nuxt-link to="/">
            <strong>Quay lại trang</strong>
            <span class="change-password__form__action--dashboard">Dashboard</span>
          </nuxt-link>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { notificationConfig } from '@/constants/app.constant';
import { Maps, Rule } from '@/constants/app.type';
import { ChangePasswordDTO } from '@/constants/app.interface';
import UserRepository from '@/repositories/UserRepository';
import { DispatchAction } from '@/constants/app.vuex';

@Component<ChangePasswordDialog>({
  name: 'ChangePasswordDialog',
})
export default class ChangePasswordDialog extends Vue {
  private loading: boolean = false;
  private changePasswordForm: ChangePasswordDTO = {
    password: '',
    newPassword: '',
    matchPassword: '',
  };

  private rules: Maps<Rule[]> = {
    password: [{ required: true, message: 'Vui lòng nhập mật khẩu cũ', trigger: 'blur' }],
    newPassword: [
      { required: true, message: 'Vui lòng nhập mật khẩu mới', trigger: 'blur' },
      { validator: this.validatePassword, trigger: ['blur', 'change'] },
    ],
    matchPassword: [
      { required: true, message: 'Vui lòng nhập lại mật khẩu' },
      { validator: this.validateMatchPassword, trigger: ['blur', 'change'] },
    ],
  };

  private validatePassword(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    const valid: boolean = /^(?=.*\d)[0-9a-zA-Z]{8,}$/.test(value);
    if (!valid) {
      return callback('Mật khẩu chứ ít nhất 8 ký tự và 1 chữ số');
    } else if (value === this.changePasswordForm.password) {
      return callback('Mật khẩu mới không được giống với mật khẩu cũ');
    }
    return callback();
  }

  private validateMatchPassword(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (value !== this.changePasswordForm.newPassword) {
      return callback('Không trùng với mật khẩu mới');
    }
    return callback();
  }

  private handleUpdatePasswordForm(): void {
    this.loading = true;
    (this.$refs.changePasswordForm as Form).validate(async (isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        try {
          delete this.changePasswordForm.matchPassword;
          await UserRepository.changePassword(this.changePasswordForm);
          this.loading = false;
          this.$notify.success({
            ...notificationConfig,
            message: 'Đổi mật khẩu thành công',
          });
          this.$store.dispatch(DispatchAction.CLEAR_AUTH);
          this.$router.push('/');
        } catch (error) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          if (error.response.data.statusCode === 409) {
            this.$notify.error({
              ...notificationConfig,
              message: 'Mât khẩu không chính xác',
            });
          }
        }
      }
      if (invalidatedFields) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.change-password {
  flex-direction: column;
  padding: $unit-12;
  box-shadow: $box-shadow-default;
  background-color: $white;
  &__title {
    text-align: center;
    border: 10px;
    padding: 0 0 $unit-6 0;
    font-size: 1.75rem;
    color: $neutral-primary-4;
  }
  &__form {
    &__action {
      flex-direction: column;
      text-align: center;
      a {
        color: $neutral-primary-4;
        padding-top: $unit-4;
      }
      &--dashboard {
        color: $blue-primary-2;
      }
    }
  }
  .el-row {
    .el-col:nth-child(2) {
      margin-top: $unit-4;
    }
  }
  .el-button {
    margin-top: $unit-6;
    font-size: $unit-5;
    width: 100%;
  }
}
</style>
