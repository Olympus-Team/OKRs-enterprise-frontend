<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="cycle-okrs">
      <el-table-column prop="name" label="Tên chu kỳ"></el-table-column>
      <el-table-column prop="startDate" label="Ngày bắt đầu" />
      <!-- <el-table-column prop="startDate" label="Ngày bắt đầu" :formatter="formatter" /> -->
      <el-table-column label="Ngày kết thúc">
        <template v-slot="{ row }">
          <span>{{ row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="cycle-okrs__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="cycle-okrs__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="deleteRow(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination class="pagination-bottom" :total="total" :page.sync="syncPage" :limit.sync="syncLimit" @pagination="handlePagination($event)" />
    <el-dialog
      title="Cập nhật chu kỳ"
      :visible.sync="dialogUpdateVisible"
      width="30%"
      placement="center"
      :before-close="handleCloseDialog"
      class="cycle-okrs-dialog"
    >
      <el-row>
        <el-col :span="24">
          <el-form ref="temporaryUpdateCycleForm" :model="temporaryUpdateCycle" :hide-required-asterisk="false" :status-icon="true" :rules="rules">
            <el-form-item label="Tên chu kỳ" prop="name" class="custom-label" label-width="120px">
              <el-input v-model="temporaryUpdateCycle.name" placeholder="Nhập tên chu kỳ" @keyup.enter.native="handleUpdate(temporaryUpdateCycle)" />
            </el-form-item>
            <el-form-item label="Ngày bắt đầu" prop="startDate" class="custom-label" label-width="120px">
              <el-date-picker
                v-model="temporaryUpdateCycle.startDate"
                type="date"
                placeholder="Chọn ngày bắt đầu"
                :format="dateFormat"
                :value-format="dateFormat"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Ngày kết thúc" prop="endDate" class="custom-label" label-width="120px">
              <el-date-picker
                v-model="temporaryUpdateCycle.endDate"
                type="date"
                placeholder="Chọn ngày kết thúc"
                :format="dateFormat"
                :value-format="dateFormat"
              ></el-date-picker>
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
import { AdminTabsEn } from '@/constants/app.enum';
import { Maps, Rule } from '@/constants/app.type';
import { CycleDTO } from '@/constants/app.interface';
import CycleRepository from '@/repositories/CycleRepository';
import { formatDateToDD, formatDateToYYYY, compareTwoDate } from '@/utils/dateParser';

@Component<ManageCycleOkrs>({ name: 'ManageCycleOkrs' })
export default class ManageCycleOkrs extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Boolean) public loading!: boolean;
  @Prop({ type: Number, required: true }) public total!: number;
  @PropSync('page', { type: Number, required: true }) public syncPage!: number;
  @PropSync('limit', { type: Number, required: true }) public syncLimit!: number;

  private dateFormat: string = 'dd/MM/yyyy';
  private dialogUpdateVisible: boolean = false;
  private temporaryUpdateCycle: CycleDTO = {
    name: '',
    startDate: null,
    endDate: null,
  };

  private rules: Maps<Rule[]> = {
    name: [
      { type: 'string', required: true, message: 'Vui lòng nhập tên chu kỳ', trigger: 'blur' },
      { min: 3, message: 'Tên chu kỳ chứa ít nhất 3 ký tự' },
    ],
    startDate: [{ required: true, message: 'Vui lòng chọn ngày bắt đầu', trigger: ['blur', 'change'] }],
    endDate: [
      { required: true, message: 'Vui lòng chọn ngày kết thúc', trigger: ['blur', 'change'] },
      { validator: this.validateEndDate, trigger: ['blur', 'change'] },
    ],
  };

  private validateEndDate(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (compareTwoDate(value, this.temporaryUpdateCycle.startDate) === 1) {
      return callback('Ngày kết thúc phải lớn hơn ngày bắt đầu');
    }
    return callback();
  }

  private handleOpenDialogUpdate(row: CycleDTO): void {
    this.temporaryUpdateCycle = {
      id: row.id,
      name: row.name,
      startDate: formatDateToDD(row.startDate),
      endDate: formatDateToDD(row.endDate),
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(): void {
    (this.$refs.temporaryUpdateCycleForm as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        this.$confirm(`Bạn có chắc chắn muốn cập nhật chu kỳ này không?`, {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy bỏ',
          type: 'warning',
        }).then(async () => {
          try {
            const tempCycle: CycleDTO = {
              id: this.temporaryUpdateCycle.id,
              name: this.temporaryUpdateCycle.name,
              startDate: formatDateToYYYY(this.temporaryUpdateCycle.startDate),
              endDate: formatDateToYYYY(this.temporaryUpdateCycle.endDate),
            };
            await CycleRepository.update(tempCycle).then((res) => {
              this.$notify.success({
                title: 'Trạng thái',
                message: 'Cập nhật chu kỳ thành công',
                duration: 1000,
              });
            });
            this.dialogUpdateVisible = false;
          } catch (error) {
            this.$notify.error({
              title: 'Lỗi',
              message: `${error.message}`,
              duration: 1000,
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

  private deleteRow(row: CycleDTO): void {
    this.$confirm(`Bạn có chắc chắn muốn xóa chu kỳ ${row.name}?`, {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    }).then(async () => {
      try {
        await CycleRepository.delete(row.id).then((res) => {
          this.$notify.success({
            title: 'Trạng thái',
            message: `Xóa chu kỳ thành công`,
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

  private handleCloseDialog(): void {
    (this.$refs.temporaryUpdateCycleForm as Form).clearValidate();
    this.dialogUpdateVisible = false;
  }

  private handlePagination(pagination: any) {
    const tabNow = this.$route.query.tab === undefined ? AdminTabsEn.CycleOKR : this.$route.query.tab;
    this.$router.push(`?tab=${tabNow}&page=${pagination.page}`);
  }

  private formatter(row, column, cellValue, index) {
    return formatDateToDD(cellValue);
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.cycle-okrs {
  width: 100%;
}
.pagination-bottom {
  margin-top: 2rem;
}
.cycle-okrs-dialog {
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>
