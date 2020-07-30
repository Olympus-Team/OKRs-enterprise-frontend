<template>
  <el-dialog
    title="Thêm mới tiêu chí"
    :visible.sync="syncCriteriaDialog"
    width="30%"
    placement="center"
    :before-close="handleCloseDialog"
    class="dialog-criteria"
  >
    <el-row>
      <el-col :span="24">
        <el-form ref="tempCreateCriteria" :model="tempCreateCriteria" :rules="rules">
          <el-form-item label="Tên tiêu chí" prop="content" class="custom-label" label-width="120px">
            <el-input v-model="tempCreateCriteria.content" placeholder="Nhập tên tiêu chí" />
          </el-form-item>
          <el-form-item label="Số sao" prop="numberOfStar" class="custom-label" label-width="120px">
            <el-input v-model.number="tempCreateCriteria.numberOfStar" placeholder="Nhập số sao" />
          </el-form-item>
          <el-form-item prop="type" label="Kiểu" class="custom-label" label-width="120px">
            <el-select v-model="tempCreateCriteria.type" placeholder="Chọn kiểu">
              <el-option v-for="item in typeCriterias" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button :loading="loading" class="el-button--purple el-button--modal" @click="createEvaluationCriteria">Thêm mới</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { EvaluationCriteriorDTO } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import CriteriaRepository from '@/repositories/EvaluationCriteriaRepository';
import { EvaluationCriteriaEnum } from '@/constants/app.enum';
@Component<CriteriaDialog>({
  name: 'CriteriaDialog',
})
export default class CriteriaDialog extends Vue {
  @PropSync('criteriaVisibleDialog', { type: Boolean, required: true }) public syncCriteriaDialog!: boolean;

  private typeCriterias: object[] = [
    { label: 'Sếp đánh giá nhân viên', value: EvaluationCriteriaEnum.LEADER_TO_MEMBER },
    { label: 'Nhân viên đánh giá sếp', value: EvaluationCriteriaEnum.MEMBER_TO_LEADER },
  ];

  private loading: boolean = false;
  private tempCreateCriteria: EvaluationCriteriorDTO = {
    content: '',
    numberOfStar: 1,
    type: null,
  };

  private rules: Maps<Rule[]> = {
    content: [
      { type: 'string', required: true, message: 'Vui lòng nhập tên tiêu chí', trigger: 'blur' },
      { min: 3, message: 'Tên tiêu chí chứa ít nhất 3 ký tự' },
    ],
    numberOfStar: [{ type: 'number', required: true, message: 'Số sao phải là 1 số nguyên', trigger: 'blur' }],
    type: [{ type: 'string', required: true, message: 'Vui lòng chọn kiểu của tiêu chí', trigger: 'blur' }],
  };

  private createEvaluationCriteria() {
    this.loading = true;
    (this.$refs.tempCreateCriteria as Form).validate(async (isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        try {
          await CriteriaRepository.post(this.tempCreateCriteria).then((res) => {
            this.$notify.success({
              title: 'Trạng thái',
              message: `Tạo tiêu chí mới thành công`,
              duration: 2000,
            });
          });
          this.loading = false;
          this.clearForm();
          this.syncCriteriaDialog = false;
        } catch (error) {
          this.$notify.error({
            title: 'Lỗi',
            message: `Lỗi ${error.message}`,
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
    (this.$refs.tempCreateCriteria as Form).clearValidate();
    this.syncCriteriaDialog = false;
  }

  private clearForm(): void {
    this.tempCreateCriteria.content = '';
    this.tempCreateCriteria.numberOfStar = 1;
    this.tempCreateCriteria.type = null;
  }
}
</script>
<style lang="scss" scoped>
.dialog-criteria {
  .el-select {
    width: 100%;
  }
}
</style>
