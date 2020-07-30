<template>
  <el-dialog title="Thêm mới vị trí công việc" :visible.sync="syncJobDialog" width="30%" placement="center" :before-close="handleCloseDialog">
    <el-row>
      <el-col :span="24">
        <el-form ref="tempCreateJob" :model="tempCreateJob" :rules="rules">
          <el-form-item label="Tên vị trí" prop="name" class="custom-label" label-width="120px">
            <el-input v-model="tempCreateJob.name" placeholder="Nhập tên vị trí" />
          </el-form-item>
          <el-form-item label="Mô tả" label-width="120px">
            <el-input v-model="tempCreateJob.description" type="textarea" :autosize="autoSizeConfig" placeholder="Nhập mô tả" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button :loading="loading" class="el-button--purple el-button--modal" @click="createJob">Thêm mới</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { TeamDTO } from '@/constants/app.interface';
import JobRepository from '@/repositories/JobRepository';
import { Maps, Rule } from '@/constants/app.type';
@Component<JobDialog>({
  name: 'JobDialog',
})
export default class JobDialog extends Vue {
  @PropSync('jobVisibleDialog', { type: Boolean, required: true }) public syncJobDialog!: boolean;

  private autoSizeConfig = { minRows: 2, maxRows: 4 };
  private loading: boolean = false;
  private dateFormat: string = 'dd/MM/yyyy';
  private tempCreateJob: TeamDTO = {
    name: '',
    description: '',
  };

  private rules: Maps<Rule[]> = {
    name: [
      { type: 'string', required: true, message: 'Vui lòng nhập tên vị trí', trigger: 'blur' },
      { min: 3, message: 'Tên vị trí chứa ít nhất 3 ký tự', trigger: ['change', 'blur'] },
    ],
  };

  private createJob() {
    this.loading = true;
    (this.$refs.tempCreateJob as Form).validate(async (isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        try {
          await JobRepository.post(this.tempCreateJob).then((res) => {
            this.$notify.success({
              title: 'Trạng thái',
              message: `Tạo vị trí mới thành công`,
              duration: 2000,
            });
          });
          this.clearForm();
          this.loading = false;
          this.syncJobDialog = false;
        } catch (error) {
          this.$notify.error({
            title: 'Lỗi',
            message: `${error.message}`,
            duration: 2000,
          });
          this.loading = false;
        }
      }
      if (invalidatedFields) {
        Object.entries(invalidatedFields).forEach((field: any) => {
          setTimeout(() => {
            this.$notify.error({
              title: 'Lỗi',
              message: `${field[1][0].message}`,
              duration: 2000,
            });
          }, 300);
        });
        this.loading = false;
      }
    });
  }

  private handleCloseDialog() {
    (this.$refs.tempCreateJob as Form).clearValidate();
    this.syncJobDialog = false;
  }

  private clearForm(): void {
    this.tempCreateJob.name = '';
    this.tempCreateJob.description = '';
  }
}
</script>
<style lang="scss" scoped></style>
