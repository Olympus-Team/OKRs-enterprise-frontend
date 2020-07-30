<template>
  <el-dialog title="Thêm mới đơn vị" :visible.sync="syncMeasureUnitDialog" width="30%" placement="center" :before-close="handleCloseDialog">
    <el-row>
      <el-col :span="24">
        <el-form ref="tempCreateUnit" :model="tempCreateUnit" :rules="rules">
          <el-form-item label="Tên đơn vị" prop="name" class="custom-label" label-width="120px">
            <el-input v-model="tempCreateUnit.type" placeholder="Nhập tên đơn vị" />
          </el-form-item>
          <el-form-item label="Tên viết tắt" label-width="120px">
            <el-input v-model="tempCreateUnit.preset" placeholder="Nhập tên viết tắt" />
          </el-form-item>
          <el-form-item label="Thứ tự hiển thị" label-width="120px">
            <el-input v-model.number="tempCreateUnit.index" placeholder="Nhập thứ tự hiển thị" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button :loading="loading" class="el-button--purple el-button--modal" @click="createTeam">Thêm mới</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import MeasureUnitRepository from '@/repositories/MeasureUnitRepository';
import { MeasureUnitDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
@Component<MeasureUnitDialog>({
  name: 'MeasureUnitDialog',
})
export default class MeasureUnitDialog extends Vue {
  @PropSync('unitVisibleDialog', { type: Boolean, required: true }) public syncMeasureUnitDialog!: boolean;

  private loading: boolean = false;
  private dateFormat: string = 'dd/MM/yyyy';
  private tempCreateUnit: MeasureUnitDTO = {
    type: '',
    preset: '',
    index: 1,
  };

  private rules: Maps<Rule[]> = {
    type: [
      { type: 'string', required: true, message: 'Vui lòng nhập tên đơn vị', trigger: 'blur' },
      { min: 3, message: 'Tên đơn vị chứa ít nhất 3 ký tự', trigger: 'change' },
    ],
  };

  private createTeam() {
    this.loading = true;
    (this.$refs.tempCreateUnit as Form).validate(async (isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        try {
          await MeasureUnitRepository.post(this.tempCreateUnit).then((res) => {
            this.$notify.success({
              title: 'Trạng thái',
              message: `Tạo đơn vị mới thành công`,
              duration: 2000,
            });
          });
          this.clearForm();
          this.loading = false;
          this.syncMeasureUnitDialog = false;
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
    (this.$refs.tempCreateUnit as Form).clearValidate();
    this.syncMeasureUnitDialog = false;
  }

  private clearForm(): void {
    this.tempCreateUnit.type = '';
    this.tempCreateUnit.preset = '';
    this.tempCreateUnit.index = 1;
  }
}
</script>
<style lang="scss" scoped></style>
