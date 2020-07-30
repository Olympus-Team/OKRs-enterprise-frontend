<template>
  <fragment>
    <el-table v-loading="loading" :data="tableData" empty-text="Không có dữ liệu" class="team-admin">
      <el-table-column prop="name" label="Tên phòng ban"></el-table-column>
      <el-table-column prop="description" label="Mô tả"></el-table-column>
      <el-table-column label="Ngày cập nhật">
        <template v-slot="{ row }">
          <span>{{ row.updatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template v-slot="{ row }">
          <el-tooltip class="team-admin__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleOpenDialogUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="team-admin__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="deleteRow(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination class="pagination-bottom" :total="total" :page.sync="syncPage" :limit.sync="syncLimit" @pagination="handlePagination($event)" />
    <el-dialog
      title="Cập nhật phòng ban"
      :visible.sync="dialogUpdateVisible"
      width="30%"
      placement="center"
      :before-close="handleCloseDialog"
      class="team-admin-dialog"
    >
      <el-row>
        <el-col :span="24">
          <el-form ref="tempUpdateTeam" :model="tempUpdateTeam" :hide-required-asterisk="false" :status-icon="true" :rules="rules">
            <el-form-item label="Tên phòng ban" prop="name" class="custom-label" label-width="120px">
              <el-input v-model="tempUpdateTeam.name" placeholder="Nhập tên phòng ban" @keyup.enter.native="handleUpdate(tempUpdateTeam)" />
            </el-form-item>
            <el-form-item label="Mô tả" label-width="120px">
              <el-input
                v-model="tempUpdateTeam.description"
                type="textarea"
                :autosize="autoSizeConfig"
                placeholder="Nhập mô tả"
                @keyup.enter.native="handleUpdate(tempUpdateTeam)"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" @click="handleUpdate">Cập nhật</el-button>
      </span>
    </el-dialog>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { Maps, Rule } from '@/constants/app.type';
import { TeamDTO } from '@/constants/app.interface';
import TeamRepository from '@/repositories/TeamRepository';
import { formatDateToDD } from '@/utils/dateParser';
import { AdminTabsEn } from '@/constants/app.enum';

@Component<ManageDepartment>({
  name: 'ManageDepartment',
})
export default class ManageDepartment extends Vue {
  @Prop(Array) public tableData!: Object[];
  @Prop(Boolean) public loading!: boolean;
  @Prop({ type: Number, required: true }) public total!: number;
  @PropSync('page', { type: Number, required: true }) public syncPage!: number;
  @PropSync('limit', { type: Number, required: true }) public syncLimit!: number;

  private autoSizeConfig = { minRows: 2, maxRows: 4 };
  private dateFormat: string = 'dd/MM/yyyy';
  private dialogUpdateVisible: boolean = false;
  private tempUpdateTeam: TeamDTO = {
    name: '',
    description: '',
    updatedAt: null,
  };

  private rules: Maps<Rule[]> = {
    name: [
      { type: 'string', required: true, message: 'Vui lòng nhập tên phòng ban', trigger: 'blur' },
      { min: 3, message: 'Tên phòng ban chứa ít nhất 3 ký tự' },
    ],
  };

  private handleOpenDialogUpdate(row: TeamDTO): void {
    this.tempUpdateTeam = {
      id: row.id,
      name: row.name,
      description: row.description,
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(): void {
    (this.$refs.tempUpdateTeam as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        this.$confirm(`Bạn có chắc chắn muốn cập nhật phòng ban này không?`, {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy bỏ',
          type: 'warning',
        }).then(async () => {
          try {
            await TeamRepository.update(this.tempUpdateTeam).then((res) => {
              this.$notify.success({
                title: 'Trạng thái',
                message: 'Cập nhật phòng ban thành công',
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

  private deleteRow(row: TeamDTO): void {
    this.$confirm(`Bạn có chắc chắn muốn xóa phòng ban ${row.name}?`, {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    }).then(async () => {
      try {
        await TeamRepository.delete(row.id).then((res) => {
          this.$notify.success({
            title: 'Trạng thái',
            message: `Xóa phòng ban công`,
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
    this.$router.push(`?tab=${AdminTabsEn.Department}&page=${pagination.page}`);
  }

  private handleCloseDialog(): void {
    (this.$refs.tempUpdateTeam as Form).clearValidate();
    this.dialogUpdateVisible = false;
  }

  // private dateParser(date: string): string {
  //   return formatDateToDD(date);
  // }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.team-admin {
  width: 100%;
}
.pagination-bottom {
  margin-top: 2rem;
}
</style>
