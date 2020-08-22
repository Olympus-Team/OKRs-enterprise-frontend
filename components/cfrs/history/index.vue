<template>
  <div v-loading="loadingTab" class="history">
    <el-row :gutter="30" class>
      <el-col v-loading="loadingPersonalTab" :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs {{ displayNameCfrs }} gửi đi</p>
          <p v-if="!historyItems.sent.length" class="history__col__empty">Chưa có CFRs</p>
          <div
            v-for="(item, index) in historyItems.sent"
            v-else
            :key="`${index}-${item.id}`"
            class="history-item"
            @click="viewDetailCfrs(item, 'sent')"
          >
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
      </el-col>
      <el-col v-loading="loadingPersonalTab" :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs {{ displayNameCfrs }} nhận được</p>
          <p v-if="!historyItems.received.length" class="history__col__empty">Chưa có CFRs</p>
          <div
            v-for="item in historyItems.received"
            v-else
            :key="`received-${item.id}`"
            class="history-item"
            @click="viewDetailCfrs(item, 'received')"
          >
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
      </el-col>
      <el-col :md="8" :lg="8">
        <div class="history__col">
          <p class="history__col__header">CFRs toàn công ty</p>
          <p v-if="!historyItems.all.length" class="history__col__empty">Chưa có CFRs</p>
          <div
            v-for="(item, index) in historyItems.all"
            v-else
            :key="`${index}-${item.id}`"
            class="history-item"
            @click="viewDetailCfrs(item, 'all')"
          >
            <div class="item__left">
              <div class="item__left--icon">
                <div :class="['icon__type', isFeedback(item.type)]">
                  <span>{{ item.type === 'recognition' ? 'R' : 'F' }}</span>
                </div>
                <div class="icon__avatar">
                  <el-avatar :size="30">
                    <img :src="item.sender.avatarURL ? item.sender.avatarURL : item.sender.gravatarURL" alt="avatar" />
                  </el-avatar>
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
        <!-- Phân trang -->
        <!-- <base-pagination class="pagination-bottom" :total="total" :page.sync="syncPage" :limit.sync="syncLimit" @pagination="handlePagination($event)" /> -->
      </el-col>
    </el-row>
    <cfrs-detail-history :visible-dialog.sync="visibleCreateDialog" :item-data="itemDataCfrs.data" :type="itemDataCfrs.type" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CreateFeedback from './Create.vue';
import IconStarDashboard from '@/assets/images/dashboard/star-dashboard.svg';
import { CfrsRepository } from '@/repositories/CfrsRepository';
import { MutationState } from '@/constants/app.enum';
@Component<History>({
  name: 'History',
  components: {
    IconStarDashboard,
  },
  beforeCreate() {
    this.$store.commit(MutationState.SET_TEMP_USER, this.$store.state.auth.user);
  },
  created() {
    this.getListDataHistory(this.$store.state.cycle.cycle.id);
  },
  beforeMount() {
    this.loadingTab = true;
    setTimeout(() => {
      this.loadingTab = false;
    }, 1000);
  },
})
export default class History extends Vue {
  private loadingTab: boolean = false;
  private loadingPersonalTab: boolean = false;
  private visibleCreateDialog = false;
  private cycleTempId: number = this.$store.state.cycle.cycle.id;
  private historyItems: any = {
    sent: [],
    received: [],
    all: [],
  };

  private itemDataCfrs: any = {
    data: {
      content: '',
      createdAt: '',
      objective: {
        title: '',
      },
      checkin: {
        objective: {},
      },
      sender: {},
      receiver: {},
      type: '',
    },
    type: '',
  };

  @Watch('$store.state.cycle.cycleTemp')
  private async changeListDataOnCycle(cycleTemp: number) {
    this.loadingTab = true;
    await this.getListDataHistory(cycleTemp, this.$store.state.user.tempUser.id);
    setTimeout(() => {
      this.loadingTab = false;
    }, 300);
  }

  @Watch('$store.state.user.tempUser.id')
  private async changeListDataOnUser(tempUserId: number) {
    this.loadingPersonalTab = true;
    await this.getListDataHistory(this.$store.state.cycle.cycleTemp, tempUserId);
    setTimeout(() => {
      this.loadingPersonalTab = false;
    }, 300);
  }

  private async getListDataHistory(cycleId: number, userId: number = this.$store.state.auth.user.id) {
    try {
      await CfrsRepository.getHistoryCfrs(cycleId, userId).then((res) => {
        this.historyItems = Object.freeze(res.data.data);
      });
    } catch (error) {}
  }

  private viewDetailCfrs(item: any, type: string): void {
    this.itemDataCfrs.data = item;
    this.itemDataCfrs.type = type;
    console.table(this.itemDataCfrs.data);
    this.visibleCreateDialog = true;
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
  }
}
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
        @include truncate-oneline;
        margin: unset;
        display: flex;
      }
      .content__title {
        font-weight: bold;
      }
      .content__description {
        font-size: 0.875rem;
        color: $neutral-primary-4;
        white-space: normal;
      }
      .content__direction {
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
    svg {
      display: flex;
      align-self: center;
    }
  }
}
</style>
