<template>
  <div v-loading="loadingTab" class="history">
    <el-row :gutter="30" class>
      <el-col :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs {{ displayNameCfrs }} gửi đi</p>
          <p v-if="!sentItems.length" class="history__col__empty">Chưa có CFRs</p>
          <div v-else class="history__col--items">
            <div v-for="(item, index) in sentItems" :key="`${index}-${item.id}`" class="history-item" @click="viewDetailCfrs(item, 'sent')">
              <div class="item__left">
                <div class="item__left--icon">
                  <div :class="['icon__type', isFeedback(item.type)]">
                    <span>{{ item.type === 'recognition' ? 'R' : 'F' }}</span>
                  </div>
                  <div class="icon__avatar">
                    <el-avatar :size="30">
                      <img :src="item.receiver.avatarURL ? item.receiver.avatarURL : item.receiver.gravatarURL" alt="avatar" />
                    </el-avatar>
                  </div>
                </div>
                <div class="item__left--content">
                  <p class="content__title">{{ item.evaluationCriteria.content }}</p>
                  <p class="content__description">Gửi đến {{ item.receiver.fullName }} - {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}</p>
                  <p class="content__direction">{{ isLeaderToMember(item.evaluationCriteria.type) }}</p>
                </div>
              </div>
              <div class="item__right">
                <span>{{ item.evaluationCriteria.numberOfStar }}</span>
                <icon-star-dashboard />
              </div>
            </div>
          </div>
          <infinite-loading spinner="spiral" direction="bottom" :identifier="infiniteId" @infinite="infiniteSentHandler">
            <span slot="no-more"></span>
            <span slot="no-results"></span>
          </infinite-loading>
        </div>
      </el-col>
      <el-col :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs {{ displayNameCfrs }} nhận được</p>
          <p v-if="!receivedItems.length" class="history__col__empty">Chưa có CFRs</p>
          <div v-else class="history__col--items">
            <div v-for="item in receivedItems" :key="`received-${item.id}`" class="history-item" @click="viewDetailCfrs(item, 'received')">
              <div class="item__left">
                <div class="item__left--icon">
                  <div :class="['icon__type', isFeedback(item.type)]">
                    <span>{{ item.type === 'recognition' ? 'R' : 'F' }}</span>
                  </div>
                  <div class="icon__avatar">
                    <el-avatar :size="30">
                      <img :src="item.sender.avatarURL ? item.sender.avatarURL : item.sender.gravatarURL" alt="avatar" />
                    </el-avatar>
                  </div>
                </div>
                <div class="item__left--content">
                  <p class="content__title">{{ item.evaluationCriteria.content }}</p>
                  <p class="content__description">Gửi bởi {{ item.sender.fullName }} - {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}</p>
                  <p class="content__direction">{{ isLeaderToMember(item.evaluationCriteria.type) }}</p>
                </div>
              </div>
              <div class="item__right">
                <span>{{ item.evaluationCriteria.numberOfStar }}</span>
                <icon-star-dashboard />
              </div>
            </div>
          </div>
        </div>
        <infinite-loading spinner="spiral" direction="bottom" :identifier="infiniteId" @infinite="infiniteReceivedHandler">
          <span slot="no-more"></span>
          <span slot="no-results"></span>
        </infinite-loading>
      </el-col>
      <el-col :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs toàn công ty</p>
          <p v-if="!allItems.length" class="history__col__empty">Chưa có CFRs</p>
          <div v-else class="history__col--items">
            <div v-for="(item, index) in allItems" :key="`${index}-${item.id}`" class="history-item" @click="viewDetailCfrs(item, 'all')">
              <div class="item__left">
                <div class="item__left--icon">
                  <div :class="['icon__type', isFeedback(item.type)]">
                    <span>{{ item.type === 'recognition' ? 'R' : 'F' }}</span>
                  </div>
                  <div class="icon__avatar">
                    <el-avatar :size="30">
                      <img :src="item.receiver.avatarURL ? item.receiver.avatarURL : item.receiver.gravatarURL" alt="avatar" />
                    </el-avatar>
                  </div>
                </div>
                <div class="item__left--content">
                  <p class="content__title">{{ item.evaluationCriteria.content }}</p>
                  <p class="content__description">
                    {{ takeTwoLastNameUser(item.sender.fullName) }} đến {{ takeTwoLastNameUser(item.receiver.fullName) }} -
                    {{ new Date(item.createdAt) | dateFormat('DD/MM/YYYY') }}
                  </p>
                  <p class="content__direction">{{ isLeaderToMember(item.evaluationCriteria.type) }}</p>
                </div>
              </div>
              <div class="item__right">
                <span>{{ item.evaluationCriteria.numberOfStar }}</span>
                <icon-star-dashboard />
              </div>
            </div>
          </div>
        </div>
        <infinite-loading spinner="spiral" direction="bottom" :identifier="infiniteId" @infinite="infiniteAllHandler">
          <span slot="no-more"></span>
          <span slot="no-results"></span>
        </infinite-loading>
      </el-col>
    </el-row>
    <transition name="el-zoom-in-center">
      <cfrs-detail-history
        v-if="visibleDetailDialog"
        :visible-dialog.sync="visibleDetailDialog"
        :item-data="itemDataCfrs.data"
        :type="itemDataCfrs.type"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import InfiniteLoading, { StateChanger } from 'vue-infinite-loading';
