<template>
  <div v-if="user" class="dashboard">
    <el-select
      v-if="listCycles.length > 0"
      v-model="cycleId"
      no-match-text="Không tìm thấy chu kỳ"
      filterable
      placeholder="Chọn chu kỳ"
      @change="handleSelectCycle(cycleId)"
    >
      <el-option v-for="cycle in listCycles" :key="cycle.value" :label="cycle.label" :value="cycle.value" />
    </el-select>
    <dashboard-progress-bar :loading="loading" :data-okrs-progress="dataOkrsProgress" />
    <el-row v-if="user.role.name === 'ADMIN'" class="col-container">
      <el-col class="col" :md="24" :lg="8">
        <dashboard-okrs-status :data-progress="dataProgress" :loading-admin="loadingAdmin" />
      </el-col>
      <el-col class="col col--second" :md="24" :lg="8">
        <dashboard-checkin-status v-if="dataCheckin.length > 0" :data-checkin="dataCheckin" :loading-admin="loadingAdmin" />
      </el-col>
      <el-col class="col" :md="24" :lg="8">
        <dashboard-cfr-status :data-cfr="dataCfr" :loading-admin="loadingAdmin" />
      </el-col>
    </el-row>
    <dashboard-star-rank :loading="loading" :data-star-in-come="dataStarInCome" :data-star-out-come="dataStarOutCome" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import CycleRepository from '@/repositories/CycleRepository';
import DashboardRepository from '@/repositories/DashboardRepository';
import { GetterState, MutationState } from '@/constants/app.vuex';
@Component<HomePage>({
  name: 'HomePage',
  head() {
    return {
      title: 'Dashboard',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Awesome tool OKRs',
        },
      ],
    };
  },
  async created() {
    await this.getAllCycles();
    if (this.user.role.name === 'ADMIN') {
      this.getDataAdmin();
    }
    await this.getData();
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
})
export default class HomePage extends Vue {
  private cycleId: number = this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id;
  private loading: boolean = false;
  private loadingAdmin: boolean = false;
  private listCycles: any[] = [];

  private dataStarInCome: Array<object> = [];
  private dataStarOutCome: Array<object> = [];
  private dataOkrsProgress: object = {};
  private dataProgress: Array<object> = [];
  private dataCheckin: Array<object> = [];
  private dataCfr: Array<object> = [];

  private params = {
    cycleId: this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id,
  };

  private async getDataAdmin() {
    this.loadingAdmin = true;
    try {
      await Promise.all([DashboardRepository.getOKRsStatus(), DashboardRepository.getCheckinStatus(), DashboardRepository.getCfrStatus()]).then(
        ([progress, checkin, cfrs]) => {
          this.dataProgress = progress.data.data;
          this.dataCheckin = checkin.data.data;
          this.dataCfr = cfrs.data.data;
          setTimeout(() => {
            this.loadingAdmin = false;
          }, 1000);
        },
      );
    } catch (error) {
      this.loadingAdmin = false;
    }
  }

  private async getAllCycles() {
    // Get 2 years(8 cycles OKRs) ago until now
    if (this.$store.state.cycle.cycles.length) {
      this.listCycles = this.$store.state.cycle.cycles;
      const cycleId = this.listCycles.find((item) => item.label === this.cycleId);
    } else {
      try {
        const { data } = await CycleRepository.get({ page: 1, limit: 8 });
        this.listCycles = data.data.items.map((item) => {
          return {
            id: item.id,
            label: item.name,
            value: item.id,
            startDate: item.startDate,
            endDate: item.endDate,
          };
        });
        this.$store.commit(MutationState.SET_ALL_CYCLES, this.listCycles);
      } catch (error) {}
    }
  }

  @Watch('$route.query')
  private async getData() {
    this.loading = true;
    try {
      await Promise.all([
        DashboardRepository.getTopIncome(this.params.cycleId, 1),
        DashboardRepository.getTopIncome(this.params.cycleId, 2),
        DashboardRepository.getOKRsProgress(this.params),
      ]).then(([income, outcome, progress]) => {
        const tempCycle = this.listCycles.find((item) => item.id === Number(this.params.cycleId));
        this.dataOkrsProgress = Object.assign(
          {},
          {
            startDate: tempCycle.startDate,
            endDate: tempCycle.endDate,
          },
        );
        this.dataStarInCome = income.data.data;
        this.dataStarOutCome = outcome.data.data;
        this.dataOkrsProgress = Object.assign(this.dataOkrsProgress, progress.data.data);
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    } catch (error) {
      this.loading = false;
    }
  }

  private handleSelectCycle(cycleId: number) {
    this.params.cycleId = cycleId;
    this.$router.push(`?cycleId=${cycleId}`);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.dashboard {
  color: $neutral-primary-4;
  .col-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    @include breakpoint-down(phone) {
      flex-direction: column;
    }
    .col {
      height: 70vh;
      flex: 1;
      padding-bottom: $unit-10;
      background-color: $white;
      border-radius: $unit-1;
      box-shadow: $box-shadow-default;
      @include breakpoint-down(phone) {
        height: 70vh;
      }
      &--second {
        margin-left: $unit-8;
        margin-right: $unit-8;
        @include breakpoint-down(phone) {
          margin: $unit-6 0;
        }
      }
    }
  }
}
</style>
