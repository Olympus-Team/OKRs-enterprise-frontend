<template>
  <div v-loading="loadingComponent" class="okrs-page">
    <el-row class="okrs-page__top" type="flex" justify="space-between">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" class="okrs-page__top--searching">
        <base-top-search-cycle @changeCycleData="getDashBoardOkrs" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" class="okrs-page__top--button">
        <el-button v-if="isNotAdminButton()" class="el-button el-button--purple el-button-medium" icon="el-icon-plus" @click="addPersonalOkrs"
          >Tạo OKRs</el-button
        >
        <el-popover v-else v-model="visible" placement="bottom" width="160">
          <div style="text-align: center;">
            <el-button class="okrs-page__item el-button el-button--white el-button--small" @click="handleCommand('personal')"
              >Tạo OKRs cá nhân</el-button
            >
            <el-button class="okrs-page__item el-button el-button--white el-button--small" @click="handleCommand('company')"
              >Tạo OKRs công ty</el-button
            >
          </div>
          <el-button slot="reference" class="el-button el-button--purple el-button-medium" icon="el-icon-plus">Tạo OKRs</el-button>
        </el-popover>
      </el-col>
    </el-row>
    <div v-loading="loadingForm">
      <item-okrs
        v-for="(item, index) in itemOKRsData"
        :key="item.textHeader"
        :index-item="index"
        :text-header="item.textHeader"
        :table-data="item.tableData"
        :reload-data="getDashBoardOkrs"
        @openDrawer="openDrawer($event)"
      />
    </div>
    <transition name="el-fade-in">
      <create-okrs-dialog
        v-if="visibleCreateOkrsDialog"
        :is-company-okrs="isCompanyOkrs"
        :visible-dialog.sync="visibleCreateOkrsDialog"
        :reload-data="getDashBoardOkrs"
      />
    </transition>
    <okrs-drawer v-if="visibleDrawer" :list-krs="listKrs" :visible-drawer.sync="visibleDrawer" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MutationState, DispatchAction } from '@/constants/app.vuex';
import OkrsRepository from '@/repositories/OkrsRepository';
@Component<OKRsPage>({
  name: 'OKRsPage',
  async created() {
    await this.getDashBoardOkrs();
  },
  mounted() {
    this.loadingComponent = true;
    this.$store.dispatch(DispatchAction.SET_STAFF_OKRS, { cycleId: this.$store.state.cycle.cycle.id, type: 3 });
    setTimeout(() => {
      this.loadingComponent = false;
    }, 500);
    setTimeout(() => {
      this.$store.dispatch(DispatchAction.SET_MEASURE_UNITS);
    }, 2000);
  },
  beforeDestroy() {
    this.$store.commit(MutationState.SET_TEMP_CYCLE, this.$store.state.cycle.cycle.id);
    this.$store.dispatch(DispatchAction.CLEAR_STAFF_OKRS);
  },
})
export default class OKRsPage extends Vue {
  private isCompanyOkrs: boolean = false;
  private loadingForm: boolean = false;
  private loadingComponent: boolean = false;
  private visibleCreateOkrsDialog = false;
  private visible: boolean = false;
  private listKrs: any[] = [];
  private visibleDrawer: boolean = false;

  private openDrawer(keyResults: any) {
    this.listKrs = keyResults;
    this.visibleDrawer = true;
  }

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
      const cycleId = this.$store.state.cycle.cycleTemp ? this.$store.state.cycle.cycleTemp : this.$store.state.cycle.cycle.id;
      const { data } = await OkrsRepository.getOkrsDashboard(cycleId);
      this.itemOKRsData[0].tableData = Object.freeze(data.data.root);
      if (this.$store.state.auth.user.role.name !== 'ADMIN') {
        this.itemOKRsData[1].tableData = Object.freeze(data.data.team);
      }
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
    &:first-child {
      padding: 1rem 1.6rem 1rem 1.6rem;
      border: unset;
      border-bottom-left-radius: unset;
      border-bottom-right-radius: unset;
      border-bottom: 1px solid $purple-primary-1;
      margin-top: 1px;
    }
    &:last-child {
      padding: 1rem 1.6rem 1rem 1.8rem;
      margin: 0;
      border: unset;
      border-top-left-radius: unset;
      border-top-right-radius: unset;
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