import { itemCfrsDefault } from './history.const';
import IconStarDashboard from '@/assets/images/dashboard/star-dashboard.svg';
import CfrsRepository from '@/repositories/CfrsRepository';
import { MutationState } from '@/constants/app.vuex';
import { HistoryCfrsParams } from '@/constants/app.interface';

@Component<History>({
  name: 'History',
  components: {
    IconStarDashboard,
    InfiniteLoading,
  },
  beforeCreate() {
    this.$store.commit(MutationState.SET_TEMP_USER, this.$store.state.auth.user);
  },
  beforeMount() {
    this.loadingTab = true;
    setTimeout(() => {
      this.loadingTab = false;
    }, 1000);
  },
})
export default class History extends Vue {
  private countSent: number = 1;
  private countReceived: number = 1;
  private countAll: number = 1;

  private infiniteId: number = +new Date();
  private loadingTab: boolean = false;

  private visibleDetailDialog = false;
  private cycleTempId: number = this.$store.state.cycle.cycle.id;

  private sentItems: any[] = [];
  private receivedItems: any[] = [];
  private allItems: any[] = [];

  private sentContext: HistoryCfrsParams = {
    page: 1,
    limit: 10,
  };

  private receivedContext: HistoryCfrsParams = {
    page: 1,
    limit: 10,
  };

  private allContext: HistoryCfrsParams = {
    page: 1,
    limit: 10,
  };

  private itemDataCfrs: any = itemCfrsDefault;

  @Watch('$store.state.cycle.cycleTemp')
  private changeListDataOnCycle(cycleTemp: number) {
    this.sentContext.page = 1;
    this.receivedContext.page = 1;
    this.allContext.page = 1;
    this.sentItems = [];
    this.receivedItems = [];
    this.allItems = [];
    this.infiniteId += 1;
  }

  @Watch('$store.state.user.tempUser.id')
  private changeListDataOnUser(tempUserId: number) {
    this.sentContext.page = 1;
    this.receivedContext.page = 1;
    this.sentItems = [];
    this.receivedItems = [];
    this.infiniteId += 1;
  }

  private async infiniteSentHandler(stateChanger: StateChanger) {
    this.sentContext.cycleId = this.$store.state.cycle.cycleTemp ? this.$store.state.cycle.cycleTemp : this.$store.state.cycle.cycle.id;
    this.sentContext.userId = this.$store.state.user.tempUser ? this.$store.state.user.tempUser.id : this.$store.state.auth.user.id;
    try {
      await CfrsRepository.getHistoryCfrs(this.sentContext, 1).then(({ data }) => {
        if (data.data.items.length) {
          this.sentContext.page = this.countSent++;
          this.sentItems.push(...Object.freeze(data.data.items));
          stateChanger.loaded();
        } else {
          stateChanger.complete();
        }
      });
    } catch (error) {}
  }

  private async infiniteReceivedHandler(stateChanger: StateChanger) {
    this.receivedContext.cycleId = this.$store.state.cycle.cycleTemp ? this.$store.state.cycle.cycleTemp : this.$store.state.cycle.cycle.id;
    this.receivedContext.userId = this.$store.state.user.tempUser ? this.$store.state.user.tempUser.id : this.$store.state.auth.user.id;
    try {
      await CfrsRepository.getHistoryCfrs(this.receivedContext, 2).then(({ data }) => {
        if (data.data.items.length) {
          this.receivedContext.page = this.countReceived++;
          this.receivedItems.push(...Object.freeze(data.data.items));
          stateChanger.loaded();
        } else {
          stateChanger.complete();
        }
      });
    } catch (error) {}
  }

