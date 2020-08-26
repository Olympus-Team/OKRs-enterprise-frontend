<template>
  <el-row class="register-form">
    <div class="register-form__title">
      <span>Đăng ký tài khoản</span>
    </div>
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="rules"
      :status-icon="true"
      label-width="150px"
      label-position="top"
      class="register-form__input"
      @submit.native.prevent="handleRegisterForm"
    >
      <el-form-item prop="email" label="Email" class="custom-label">
        <el-input v-model="registerForm.email" size="medium" class="register-form__input__email" placeholder="Nhập email"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="Mật khẩu" class="custom-label">
        <el-input
          v-model="registerForm.password"
          size="medium"
          type="password"
          class="register-form__input__password"
          placeholder="Nhập mật khẩu"
        ></el-input>
      </el-form-item>
      <el-form-item prop="matchPassword" label="Nhập lại mật khẩu" class="custom-label">
        <el-input
          v-model="registerForm.matchPassword"
          size="medium"
          type="password"
          class="register-form__input"
          placeholder="Nhập lại mật khẩu"
        ></el-input>
      </el-form-item>
      <el-form-item prop="fullName" label="Họ và Tên" class="custom-label">
        <el-input v-model="registerForm.fullName" size="medium" class="register-form__input__full-name" placeholder="Nhập họ tên"></el-input>
      </el-form-item>
      <el-form-item prop="gender" label="Giới tính" class="register-form__input__gender custom-label">
        <el-radio-group v-model="registerForm.gender">
          <el-radio :label="true">Nam</el-radio>
          <el-radio :label="false">Nữ</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="teamId" label="Phòng ban" class="register-form__input__team custom-label">
        <el-select v-model="registerForm.teamId" size="medium" placeholder="Chọn phòng ban" :no-data-text="noDataText">
          <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="jobPositionId" label="Vị trí" class="register-form__input__job-position custom-label">
        <el-select v-model="registerForm.jobPositionId" size="medium" placeholder="Chọn vị trí" :no-data-text="noDataText">
          <el-option v-for="item in jobs" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-button :loading="loading" class="el-button el-button--purple el-button--large" @click="handleRegisterForm">Gửi yêu cầu</el-button>
    </el-form>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { regexPassword, max255Char } from './account.constant';
import { notificationConfig } from '@/constants/app.constant';
import { RegisterDTO, RegisterOption } from '@/constants/app.interface';
import { notifyErrorRegister } from '@/constants/app.notify';
import { Maps, Rule } from '@/constants/app.type';
import AuthRepository from '@/repositories/AuthRepository';
import TeamRepository from '@/repositories/TeamRepository';
import JobRepository from '@/repositories/JobRepository';

@Component<RegisterComponent>({
  name: 'RegisterComponent',
  created() {
    this.getDataCommons();
  },
})
export default class RegisterComponent extends Vue {
  @Prop(String) token!: string;
  private teams: Array<object> = [];
  private jobs: Array<object> = [];
  private loading: boolean = false;
  private rememberPassword: boolean = false;
  private capsTooltip = false;
  private noDataText: string = 'Không có dữ liệu';

  private registerForm: RegisterDTO = {
    email: '',
    password: '',
    matchPassword: '',
    fullName: '',
    gender: true,
    teamId: null,
    jobPositionId: null,
    token: this.token,
  };

  private async getDataCommons() {
    try {
      const [teams, jobs] = await Promise.all([TeamRepository.getMetaData(), JobRepository.getMetaData()]);
      this.teams = teams.data.data;
      this.jobs = jobs.data.data;
    } catch (error) {}
  }

  private rules: Maps<Rule[]> = {
    email: [
      { required: true, message: 'Vui lòng nhập địa chỉ email', trigger: 'blur' },
      { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' },
      max255Char,
    ],
    password: [{ required: true, message: 'Vui lòng nhập mật khẩu' }, max255Char, { validator: this.validatePassword, trigger: ['blur', 'change'] }],
    matchPassword: [
      { required: true, message: 'Vui lòng nhập lại mật khẩu' },
      max255Char,
      { validator: this.validateMatchPassword, trigger: ['blur', 'change'] },
    ],
    fullName: [{ required: true, message: 'Vui lòng nhập họ tên' }, max255Char],
    teamId: [{ required: true, message: 'Vui lòng chọn phòng ban' }],
    jobPositionId: [{ required: true, message: 'Vui lòng chọn vị trí công việc' }],
  };

  private validatePassword(rule: any, value: string, callback: (message?: string) => any): (message?: string) => any {
    const valid: boolean = regexPassword.test(value.trim());
    if (!valid) {
      return callback('Mật khẩu chứ ít nhất 8 ký tự và 1 chữ số');
    }
    return callback();
  }

  private validateMatchPassword(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (value !== this.registerForm.password) {
      return callback('Không trùng với mật khẩu');
    }
    return callback();
  }

  private handleRegisterForm() {
    this.loading = true;
    (this.$refs.registerForm as Form).validate(async (isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        try {
          delete this.registerForm.matchPassword;
          await AuthRepository.register(this.registerForm).then((res: any) => {
            this.$notify.success({
              ...notificationConfig,
              message: 'Gửi yêu cầu đăng ký thành công',
            });
          });
          this.loading = false;
          this.$router.push('/dang-nhap');
        } catch (error) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          notifyErrorRegister(error);
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
.register-form {
  @include account-form;
  &__title {
    text-align: center;
    border: 10px;
    padding: 0 0 $unit-5 0;
    font-size: 1.75rem;
    color: $neutral-primary-4;
    margin-top: -$unit-4;
  }
  &__input {
    &__gender {
      margin-bottom: -$unit-3;
      .el-form-item__label {
        margin-bottom: -$unit-3;
      }
    }
  }
  .el-form-item {
    margin-top: -$unit-3;
    &__label {
      padding: 0;
      &:nth-child(2) {
        margin-bottom: -$unit-3;
      }
    }
  }
  .el-button {
    margin-top: $unit-2;
    font-size: $unit-5;
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>
