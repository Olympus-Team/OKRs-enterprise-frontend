<template>
  <div v-loading="loadingTab" class="rank">
    <el-row :gutter="30" class>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <div class="rank__col">
          <div class="rank__col__header">
            <p class="rank__col__header--title">BXH theo chu kỳ</p>
            <el-select
              v-model="cycleId"
              filterable
              no-match-text="Không tìm thấy chu kỳ"
              placeholder="Chọn chu kỳ"
              class="rank__col__header--dropdown"
            >
              <el-option v-for="cycle in listCycles" :key="cycle.id" :label="cycle.label" :value="cycle.id" />
            </el-select>
          </div>
          <p v-if="!currentRanking.length" v-loading="loadingCurrentRanking" class="history__col__empty">Không có dữ liệu</p>
          <div v-else v-loading="loadingCurrentRanking">
            <div v-for="(item, index) in currentRanking" :key="item.id" class="rank-item">
              <div class="rank-item__left">
                <div :class="['rank-item__left__index', topRanking(index)]">
                  <span>{{ index + 1 }}</span>
                </div>
                <el-avatar :size="40">
                  <img :src="item.avatarURL ? item.avatarURL : item.gravatarURL" alt="avatar" />
                </el-avatar>
                <div class="rank-item__left__info">
                  <p class="rank-item__left__info--fullname">{{ item.user_fullName }}</p>
                  <p class="rank-item__left__info--department">{{ displayDepartment(item) }}</p>
                </div>
              </div>
              <div class="rank-item__right">{{ item.sum }} <icon-star-dashboard /></div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <div class="rank__col">
          <p class="rank__col__header" style="padding-bottom: 20px;">BXH lũy kế</p>
          <p v-if="!accumulatedRanking.length" class="history__col__empty">Không có dữ liệu</p>
          <div v-for="(item, index) in accumulatedRanking" v-else :key="item.id" class="rank-item">
            <div class="rank-item__left">
              <div :class="['rank-item__left__index', topRanking(index)]">
                <span>{{ index + 1 }}</span>
              </div>
              <el-avatar :size="40">
                <img :src="item.avatarURL ? item.avatarURL : item.gravatarURL" alt="avatar" />
              </el-avatar>
              <div class="rank-item__left__info">
                <p class="rank-item__left__info--fullname">{{ item.user_fullName }}</p>
                <p class="rank-item__left__info--department">{{ displayDepartment(item) }}</p>
              </div>
            </div>
            <div class="rank-item__right">{{ item.sum }} <icon-star-dashboard /></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CreateFeedback from './Create.vue';
import CfrsRepository from '@/repositories/CfrsRepository';
import IconStarDashboard from '@/assets/images/dashboard/star-dashboard.svg';
import CycleRepository from '@/repositories/CycleRepository';
import { MutationState } from '@/constants/app.vuex';
@Component<Rank>({
  name: 'Rank',
  components: {
    IconStarDashboard,
  },
  async created() {
    await this.getListDataRanking();
    await this.getListCycle();
  },
  beforeMount() {
    this.loadingTab = true;
    setTimeout(() => {
      this.loadingTab = false;
    }, 500);
  },
})
export default class Rank extends Vue {
  private cycleId: number = this.$store.state.cycle.cycle.id;
  private loadingTab: boolean = false;
  private loadingCurrentRanking: boolean = false;
  private accumulatedRanking: any = [];
  private currentRanking: any = [];
  private dataDetail: object = {};
  private visibleCreateDialog = false;
  private listCycles: any[] = [];
  private async getListDataRanking() {
    this.loadingTab = true;
    try {
      const [accumulatedRanking, currentRanking] = await Promise.all([
        CfrsRepository.getRankingCfrs(),
        CfrsRepository.getRankingCfrs(this.$store.state.cycle.cycle.id),
      ]);
      this.accumulatedRanking = accumulatedRanking.data.data;
      this.currentRanking = currentRanking.data.data;
    } catch (error) {}
    setTimeout(() => {
      this.loadingTab = false;
    }, 300);
  }

  @Watch('cycleId')
  private async getRankingOnCycle(cycleId: number) {
    this.loadingCurrentRanking = true;
    try {
      await CfrsRepository.getRankingCfrs(cycleId).then((res) => {
        this.currentRanking = res.data.data;
      });
    } catch (error) {}
    setTimeout(() => {
      this.loadingCurrentRanking = false;
    }, 300);
  }

  private topRanking(index: number): String {
    return index === 1 ? 'top1' : index === 2 ? 'top2' : index === 3 ? 'top3' : 'topdown';
  }

  private displayDepartment(item: any): String {
    return item.isLeader ? `Leader ${item.name}` : `Thành viên ${item.name}`;
  }

  private async getListCycle() {
    if (this.$store.state.cycle.cycles.length) {
      this.listCycles = this.$store.state.cycle.cycles;
    } else {
      try {
        const { data } = await CycleRepository.getMetadata();
        this.listCycles = data.data.all.map((item) => {
          return {
            id: item.id,
            label: item.name,
          };
        });
        this.$store.commit(MutationState.SET_ALL_CYCLES, this.listCycles);
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.rank {
  color: $neutral-primary-4;
  @include drop-shadow;
  border-radius: $border-radius-base;
  &__col {
    background-color: $white;
    padding: $unit-4 0 0;
    border-radius: $border-radius-base;
    &__header {
      font-size: $text-2xl;
      padding: 0 $unit-4 $unit-4;
      @include box-shadow;
      border-radius: $border-radius-base $border-radius-base 0px 0px;
      display: flex;
      place-content: center space-between;
    }
    &__empty {
      text-align: center;
      padding: $unit-3;
    }
  }
}
.rank-item {
  display: flex;
  flex-direction: row;
  padding: $unit-2 $unit-4;
  @include box-shadow;
  justify-content: space-between;
  &__left {
    display: flex;
    flex-direction: row;
    place-content: center;
    &__index {
      color: $white;
      font-weight: $font-weight-bold;
      display: block;
      @include size($unit-10, $unit-10);
      border-radius: 50%;
      text-align: center;
      padding-top: 0.15rem;
      span {
        font-size: $unit-6;
      }
    }
    .el-avatar {
      align-self: center;
      margin: 0 $unit-2 0 $unit-6;
    }
    &__info {
      align-self: center;
      &--fullname {
        font-weight: $font-weight-medium;
      }
      &--department {
        color: $neutral-primary-2;
        font-size: $unit-3;
      }
    }
    .top1 {
      background-color: $yello-primary-1;
    }
    .top2 {
      background-color: $blue-primary-3;
    }
    .top3 {
      background-color: $orange-primary-1;
    }
    .topdown {
      background-color: $purple-primary-3;
    }
  }
  &__right {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: $font-weight-medium;
    font-size: $unit-5;
  }
}
</style>
