<template>
  <div v-loading="loadingTab" class="feedback">
    <el-row :gutter="30" class>
      <el-col v-if="listWatingFeedback.inferior && $store.state.auth.user.isLeader" v-loading="loadingInferior" :md="12" :lg="12">
        <div class="feedback__col">
          <p class="feedback__col__header">{{ displayHeader('inferior') }}</p>
          <p v-if="!listWatingFeedback.inferior.checkins.items.length" class="none-cfr">Không có dữ liệu để phản hồi</p>
          <div v-for="item in listWatingFeedback.inferior.checkins.items" v-else :key="item.id" class="cfr">
            <div class="cfr__left" @click="viewDetailCheckin(item, listWatingFeedback.inferior.type)">
              <el-avatar :size="30">
                <img :src="item.objective.user.avatarURL ? item.objective.user.avatarURL : item.objective.user.gravatarURL" alt="avatar" />
              </el-avatar>
              <div class="cfr__left__content">
                <p class="cfr__left__content--title">{{ item.objective.title }}</p>
                <p class="cfr__left__content--description">
                  {{ item.objective.user.fullName }} - {{ new Date(item.checkinAt) | dateFormat('DD/MM/YYYY') }}
                </p>
              </div>
            </div>
            <div class="cfr__right">
              <el-button
                class="el-button el-button--purple el-button-medium"
                @click="showDialogCreatingFeedback(item, listWatingFeedback.inferior.type, false)"
                >Tạo phản hồi</el-button
              >
            </div>
          </div>
          <base-pagination
            v-if="listWatingFeedback.inferior.checkins.items.length"
            class="feedback__col__pagination"
            :total="totalItems"
            :page.sync="paramsContext.page"
            :limit.sync="paramsContext.limit"
            @pagination="handlePagination($event)"
          />
        </div>
      </el-col>
      <el-col v-if="listWatingFeedback.superior" :md="12" :lg="12">
        <div class="feedback__col">
          <p class="feedback__col__header">{{ displayHeader('superior') }}</p>
          <p v-if="!listWatingFeedback.superior.checkins.length" class="none-cfr">Không có dữ liệu để phản hồi</p>
          <div v-for="item in listWatingFeedback.superior.checkins" v-else :key="item.id" class="cfr">
            <div class="cfr__left" @click="viewDetailCheckin(item, listWatingFeedback.superior.type)">
              <el-avatar :size="30">
                <img
                  :src="
                    listWatingFeedback.superior.user.avatarURL
                      ? listWatingFeedback.superior.user.avatarURL
                      : listWatingFeedback.superior.user.gravatarURL
                  "
                  alt="avatar"
                />
              </el-avatar>
              <div class="cfr__left__content">
                <p class="cfr__left__content--title">{{ item.objective.title }}</p>
                <p class="cfr__left__content--description">
                  {{ item.objective.user.fullName }} - {{ new Date(item.checkinAt) | dateFormat('DD/MM/YYYY') }}
                </p>
              </div>
            </div>
            <div class="cfr__right">
              <el-button
                class="el-button el-button--purple el-button-medium"
                @click="showDialogCreatingFeedback(item, listWatingFeedback.superior.type, true)"
                >Tạo phản hồi</el-button
              >
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <cfrs-create-feedback
      v-if="visibleCreateDialog"
      :visible-dialog.sync="visibleCreateDialog"
      :data-feedback="dataFeedback"
      :reload-data="reloadData"
    />
    <cfrs-detail-feedback
      v-if="visibleDetailDialog"
      :visible-dialog.sync="visibleDetailDialog"
      :detail-checkin-info="detailCheckinInfo"
      @openFeedbackDialog="openFeedbackDialog($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CfrsRepository from '@/repositories/CfrsRepository';
import { EvaluationCriteriaEnum } from '@/constants/app.enum';
import { ParamsQuery } from '@/constants/app.interface';
@Component<Feedback>({
  name: 'Feedback',
  async created() {
    await this.getListWatingFeedbacks();
  },
  beforeMount() {
    this.loadingTab = true;
    setTimeout(() => {
      this.loadingTab = false;
    }, 500);
  },
})
export default class Feedback extends Vue {
  private loadingTab: boolean = false;
  private loadingInferior: boolean = false;
  private detailCheckinInfo: any = null;
  private totalItems: number = 1;

  private paramsContext: ParamsQuery = {
    page: 1,
    limit: 10,
  };

  private listWatingFeedback: any = {
    superior: {
      checkins: [],
    },
    inferior: {
      checkins: {
        items: [],
        meta: {},
      },
    },
  };

  private dataFeedback: any = {
    checkinAt: null,
    objective: {
      title: '',
      user: {
        fullName: '',
      },
    },
  };

