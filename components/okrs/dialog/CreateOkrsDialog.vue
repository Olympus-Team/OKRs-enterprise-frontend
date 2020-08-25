<template>
  <el-dialog
    :title="titleDialog"
    :visible.sync="syncCreateOkrsDialog"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="company-okrs"
  >
    <el-steps :active="active" finish-status="success" :align-center="true">
      <el-step title="Mục tiêu"></el-step>
      <el-step title="Các kết quả then chốt"></el-step>
      <el-step v-if="!isCompanyOkrs" title="Liên kết mục tiêu"></el-step>
    </el-steps>
    <step-create-objective v-if="active === 0" :active.sync="active" :visible-dialog.sync="syncCreateOkrsDialog" :is-company-okrs="isCompanyOkrs" />
    <step-add-key-results
      v-if="active === 1"
      :active.sync="active"
      :visible-dialog.sync="syncCreateOkrsDialog"
      :is-company-okrs="isCompanyOkrs"
      :reload-data="reloadData"
    />
    <step-add-align-objective
      v-if="active === 2 && !isCompanyOkrs"
      :active.sync="active"
      :visible-dialog.sync="syncCreateOkrsDialog"
      :reload-data="reloadData"
    />
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { confirmWarningConfig } from '@/constants/app.constant';
import { DispatchAction } from '@/constants/app.vuex';
@Component<CreateCompanyOkrs>({
  name: 'CreateCompanyOkrs',
})
export default class CreateCompanyOkrs extends Vue {
  @Prop(Function) public reloadData!: Function;
  @Prop(Boolean) public isCompanyOkrs!: boolean;
  @PropSync('visibleDialog', { type: Boolean, required: true, default: false }) public syncCreateOkrsDialog!: boolean;

  private active: number = 0;

  private handleCloseDialog() {
    this.$confirm('Bạn có chắc chắn muốn thoát, hệ thống sẽ không lưu lại các giá trị cũ?', { ...confirmWarningConfig })
      .then(() => {
        this.$store.dispatch(DispatchAction.CLEAR_OKRS);
        this.syncCreateOkrsDialog = false;
        this.active = 0;
      })
      .catch((err) => console.log(err));
  }

  private get titleDialog() {
    return this.isCompanyOkrs ? 'Thêm mới mục tiêu công ty' : 'Thêm mới mục tiêu cá nhân';
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.el-steps {
  padding-bottom: $unit-8;
}
.company-okrs {
  .el-step {
    &__head {
      width: unset;
      .el-step__line {
        top: $unit-4;
        background-color: $purple-primary-4;
        border-color: $purple-primary-4;
      }
      .el-step__icon {
        @include size($unit-8, $unit-8);
        background-color: $purple-primary-4;
      }
    }
    &__main {
      .el-step__title {
        color: $purple-primary-5 !important;
      }
    }
    .is-process {
      color: $white;
    }
    .is-success {
      border-color: $white;
    }
    .el-icon-check {
      color: $white;
    }
  }
  .el-dialog__body {
    padding: 10px 0;
  }
}
</style>
