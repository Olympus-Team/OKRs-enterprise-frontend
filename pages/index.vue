<template>
  <div v-if="user" class="dashboard">
    <el-select v-model="idCycle" no-match-text="Không tìm thấy chu kỳ" filterable placeholder="Chọn chu kỳ" @change="handleSelectCycle(idCycle)">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
import { GetterState } from '@/constants/app.vuex';
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
  private idCycle: number = this.$route.query.cycleId ? Number(this.$route.query.cycleId) : this.$store.state.cycle.cycle.id;
  private loading: boolean = false;
  private loadingAdmin: boolean = false;
  private options: Array<any> = [];

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
    await Promise.all([DashboardRepository.getOKRsStatus(), DashboardRepository.getCheckinStatus(), DashboardRepository.getCfrStatus()])
      .then((result) => {
        this.dataProgress = result[0].data.data;
        this.dataCheckin = result[1].data.data;
        this.dataCfr = result[2].data.data;
        setTimeout(() => {
          this.loadingAdmin = false;
        }, 1000);
      })
      .catch((err) => {
        this.loadingAdmin = false;
        console.log(err);
      });
  }

  private async getAllCycles() {
    // Get 2 years(8 cycles OKRs) ago until now
    await CycleRepository.get({ page: 1, limit: 8 })
      .then((result) => {
        this.options = result.data.data.items.map((item) => {
          return {
            id: item.id,
            label: item.name,
            value: item.id,
            startDate: item.startDate,
            endDate: item.endDate,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  @Watch('$route.query')
  private async getData() {
    this.loading = true;
    await Promise.all([
      DashboardRepository.getTopIncome(this.params.cycleId, 1),
      DashboardRepository.getTopIncome(this.params.cycleId, 2),
      DashboardRepository.getOKRsProgress(this.params),
    ])
      .then((result) => {
        const tempCycle = this.options.find((item) => item.id === Number(this.params.cycleId));
        this.dataOkrsProgress = Object.assign(
          {},
          {
            startDate: tempCycle.startDate,
            endDate: tempCycle.endDate,
          },
        );
        this.dataStarInCome = result[0].data.data;
        this.dataStarOutCome = result[1].data.data;
        this.dataOkrsProgress = Object.assign(this.dataOkrsProgress, result[2].data.data);
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      })
      .catch((err) => {
        this.loading = false;
        console.log(err);
      });
  }

  private handleSelectCycle(idCycle) {
    this.params.cycleId = idCycle;
    this.$router.push(`?cycleId=${idCycle}`);
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
      min-height: 70vh;
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