  private visibleCreateDialog: boolean = false;
  private visibleDetailDialog: boolean = false;

  @Watch('$route.query.page', { immediate: false })
  private async changeListWaitingFeedbacks(page: string) {
    this.loadingInferior = true;
    try {
      this.paramsContext.page = +page;
      await CfrsRepository.getListWaitingFeedback(this.paramsContext).then(({ data }) => {
        this.listWatingFeedback.inferior = Object.freeze(data.data.inferior);
        setTimeout(() => {
          this.loadingInferior = false;
        }, 300);
      });
    } catch (error) {
      setTimeout(() => {
        this.loadingInferior = false;
      }, 300);
    }
  }

  private handlePagination(pagination: any) {
    this.$router.push(`?tab=feedback&page=${pagination.page}`);
  }

  private async reloadData() {
    this.loadingTab = true;
    await this.getListWatingFeedbacks();
    setTimeout(() => {
      this.loadingTab = false;
    }, 500);
  }

  private async getListWatingFeedbacks() {
    try {
      await CfrsRepository.getListWaitingFeedback(this.paramsContext).then(({ data }) => {
        this.listWatingFeedback.inferior = Object.freeze(data.data.inferior);
        this.listWatingFeedback.superior = Object.freeze(data.data.superior);
        this.totalItems = Object.freeze(data.data.inferior.checkins.meta.totalItems);
      });
    } catch (error) {}
  }

  private showDialogCreatingFeedback(itemCheckin: any, type: EvaluationCriteriaEnum, isSuperior: boolean): void {
    this.dataFeedback = itemCheckin;
    this.dataFeedback.type = type;
    if (isSuperior) {
      this.dataFeedback.user = this.listWatingFeedback.superior.user;
    }
    this.dataFeedback.isSuperior = isSuperior;
    this.visibleCreateDialog = true;
  }

  private openFeedbackDialog(detailCheckinInfo: any) {
    this.dataFeedback = detailCheckinInfo;
    setTimeout(() => {
      this.visibleCreateDialog = true;
    }, 300);
  }

  private viewDetailCheckin(itemCheckin: any, type: EvaluationCriteriaEnum): void {
    this.detailCheckinInfo = itemCheckin;
    this.detailCheckinInfo.type = type;
    this.visibleDetailDialog = true;
  }

  private displayHeader(type: string, superior?: any) {
    if (type === 'inferior') {
      // Feedback cho Team member
      if (this.$store.state.auth.user.isLeader && this.$store.state.auth.user.role.name !== 'ADMIN') {
        return 'Phản hồi cho Team Member';
      }
      // Feedback cho Team Leader
      if (this.$store.state.auth.user.role.name === 'ADMIN') {
        return 'Phản hồi cho Team Leader';
      }
    } else {
      // Feedback cho Team Leader
      if (!this.$store.state.auth.user.isLeader && this.$store.state.auth.user.role.name !== 'ADMIN') {
        return 'Phản hồi cho Team Leader';
      }
      // Feedback cho Admin
      if (this.$store.state.auth.user.isLeader && this.$store.state.auth.user.role.name !== 'ADMIN') {
        return 'Phản hồi cho Admin';
      }
      // Feedback cho bạn -- admin
      if (this.$store.state.auth.user.role.name === 'ADMIN') {
        return 'Phản hồi cho tôi';
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.feedback {
  color: $neutral-primary-4;
  @include drop-shadow;
  border-radius: $border-radius-base;
  &__col {
    background-color: $white;
    padding: $unit-4 0 0;
    border-radius: $border-radius-base;
    &__header {
      font-size: $text-2xl;
      padding: 0 0 $unit-4 $unit-4;
      @include box-shadow;
      border-radius: $border-radius-base $border-radius-base 0px 0px;
    }
    &__empty {
      text-align: center;
      padding: $unit-3;
    }
    &__pagination {
      padding: $unit-4 0;
      display: flex;
      place-content: center;
    }
  }
}
.none-cfr {
  text-align: center;
  padding: $unit-3 $unit-4 $unit-3 $unit-4;
  @include box-shadow;
}
.cfr {
  display: flex;
  flex-direction: row;
  padding: $unit-3 $unit-4 $unit-3 $unit-4;
  @include box-shadow;
  justify-content: space-between;
  &__left {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    &__content {
      margin: 0 $unit-4;
    }
    &__title {
      font-weight: bold;
      font-size: $unit-4;
      @include truncate-oneline;
    }
    &__description {
      font-size: 0.875rem;
      color: $neutral-primary-3;
      line-height: 23px;
      padding-right: 10px;
    }
    .el-avatar {
      align-self: center;
    }
  }
  &__right {
    align-self: center;
  }
}
</style>
