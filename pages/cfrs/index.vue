<template>
  <div class="cfrs">
    <div class="cfrs-page">
      <el-row class="cfrs-page__top" type="flex" justify="space-between">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" class="okrs-page__top--searching">
          <cfrs-navbar :current-tab-component="currentTabEng" />
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" class="okrs-page__top--button">
          <el-button v-if="displayButton()" class="el-button el-button--purple el-button-medium" @click="visibleCreateDialog = true">
            Tạo ghi nhận
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-tabs v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" />
      <component :is="currentTabComponent" />
    </el-tabs>
    <cfrs-recognition v-if="visibleCreateDialog" :visible-dialog.sync="visibleCreateDialog" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import Feedback from '@/components/cfrs/feedback/index.vue';
import History from '@/components/cfrs/history/index.vue';
import Rank from '@/components/cfrs/rank/index.vue';

import OkrsRepository from '@/repositories/OkrsRepository';

import { TabCfr, TabCfrEng } from '@/constants/app.enum';
import { ParamsCFR } from '@/constants/app.interface';
import { pageLimit } from '@/constants/app.constant';
import { MutationState } from '@/constants/app.vuex';

@Component<CFRs>({
  name: 'CFRs',
  head() {
    return {
      title: 'Ghi nhận và Phản hồi',
    };
  },
  created() {
    this.$store.commit(MutationState.SET_TEMP_CYCLE, this.$store.state.cycle.cycle.id);
  },
})
export default class CFRs extends Vue {
  private meta: object = {};
  private visibleCreateDialog: Boolean = false;
  private tabs: string[] = [...Object.values(TabCfr)];

  private params: ParamsCFR = {
    status: this.$route.query.tab === 'feedback' || this.$route.query.tab === undefined ? -1 : this.$route.query.tab === 'history' ? 0 : 1,
    text: this.$route.query.text ? String(this.$route.query.text) : '',
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    limit: pageLimit,
  };

  private currentTab: string =
    this.$route.query.tab === 'feedback' || this.$route.query.tab === undefined
      ? TabCfr.Feedback
      : this.$route.query.tab === 'history'
      ? TabCfr.History
      : TabCfr.Rank;

  private displayButton(): Boolean {
    return (
      this.$store.state.auth.user.role.name === 'ADMIN' || this.$store.state.auth.user.isLeader || this.$store.state.auth.user.role.name === 'HR'
    );
  }

  private get currentTabEng(): String {
    return this.$route.query.tab === 'feedback' || this.$route.query.tab === undefined
      ? TabCfrEng.Feedback
      : this.$route.query.tab === 'history'
      ? TabCfrEng.History
      : TabCfrEng.Rank;
  }

  private get currentTabComponent() {
    return this.$route.query.tab === undefined || this.$route.query.tab === 'feedback'
      ? Feedback
      : this.$route.query.tab === 'history'
      ? History
      : Rank;
  }

  private handleClick(currentTab: string) {
    this.params.text = '';
    this.params.page = 1;
    this.params.status = currentTab === TabCfr.Feedback ? 1 : currentTab === TabCfr.History ? 0 : -1;
    this.$router.push(`?tab=${currentTab === TabCfr.Feedback ? 'feedback' : currentTab === TabCfr.History ? 'history' : 'rank'}`);
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.cfrs {
  padding-right: $unit-4;
}
.cfrs-page {
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
  .el-table__empty-block {
    width: 100% !important;
  }
}
</style>
