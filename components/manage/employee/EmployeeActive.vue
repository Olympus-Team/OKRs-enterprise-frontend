<template>
  <fragment>
    <el-table v-loading="loadingTable" empty-text="Không có dữ liệu" class="employee-active" :data="tableData" style="width: 100%;">
      <el-table-column prop="fullName" label="Tên đầy đủ" min-width="150"></el-table-column>
      <el-table-column prop="email" label="Email" min-width="150"></el-table-column>
      <el-table-column label="Phòng ban" min-width="150">
        <template slot-scope="{ row }">
          <span>{{ row.team.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Vị trí công việc" min-width="150">
        <template slot-scope="{ row }">
          <span>{{ row.jobPosition.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="Vai trò">
        <template slot-scope="{ row }">
          <span>{{ row.role.name === 'ADMIN' ? 'Admin' : row.isLeader ? 'Team Leader' : row.role.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template slot-scope="{ row }">
          <div v-if="row.role.name === 'ADMIN' && user.role.name === 'ADMIN'">
            <el-tooltip class="employee-active__icon" content="Sửa" placement="left-end">
              <i class="el-icon-edit icon--info" @click="handleOpenDialogUpdate(row)"></i>
            </el-tooltip>
          </div>
          <div v-if="row.role.name !== 'ADMIN'">
            <el-tooltip class="employee-active__icon" content="Sửa" placement="left-end">
              <i class="el-icon-edit icon--info" @click="handleOpenDialogUpdate(row)"></i>
            </el-tooltip>
            <el-tooltip class="employee-active__icon" content="Deactive tài khoản" placement="right-end">
              <i class="el-icon-warning icon--warning" @click="deactiveUser(row)"></i>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- update user dialog -->
    <el-dialog
      class="update-employee"
      :visible.sync="dialogUpdateVisible"
      width="40%"
      placement="bottom-start"
      title="Cập nhật thông tin"
      :before-close="handleCloseDialog"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form
            ref="updateEmployeeForm"
            :hide-required-asterisk="false"
            :status-icon="true"
            :rules="rules"
            :model="tempUpdateUser"
            label-position="top"
            style="width: 100%;"
          >
            <el-form-item label="Tên đầy đủ:" prop="fullName" class="custom-label">
              <el-input v-model="tempUpdateUser.fullName" placeholder="Nhập họ và tên" @keyup.enter.native="handleUpdate(tempUpdateUser)" />
            </el-form-item>
            <el-form-item label="Email:" prop="email" class="custom-label">
              <el-input v-model="tempUpdateUser.email" placeholder="Nhập email" @keyup.enter.native="handleUpdate(tempUpdateUser)" />
            </el-form-item>
            <el-form-item v-if="tempUpdateUser.roleId !== Number(1)" label="Phòng ban:" class="custom-label" prop="teamId">
              <el-select
                v-model="tempUpdateUser.teamId"
                class="custom-label"
                placeholder="Chọn phòng ban"
                @keyup.enter.native="handleUpdate(tempUpdateUser)"
              >
                <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="Vị trí công việc:" class="custom-label" prop="jobPositionId">
              <el-select
                v-model="tempUpdateUser.jobPositionId"
                class="custom-label"
                placeholder="Chọn vị trí công việc"
                @keyup.enter.native="handleUpdate(tempUpdateUser)"
              >
                <el-option v-for="item in jobs" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="tempUpdateUser.roleId !== Number(1)" label="Vai trò:" class="custom-label" prop="roleId">
              <el-select
                v-model="tempUpdateUser.roleId"
                class="custom-label"
                placeholder="Chọn vai trò"
                @keyup.enter.native="handleUpdate(tempUpdateUser)"
              >
                <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-checkbox v-if="tempUpdateUser.roleId !== Number(1)" v-model="tempUpdateUser.isLeader">Trưởng nhóm</el-checkbox>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
        <el-button class="el-button--purple el-button--modal" :loading="loading" @click="handleUpdate(tempUpdateUser)">Cập nhật</el-button>
      </span>
    </el-dialog>
    <!-- end update user dialog -->
  </fragment>
</template>
<script lang="ts">
import { Form } from 'element-ui';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { employeeRules } from './employee.constant';
import { notificationConfig, confirmWarningConfig } from '@/constants/app.constant';
import { Maps, Rule } from '@/constants/app.type';
import { EmployeeDTO } from '@/constants/app.interface';
import { GetterState } from '@/constants/app.vuex';
import EmployeeRepository from '@/repositories/EmployeeRepository';
@Component<EmployeeActive>({
  name: 'EmployeeActive',
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
  mounted() {
    this.loadingTable = true;
    setTimeout(() => {
      this.loadingTable = false;
    }, 500);
  },
})
export default class EmployeeActive extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Array) readonly teams!: Array<object>;
  @Prop(Array) readonly jobs!: Array<object>;
  @Prop(Array) readonly roles!: Array<object>;
  @Prop(Function) readonly getListUsers;

  private loadingTable: boolean = false;
  private loading: boolean = false;
  private dialogUpdateVisible: boolean = false;
  private tempUpdateUser: EmployeeDTO = {
    id: 0,
    fullName: '',
    email: '',
    roleId: 3,
    teamId: 0,
    jobPositionId: 0,
    isLeader: false,
    isActive: false,
  };

  public rules: Maps<Rule[]> = employeeRules;

  private handleOpenDialogUpdate(row) {
    this.tempUpdateUser = {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      roleId: row.role.id,
      teamId: row.team.id,
      jobPositionId: row.jobPosition.id,
      isLeader: row.isLeader,
      isActive: row.isActive,
    };
    this.dialogUpdateVisible = true;
  }

  private handleUpdate(tempUpdateUser: EmployeeDTO) {
    this.loading = true;
    (this.$refs.updateEmployeeForm as Form).validate((isValid: boolean, invalidFields: object) => {
      if (isValid) {
        this.$confirm(`Bạn có chắc chắn muốn cập nhật user này?`, {
          ...confirmWarningConfig,
        })
          .then(async () => {
            await EmployeeRepository.update(tempUpdateUser)
              .then((res) => {
                setTimeout(() => {
                  console.log('aa');
                  this.loading = false;
                }, 300);
                this.$notify.success({
                  ...notificationConfig,
                  message: 'Cập nhật thành viên thành công',
                });
                this.getListUsers();
                this.dialogUpdateVisible = false;
              })
              .catch((error) => {
                if (error.response.data.statusCode === 430) {
                  this.$notify.error({
                    ...notificationConfig,
                    message: 'Team Leader đã tồn tại',
                  });
                }
                setTimeout(() => {
                  this.loading = false;
                }, 300);
              });
          })
          .catch(() => {
            setTimeout(() => {
              this.loading = false;
            }, 300);
          });
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }

  private handleCloseDialog() {
    const updateUserForm = this.$refs.updateEmployeeForm as Form;
    updateUserForm.clearValidate();
    this.dialogUpdateVisible = false;
  }

  private deactiveUser(row) {
    this.tempUpdateUser = {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      roleId: row.role.id,
      teamId: row.team.id,
      jobPositionId: row.jobPosition.id,
      isLeader: row.isLeader,
      isActive: false,
    };
    this.$confirm('Bạn có chắc chắn muốn deactive user này?', {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    }).then(async () => {
      try {
        await EmployeeRepository.update(this.tempUpdateUser).then((res: any) => {
          this.$notify.success({
            ...notificationConfig,
            message: 'Cập nhật thành viên thành công',
          });
        });
        this.getListUsers();
      } catch (error) {}
    });
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.employee-active {
  &__icon {
    cursor: pointer;
    margin: 0 $unit-1;
  }
}
</style>
