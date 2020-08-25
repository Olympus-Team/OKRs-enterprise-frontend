<template>
  <el-row class="login-form" type="flex" justify="center">
    <div class="login-form__title">
      <span>Đăng nhập tài khoản</span>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="rules"
      :status-icon="true"
      :hide-required-asterisk="false"
      label-width="150px"
      label-position="top"
      @submit.native.prevent="handleSubmit"
    >
      <el-form-item prop="email" label="Email" class="custom-label">
        <el-input
          ref="email"
          v-model="loginForm.email"
          name="email"
          autocomplete="email"
          class="login-form__email"
          placeholder="Nhập địa chỉ email"
          tabindex="1"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="Mật khẩu" class="custom-label">
        <el-input
          ref="password"
          v-model="loginForm.password"
          name="password"
          autocomplete="password"
          type="password"
          class="login-form__password"
          placeholder="Nhập mật khẩu"
          tabindex="2"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"
        ></el-input>
      </el-form-item>
      <el-row type="flex" justify="space-between">
        <el-col :span="12"></el-col>
        <el-col :span="12">
          <nuxt-link class="login-form__link" to="/quen-mat-khau">Quên mật khẩu ?</nuxt-link>
        </el-col>
      </el-row>
      <el-button :loading="loading" class="el-button el-button--purple el-button--large" @click="handleLogin">Đăng nhập</el-button>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form as LoginForm, Message } from 'element-ui';
import { LoginDTO } from '@/constants/app.interface';
import { authEnpoint } from '@/constants/app.constant';
import { Maps, Rule } from '@/constants/app.type';
import { DispatchAction } from '@/constants/app.vuex';
@Component<LoginSComponent>({
  name: 'LoginSComponent',
})
export default class LoginSComponent extends Vue {
  private loading: boolean = false;
  private rememberPassword: boolean = false;
  public loginForm: LoginDTO = {
    email: '',
    password: '',
  };

  public rules: Maps<Rule[]> = {
    email: [
      { required: true, message: 'Vui lòng nhập địa chỉ email', trigger: 'blur' },
      { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' },
    ],
    password: [{ required: true, message: 'Vui lòng nhập mật khẩu' }],
  };

  private handleLogin(): any {
    this.loading = true;
    (this.$refs.loginForm as LoginForm).validate(async (isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        const user = await this.$store.dispatch(DispatchAction.LOGIN, this.loginForm);
        this.loading = false;
        if (user) {
          this.$router.push('/');
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
.login-form {
  flex-direction: column;
  padding: $unit-12;
  box-shadow: $box-shadow-default;
  background-color: $white;
  &__title {
    text-align: center;
    border: 10px;
    padding: 0 0 $unit-2 0;
    font-size: 1.75rem;
    color: $neutral-primary-4;
  }
  &__checkbox {
    font-weight: $font-weight-base;
  }
  &__link {
    font-size: 0.875rem;
    color: #2d9cdb;
    font-weight: $font-weight-base;
  }

  .el-form-item {
    &:first-child {
      margin-top: $unit-4;
    }
    &__label {
      color: $neutral-primary-4;
      padding-bottom: $unit-1;
    }
    .el-input__inner {
      &::placeholder {
        color: $neutral-primary-1;
      }
    }
  }
  .el-row {
    .el-col:nth-child(2) {
      text-align: right;
    }
  }
  .el-button {
    margin-top: $unit-10;
    font-size: $unit-5;
    width: 100%;
  }
  .el-tooltip__popper .is-dark {
    background: $purple-primary-4;
    color: white;
  }
}
</style>