  private async infiniteAllHandler(stateChanger: StateChanger) {
    this.allContext.cycleId = this.$store.state.cycle.cycleTemp ? this.$store.state.cycle.cycleTemp : this.$store.state.cycle.cycle.id;
    this.allContext.userId = this.$store.state.user.tempUser ? this.$store.state.user.tempUser.id : this.$store.state.auth.user.id;
    try {
      await CfrsRepository.getHistoryCfrs(this.allContext, 3).then(({ data }) => {
        if (data.data.items.length) {
          this.allContext.page = this.countAll++;
          this.allItems.push(...Object.freeze(data.data.items));
          stateChanger.loaded();
        } else {
          stateChanger.complete();
        }
      });
    } catch (error) {}
  }

  private viewDetailCfrs(item: any, type: string): void {
    this.itemDataCfrs.data = item;
    this.itemDataCfrs.type = type;
    this.visibleDetailDialog = true;
  }

  private isFeedback(type: string): String | null {
    return type !== 'recognition' ? 'is-feedback' : null;
  }

  private get displayNameCfrs(): String {
    if (!this.$store.state.user.tempUser) {
      return 'bạn';
    }
    if (this.$store.state.user.tempUser.id !== this.$store.state.auth.user.id) {
      return this.takeTwoLastNameUser(this.$store.state.user.tempUser.fullName);
    } else {
      return 'bạn';
    }
  }

  private isLeaderToMember(type: string): string {
    if (type === 'LEADER_TO_MEMBER') {
      return 'Leader đánh giá thành viên';
    } else {
      return 'Thành viên đánh giá Leader';
    }
  }

  private takeTwoLastNameUser(userName: string): string {
    const arr = userName.split(' ');
    return arr.slice(Math.max(arr.length - 2, 1)).join(' ');
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.history {
  color: $neutral-primary-4;
  @include drop-shadow;
  border-radius: $border-radius-base;
  &__col {
    background-color: $white;
    padding: $unit-4 0 0;
    border-radius: $border-radius-base;
    @include box-shadow;
    &__empty {
      text-align: center;
      padding: $unit-3;
    }
    &__header {
      font-size: $text-2xl;
      padding: 0 0 $unit-4;
      @include box-shadow;
      border-radius: $border-radius-base $border-radius-base 0px 0px;
      padding-left: $unit-4;
    }
    &--items {
      height: 885px;
      overflow-y: auto;
      .history-item {
        display: flex;
        flex-direction: row;
        place-content: center space-between;
        padding: $unit-2 0;
        @include box-shadow;
        cursor: pointer;
        .item__left {
          display: flex;
          padding-left: $unit-4;
          &--icon {
            display: flex;
            flex-direction: column;
            .icon__type {
              color: $white;
              background-color: $purple-primary-3;
              font-weight: $font-weight-bold;
              display: flex;
              place-content: center;
              align-self: center;
              @include circle($unit-8);
              text-align: center;
              padding-top: 0.15rem;
              span {
                align-self: center;
                font-size: $unit-4;
              }
            }
            .icon__avatar {
              margin-top: $unit-1;
            }
            .is-feedback {
              background-color: $orange-primary-1;
            }
          }
          &--content {
            display: flex;
            flex-direction: column;
            align-self: center;
            margin-left: $unit-4;
            p {
              @include text-ellipsis(1);
            }
            .content__title {
              margin: unset;
              font-weight: bold;
            }
            .content__description {
              margin: unset;
              font-size: 0.875rem;
              color: $neutral-primary-4;
              white-space: normal;
            }
            .content__direction {
              margin: unset;
              font-style: italic;
              font-size: $unit-3;
              color: $neutral-primary-3;
            }
          }
        }
        .item__right {
          display: flex;
          place-content: center;
          align-self: center;
          padding-right: $unit-4;
          font-weight: $font-weight-medium;
          font-size: $unit-5;
          margin-left: $unit-2;
          svg {
            display: flex;
            align-self: center;
          }
        }
      }
    }
  }
}
</style>
