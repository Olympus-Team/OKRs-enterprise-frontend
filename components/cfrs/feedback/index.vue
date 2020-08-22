<template>
  <div v-loading="loadingTab" class="feedback">
    <el-row :gutter="30" class>
      <el-col v-if="listWatingFeedback.inferior" :md="12" :lg="12">
        <div class="feedback__col">
          <p class="feedback__col__header">{{ displayHeader('inferior') }}</p>
          <div v-for="item in listWatingFeedback.inferior.checkins" :key="item.id" class="cfr">
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
        </div>
      </el-col>
      <el-col v-if="listWatingFeedback.superior" :md="12" :lg="12">
        <div class="feedback__col">
          <p class="feedback__col__header">{{ displayHeader('superior') }}</p>
          <div v-for="item in listWatingFeedback.superior.checkins" :key="item.id" class="cfr">
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CfrsRepository } from '@/repositories/CfrsRepository';
import { EvaluationCriteriaEnum } from '@/constants/app.enum';
@Component<Feedback>({
  name: 'Feedback',
  async created() {
    await this.listWatingFeedbacks();
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
  private detailCheckinInfo: any = null;
  private listWatingFeedback: any = {
    superior: [],
    inferior: [],
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

  private visibleCreateDialog: Boolean = false;
  private visibleDetailDialog: Boolean = false;

  private async reloadData() {
    this.loadingTab = true;
    await this.listWatingFeedbacks();
    setTimeout(() => {
      this.loadingTab = false;
    }, 500);
  }

  private async listWatingFeedbacks() {
    try {
      await CfrsRepository.getListWaitingFeedback().then((res) => {
        this.listWatingFeedback = res.data.data;
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
  }
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
