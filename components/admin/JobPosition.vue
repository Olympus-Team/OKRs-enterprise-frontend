<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="job-admin">
      <el-table-column prop="name" label="Tên vị trí"></el-table-column>
      <el-table-column prop="description" label="Mô tả"></el-table-column>
      <el-table-column label="Ngày cập nhật">
        <template v-slot="{ row }">
          <span>{{ row.updatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="job-admin__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="job-admin__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="deleteRow(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination class="pagination-bottom" :total="total" :page.sync="syncPage" :limit.sync="syncLimit" @pagination="handlePagination($event)" />
    <el-dialog
      title="Cập nhật vị trí công việc"
      :visible.sync="dialogUpdateVisible"
      width="30%"
      placement="center"
      :before-close="handleCloseDialog"
      class="job-admin-dialog"
    >
      <el-row>
        <el-col :span="24">
          <el-form ref="tempUpdateJob" :model="tempUpdateJob" :hide-required-asterisk="false" :status-icon="true" :rules="rules">
            <el-form-item label="Tên vị trí" prop="name" class="custom-label" label-width="120px">
              <el-input v-model="tempUpdateJob.name" placeholder="Nhập tên vị trí" @keyup.enter.native="handleUpdate(tempUpdateJob)" />
            </el-form-item>
            <el-form-item label="Mô tả" label-width="120px">
              <el-input
                v-model="tempUpdateJob.description"
                type="textarea"
                :autosize="autoSizeConfig"
                placeholder="Nhập mô tả"
                @keyup.enter.native="handleUpdate(tempUpdateJob)"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" :loading="loading" @click="handleUpdate">Cập nhật</el-button>
      </span>
    </el-dialog>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
import { JobPositionDTO } from '@/constants/app.interface';
import JobRepository from '@/repositories/JobRepository';
import { formatDateToDD } from '@/utils/dateParser';
import { AdminTabsEn } from '@/constants/app.enum';

@Component<ManageJobPosition>({ name: 'ManageJobPosition' })
export default class ManageJobPosition extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Boolean) public loading!: boolean;
  @Prop({ type: Number, required: true }) public total!: number;
  @PropSync('page', { type: Number, required: true }) public syncPage!: number;
  @PropSync('limit', { type: Number, required: true }) public syncLimit!: number;

  private autoSizeConfig = { minRows: 2, maxRows: 4 };
  private dateFormat: string = 'dd/MM/yyyy';
  private dialogUpdateVisible: boolean = false;
  private tempUpdateJob: JobPositionDTO = {
    name: '',
    description: '',
    updatedAt: null,
  };

  private rules: Maps<Rule[]> = {
    name: [
      { type: 'string', required: true, message: 'Vui lòng nhập vị trí', trigger: 'blur' },
      { min: 3, message: 'Tên vị trí chứa ít nhất 3 ký tự' },
    ],
  };

  private handleOpenDialogUpdate(row: JobPositionDTO): void {
    this.tempUpdateJob = {
      id: row.id,
      name: row.name,
      description: row.description,
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(): void {
    (this.$refs.tempUpdateJob as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        this.$confirm(`Bạn có chắc chắn muốn cập nhật vị trí này không?`, {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy bỏ',
          type: 'warning',
        }).then(async () => {
          try {
            await JobRepository.update(this.tempUpdateJob).then((res) => {
              this.$notify.success({
                title: 'Trạng thái',
                message: 'Cập nhật vị trí thành công',
                duration: 2000,
              });
            });
            this.dialogUpdateVisible = false;
          } catch (error) {
            this.$notify.error({
              title: 'Lỗi',
              message: `${error.message}`,
              duration: 2000,
            });
          }
        });
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
      }
    });
  }

  private deleteRow(row: JobPositionDTO): void {
    this.$confirm(`Bạn có chắc chắn muốn xóa vị trí ${row.name}?`, {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    }).then(async () => {
      try {
        await JobRepository.delete(row.id).then((res) => {
          this.$notify.success({
            title: 'Trạng thái',
            message: `Xóa vị trí thành công`,
            duration: 1000,
          });
        });
      } catch (error) {
        this.$notify.error({
          title: 'Lỗi',
          message: `${error.message}`,
          duration: 1000,
        });
      }
    });
  }

  private handlePagination(pagination: any) {
    this.$router.push(`?tab=${AdminTabsEn.JobPosition}&page=${pagination.page}`);
  }

  private handleCloseDialog(): void {
    (this.$refs.tempUpdateJob as Form).clearValidate();
    this.dialogUpdateVisible = false;
  }

  // private dateParser(date: string): string {
  //   return formatDateToDD(date);
  // }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.job-admin {
  width: 100%;
}
.pagination-bottom {
  margin-top: 2rem;
}
</style>
