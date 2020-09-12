<template>
  <el-dialog
    title="Thêm mới chu kỳ"
    :visible.sync="syncCycleDialog"
    width="30%"
    placement="center"
    :before-close="handleCloseDialog"
    class="dialog-cycle-okrs"
  >
    <el-row>
      <el-col :span="24">
        <el-form ref="temCreateCycle" :model="temCreateCycle" :rules="rules">
          <el-form-item label="Tên chu kỳ" prop="name" class="custom-label" label-width="120px">
            <el-input v-model="temCreateCycle.name" placeholder="Nhập tên chu kỳ" />
          </el-form-item>
          <el-form-item label="Ngày bắt đầu" prop="startDate" class="custom-label" label-width="120px">
            <el-date-picker
              v-model="temCreateCycle.startDate"
              type="date"
              placeholder="Chọn ngày bắt đầu"
              :format="dateFormat"
              :value-format="dateFormat"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="Ngày kết thúc" prop="endDate" class="custom-label" label-width="120px">
            <el-date-picker
              v-model="temCreateCycle.endDate"
              type="date"
              placeholder="Chọn ngày kết thúc"
              :format="dateFormat"
              :value-format="dateFormat"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button :loading="loading" class="el-button--purple el-button--modal" @click="createCycleOkrs">Thêm mới</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { notificationConfig } from '@/constants/app.constant';
import { CycleDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import { compareTwoDate, formatDateToYYYY } from '@/utils/dateParser';
import CycleRepository from '@/repositories/CycleRepository';
import { max255Char } from '@/components/account/account.constant';
@Component<CycleOkrsDialog>({
  name: 'CycleOkrsDialog',
})
export default class CycleOkrsDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true }) public syncCycleDialog!: boolean;

  private loading: boolean = false;
  private dateFormat: string = 'dd/MM/yyyy';
  private temCreateCycle: CycleDTO = {
    name: '',
    startDate: null,
    endDate: null,
  };

  private rules: Maps<Rule[]> = {
    name: [{ validator: this.sanitizeInput, trigger: ['change', 'blur'] }, max255Char],
    startDate: [{ required: true, message: 'Vui lòng chọn ngày bắt đầu', trigger: 'blur' }],
    endDate: [
      { required: true, message: 'Vui lòng chọn ngày kết thúc', trigger: 'blur' },
      { validator: this.validateEndDate, trigger: ['blur', 'change'] },
    ],
  };

  private sanitizeInput(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    const isEmpty = (value: string) => !value.trim().length;
    if (value.length === 0) {
      return callback('Vui lòng nhập tên chu kỳ');
    }
    if (isEmpty(value)) {
      return callback('Tên chu kỳ không được chỉ chứa dấu cách');
    }
    return callback();
  }

  private validateEndDate(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (compareTwoDate(value, this.temCreateCycle.startDate) === 1) {
      return callback('Ngày kết thúc phải lớn hơn ngày bắt đầu');
    }
    return callback();
  }

  private createCycleOkrs() {
    this.loading = true;
    (this.$refs.temCreateCycle as Form).validate(async (isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        try {
          const tempCycle: CycleDTO = {
            name: this.temCreateCycle.name,
            startDate: formatDateToYYYY(this.temCreateCycle.startDate),
            endDate: formatDateToYYYY(this.temCreateCycle.endDate),
          };
          await CycleRepository.post(tempCycle).then((res) => {
            this.$notify.success({
              ...notificationConfig,
              message: 'Tạo chu kỳ mới thành công',
            });
          });
          this.loading = false;
          this.clearForm();
          this.reloadData();
          this.syncCycleDialog = false;
        } catch (error) {
          if (error.response.data.statusCode === 486) {
            this.$notify.error({
              ...notificationConfig,
              message: 'Ngày bắt đầu hoặc ngày kết thúc không hợp lệ',
            });
          }
          this.loading = false;
        }
      }
      if (invalidatedFields) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }

  private handleCloseDialog() {
    (this.$refs.temCreateCycle as Form).clearValidate();
    this.syncCycleDialog = false;
    this.clearForm();
  }

  private clearForm(): void {
    this.temCreateCycle.name = '';
    this.temCreateCycle.startDate = null;
    this.temCreateCycle.endDate = null;
  }
}
</script>
<style lang="scss" scoped>
.dialog-cycle-okrs {
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>
