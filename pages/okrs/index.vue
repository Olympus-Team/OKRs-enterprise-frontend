<template>
  <div class="okrs-page">
    <el-row class="okrs-page__top" type="flex" justify="space-between">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" class="okrs-page__top--searching">
        <!-- <base-top-search-cycle :cycle-id.sync="cycleId" /> -->
        <base-top-search-cycle @changeCycleData="getDashBoardOkrs" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" class="okrs-page__top--button">
        <el-button v-if="isNotAdminButton()" class="el-button el-button--purple el-button-medium" icon="el-icon-plus" @click="addPersonalOkrs"
          >Tạo OKRs</el-button
        >
        <el-popover v-else v-model="visible" placement="bottom" width="160">
          <div style="text-align: center;">
            <el-button type="text" class="okrs-page__item" @click="handleCommand('personal')">Tạo OKRs cá nhân</el-button>
            <el-button type="text" style="margin: 0;" class="okrs-page__item" @click="handleCommand('company')">Tạo OKRs công ty</el-button>
          </div>
          <el-button slot="reference" class="el-button el-button--purple el-button-medium" icon="el-icon-plus">Tạo OKRs</el-button>
        </el-popover>
      </el-col>
    </el-row>
    <item-okrs
      v-for="(item, index) in itemOKRsData"
      :key="item.textHeader"
      :index-item="index"
      :text-header="item.textHeader"
      :table-data="item.tableData"
      :reload-data="getDashBoardOkrs"
    />
    <create-okrs-dialog
      v-if="visibleCreateOkrsDialog"
      :is-company-okrs="isCompanyOkrs"
      :visible-dialog.sync="visibleCreateOkrsDialog"
      :reload-data="getDashBoardOkrs"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import OkrsRepository from '@/repositories/OkrsRepository';
import { MutationState, DispatchAction } from '@/constants/app.enum';
@Component<OKRsPage>({
  name: 'OKRsPage',
  created() {
    this.getDashBoardOkrs();
    this.$store.dispatch(DispatchAction.STAFF_OKRS, { cycleId: this.$store.state.cycle.cycle.id, type: 3 });
  },
  destroyed() {
    this.$store.commit(MutationState.CLEAR_STAFF_OKRS, null);
  },
  middleware: ['measureUnit'],
})
export default class OKRsPage extends Vue {
  private loadingForm: boolean = false;
  private visibleCreateOkrsDialog = false;
  private isCompanyOkrs: boolean = false;
  private visible: boolean = false;

  private handleCommand(command: string) {
    if (command === 'company') {
      this.visibleCreateOkrsDialog = true;
      this.isCompanyOkrs = true;
    } else {
      this.isCompanyOkrs = false;
      this.visibleCreateOkrsDialog = true;
    }
  }

  private addPersonalOkrs() {
    this.isCompanyOkrs = false;
    this.visibleCreateOkrsDialog = true;
  }

  private itemOKRsData: any[] = [
    { textHeader: 'OKRs toàn công ty', tableData: null },
    { textHeader: 'OKRs nhóm', tableData: null },
    { textHeader: 'OKRs cá nhân', tableData: null },
  ];

  private async getDashBoardOkrs() {
    this.loadingForm = true;
    try {
      const { data } = await OkrsRepository.getOkrsDashboard(this.$store.state.cycle.cycle.id);
      this.itemOKRsData[0].tableData = Object.freeze(data.data.root);
      this.itemOKRsData[1].tableData = Object.freeze(data.data.team);
      this.itemOKRsData[2].tableData = Object.freeze(data.data.personal);
      setTimeout(() => {
        this.loadingForm = false;
      }, 500);
    } catch (error) {
      setTimeout(() => {
        this.loadingForm = false;
      }, 500);
    }
  }

  private isNotAdminButton(): boolean {
    return this.$store.state.auth.user.role.name !== 'ADMIN';
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-page {
  width: 98%;
  &__top {
    @include breakpoint-down(phone) {
      flex-direction: column;
    }
    &--button {
      display: flex;
      justify-content: flex-end;
      @include breakpoint-down(phone) {
        justify-content: center;
      }
    }
  }
  &__item {
    color: $purple-primary-4;
    &:hover {
      color: $purple-primary-5;
    }
    &:active {
      color: $purple-primary-5;
    }
  }
  .el-table__empty-block {
    width: 100% !important;
  }
}
.create-okr-dropdown {
  color: $neutral-primary-4;
}
</style>
