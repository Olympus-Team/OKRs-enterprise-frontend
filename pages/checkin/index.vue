<template>
  <div v-if="user" class="checkins">
    <el-select
      v-if="listCycles.length > 0"
      v-model="currentCycleId"
      no-match-text="Không tìm thấy chu kỳ"
      filterable
      placeholder="Chọn chu kỳ"
      @change="handleSelectCycle(currentCycleId)"
    >
      <el-option v-for="cycle in listCycles" :key="cycle.id" :label="cycle.label" :value="cycle.id" />
    </el-select>
    <el-tabs v-if="user.role.name === 'ADMIN'" v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab"></el-tab-pane>
      <div class="checkins__content">
        <component :is="currentTabComponent" :loading="loading" :table-data="tableData" />
        <base-pagination
          v-if="$route.query.tab === 'request-checkin'"
          class="checkins__pagination"
          :total="meta.totalItems"
          :page.sync="paramsCheckin.page"
          :limit.sync="paramsCheckin.limit"
          @pagination="handlePagination"
        />
      </div>
    </el-tabs>
    <el-tabs v-else-if="user.isLeader" v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs.slice(0, 2)" :key="tab" :label="tab" :name="tab"></el-tab-pane>
      <div class="checkins__content">
        <component :is="currentTabComponent" :loading="loading" :table-data="tableData" />
        <base-pagination
          v-if="$route.query.tab === 'request-checkin'"
          class="checkins__pagination"
          :total="meta.totalItems"
          :page.sync="paramsCheckin.page"
          :limit.sync="paramsCheckin.limit"
          @pagination="handlePagination"
        />
      </div>
    </el-tabs>
    <el-tabs v-else v-model="currentTab" @tab-click="handleClick(currentTab)">
      <el-tab-pane v-for="tab in tabs.slice(0, 1)" :key="tab" :label="tab" :name="tab"></el-tab-pane>
      <div class="checkins__content">
        <component :is="currentTabComponent" :loading="loading" :table-data="tableData" />
      </div>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import { notificationConfig, pageLimit } from '@/constants/app.constant';
import { TabCheckins } from '@/constants/app.enum';
import RequestCheckin from '@/components/checkin/RequestCheckin.vue';
import MyOkrsCheckin from '@/components/checkin/MyOkrsCheckin.vue';
import CheckinCompany from '@/components/checkin/CheckinCompany.vue';
import CycleRepository from '@/repositories/CycleRepository';
import CheckinRepository from '@/repositories/CheckinRepository';
import { SelectOptionDTO } from '@/constants/app.interface';
import { GetterState, MutationState } from '@/constants/app.vuex';
@Component<CheckinPage>({
  name: 'CheckinPage',
  head() {
    return {
      title: 'Check-in',
    };
  },
  created() {
    this.getAllCycles();
    this.getList();
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
})
export default class CheckinPage extends Vue {
  private tableData: any[] = [];
  private tabs: string[] = [...Object.values(TabCheckins)];
  private loading: boolean = false;
  private listCycles: any[] = [];
  private currentCycleId: number = this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id;
  private meta: any = {};

  private currentTab: string =
    this.$route.query.tab === 'request-checkin'
      ? TabCheckins.CheckinResquest
      : this.$route.query.tab === 'checkin-company'
      ? TabCheckins.CheckinCompany
      : TabCheckins.MyOkrs;

  private paramsCheckin = {
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    cycleId: this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id,
    limit: pageLimit,
  };

  private get currentTabComponent() {
    if (this.$route.query.tab === 'request-checkin') {
      return RequestCheckin;
    } else if (this.$route.query.tab === 'checkin-company') {
      return CheckinCompany;
    } else {
      return MyOkrsCheckin;
    }
  }

  private handleSelectCycle(idCycle) {
    this.paramsCheckin.page = 1;
    const tab = this.$route.query.tab === undefined ? 'MyOkrs' : this.$route.query.tab;
    this.paramsCheckin.cycleId = idCycle;
    this.$router.push(`?tab=${tab}&cycleId=${idCycle}`);
  }

  @Watch('$route.query')
  private async getList() {
    this.loading = true;
    if (this.currentTab === TabCheckins.MyOkrs) {
      try {
        const paramsCheckin = {
          cycleId: this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id,
        };
        const { data } = await CheckinRepository.get(paramsCheckin);
        this.tableData = data.data;
        this.loading = false;
      } catch (error) {
        if (error.response.data.statusCode === 470) {
          this.$notify.error({
            ...notificationConfig,
            message: 'Bạn không có quyền truy cập checkin này',
          });
        }
        this.loading = false;
      }
    } else if (this.currentTab === TabCheckins.CheckinResquest) {
      try {
        const { data } = await CheckinRepository.getRequest(this.paramsCheckin);
        this.tableData = data.data.items;
        this.meta = data.data.meta;
        this.loading = false;
      } catch (error) {
        if (error.response.data.statusCode === 470) {
          this.$notify.error({
            ...notificationConfig,
            message: 'Bạn không có quyền truy cập checkin này',
          });
        }
        this.$router.push('/checkin');
        this.loading = false;
      }
    } else {
      try {
        const paramsCheckin = {
          cycleId: this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id,
        };
        const { data } = await CheckinRepository.getOKRsCompany(paramsCheckin);
        this.tableData = data.data;
        this.loading = false;
      } catch (error) {
        if (error.response.data.statusCode === 470) {
          this.$notify.error({
            ...notificationConfig,
            message: 'Bạn không có quyền truy cập checkin này',
          });
        }
        this.$router.push('/checkin');
        this.loading = false;
      }
    }
  }

  private handlePagination(pagination: any) {
    this.$route.query.cycleId === undefined
      ? this.$router.push(`?tab=request-checkin&page=${pagination.page}`)
      : this.$router.push(`?tab=request-checkin&cycleId=${Number(this.$route.query.cycleId)}&page=${pagination.page}`);
  }

  private async getAllCycles() {
    // Get 2 years(8 cycles OKRs) ago until now
    if (this.$store.state.cycle.cycles.length) {
      this.listCycles = this.$store.state.cycle.cycles;
      this.currentCycleId = this.$store.state.cycle.cycle.id;
    } else {
      try {
        const { data } = await CycleRepository.get({ page: 1, limit: 8 });
        this.listCycles = data.data.items.map((item) => {
          return {
            id: item.id,
            label: item.name,
          };
        });
        this.$store.commit(MutationState.SET_ALL_CYCLES, this.listCycles);
      } catch (error) {}
    }
  }

  private handleClick(currentTab: string) {
    this.paramsCheckin.page = 1;
    this.$router.push(
      `?tab=${currentTab === TabCheckins.MyOkrs ? 'myOKRs' : currentTab === TabCheckins.CheckinResquest ? 'request-checkin' : 'checkin-company'}`,
    );
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.checkins {
  &__content {
    background-color: $white;
    padding: $unit-8;
  }
  &__pagination {
    margin-top: $unit-8;
  }
}
</style>
