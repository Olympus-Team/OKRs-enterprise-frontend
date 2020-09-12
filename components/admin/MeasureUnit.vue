<template>
  <div v-loading="loadingTable">
    <el-table :data="tableData" empty-text="Không có dữ liệu" class="unit-admin">
      <el-table-column prop="index" label="Thứ tự sắp xếp" />
      <el-table-column prop="type" label="Tên đơn vị" />
      <el-table-column prop="preset" label="Tên viết tắt" />
      <el-table-column label="Thao tác" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="unit-admin__icon" content="Sửa" placement="top">
            <i class="el-icon-edit icon--info" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="unit-admin__icon" content="Xóa" placement="top">
            <i class="el-icon-delete icon--delete" @click="deleteRow(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination class="pagination-bottom" :total="total" :page.sync="syncPage" :limit.sync="syncLimit" @pagination="handlePagination($event)" />
    <el-dialog
      title="Cập nhật đơn vị đo lường"
      :visible.sync="dialogUpdateVisible"
      width="30%"
      placement="center"
      :before-close="handleCloseDialog"
      class="unit-admin-dialog"
    >
      <el-row>
        <el-col :span="24">
          <el-form ref="tempUpdateUnit" :model="tempUpdateUnit" :hide-required-asterisk="false" :status-icon="true" :rules="rules">
            <el-form-item label="Tên đơn vị" prop="type" class="custom-label" label-width="120px">
              <el-input v-model="tempUpdateUnit.type" placeholder="Nhập tên đơn vị" @keyup.enter.native="handleUpdate(tempUpdateUnit)" />
            </el-form-item>
            <el-form-item label="Tên viết tắt" label-width="120px">
              <el-input v-model="tempUpdateUnit.preset" placeholder="Nhập tên viết tắt" @keyup.enter.native="handleUpdate(tempUpdateUnit)" />
            </el-form-item>
            <el-form-item label="Thứ tự hiển thị" prop="index" class="custom-label" label-width="120px">
              <el-input v-model.number="tempUpdateUnit.index" placeholder="Nhập thứ tự hiển thị" @keyup.enter.native="handleUpdate(tempUpdateUnit)" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" @click="handleUpdate">Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';

import { max255Char } from '../account/account.constant';
import { notificationConfig, confirmWarningConfig } from '@/constants/app.constant';
import { Maps, Rule } from '@/constants/app.type';
import { MeasureUnitDTO } from '@/constants/app.interface';
import { AdminTabsEn } from '@/constants/app.enum';
import MeasureUnitRepository from '@/repositories/MeasureUnitRepository';

@Component<ManageMeasureUnit>({
  name: 'ManageMeasureUnit',
  mounted() {
    this.loadingTable = true;
    setTimeout(() => {
      this.loadingTable = false;
    }, 500);
  },
})
export default class ManageMeasureUnit extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Function) public reloadData!: Function;
  @Prop({ type: Number, required: true }) public total!: number;
  @PropSync('page', { type: Number, required: true }) public syncPage!: number;
  @PropSync('limit', { type: Number, required: true }) public syncLimit!: number;

  public loadingTable: boolean = false;
  private dialogUpdateVisible: boolean = false;
  private tempUpdateUnit: MeasureUnitDTO = {
    type: '',
    preset: '',
    index: 1,
  };

  private rules: Maps<Rule[]> = {
    type: [{ validator: this.sanitizeInput, trigger: 'blur' }, max255Char],
    index: [{ type: 'number', min: 1, required: true, message: 'Thứ tự phải là 1 số nguyên không âm', trigger: 'blur' }],
  };

  private sanitizeInput(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    const isEmpty = (value: string) => !value.trim().length;
    if (value.length === 0) {
      return callback('Vui lòng nhập tên đơn vị');
    }
    if (isEmpty(value)) {
      return callback('Tên đơn vị không được chỉ chứa dấu cách');
    }
    return callback();
  }

  private handleOpenDialogUpdate(row: MeasureUnitDTO): void {
    this.tempUpdateUnit = {
      id: row.id,
      type: row.type,
      preset: row.preset,
      index: row.index,
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(): void {
    (this.$refs.tempUpdateUnit as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        this.$confirm(`Bạn có chắc chắn muốn cập nhật đơn vị này không?`, {
          ...confirmWarningConfig,
        }).then(async () => {
          try {
            await MeasureUnitRepository.update(this.tempUpdateUnit).then((res) => {
              this.$notify.success({
                ...notificationConfig,
                message: 'Cập nhật đơn vị thành công',
              });
            });
            this.reloadData();
            this.dialogUpdateVisible = false;
          } catch (error) {}
        });
      }
    });
  }

  private deleteRow(row: MeasureUnitDTO): void {
    this.$confirm(`Bạn có chắc chắn muốn xóa đơn vị ${row.type}?`, {
      ...confirmWarningConfig,
    }).then(async () => {
      try {
        await MeasureUnitRepository.delete(row.id).then((res) => {
          this.$notify.success({
            ...notificationConfig,
            message: 'Xóa đơn vị thành công',
          });
        });
        this.reloadData();
      } catch (error) {}
    });
  }

  private handlePagination(pagination: any) {
    this.$router.push(`?tab=${AdminTabsEn.MeasureUnit}&page=${pagination.page}`);
  }

  private handleCloseDialog(): void {
    (this.$refs.tempUpdateUnit as Form).clearValidate();
    this.dialogUpdateVisible = false;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.unit-admin {
  width: 100%;
  &__icon {
    cursor: pointer;
    margin: 0 $unit-1;
  }
}
.pagination-bottom {
  margin-top: 2rem;
}
</style>
