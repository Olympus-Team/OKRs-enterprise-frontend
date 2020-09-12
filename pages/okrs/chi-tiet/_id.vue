<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="okrs-detail">
    <el-page-header title="Okrs Dashboard" @back="goToOkrsDashboard" />
    <div class="okrs-detail--top-action">
      <span class="okrs-detail--top-action__title">Chi tiết mục tiêu</span>
      <div v-if="checkDisplayButtons(objective.user.id)" class="okrs-detail--top-action__button">
        <el-button class="el-button el-button--white el-button--medium" @click="deleteOkrs(objective.id)">Xóa</el-button>
        <el-button class="el-button el-button--purple el-button--medium" @click="updateOkrs(objective.id)">Cập nhật</el-button>
      </div>
    </div>
    <div class="okrs-detail__content">
      <div class="okrs-detail__content--overview">
        <span>{{ objective.title.toUpperCase() }}</span>
        <el-progress type="line" :percentage="objective.progress" :text-inside="true" :stroke-width="26" />
      </div>
      <div class="okrs-detail__content--align">
        <span class="created">Được tạo bởi</span>
        <span class="username">{{ objective.user.fullName }}</span>
        <span class="alignedWith">Liên kết tới</span>
        <span v-if="checkIsRootObjective(objective)" style="display: none;"></span>
        <a
          v-else
          :href="objective.parentObjective ? `${$config.baseURL}/OKRs/chi-tiet/${objective.parentObjective.id}` : null"
          target="_blank"
          class="parentOkrs"
        >
          {{ objective.parentObjective ? objective.parentObjective.title : null }}
        </a>
        <span v-if="!checkIsRootObjective(objective)" class="alignedBy">Được liên kết với</span>
        <div v-if="objective.alignmentObjectives.length" class="list-aligned-okrs">
          <p v-for="item in objective.alignmentObjectives" :key="item.id" class="alignedOkrs">
            <a :href="`${$config.baseURL}/OKRs/chi-tiet/${item.id}`" target="_blank">{{ item.title }}</a>
          </p>
        </div>
        <p v-if="objective.alignmentObjectives.length === 0" class="alignedOkrs">Không có</p>
      </div>
      <div class="okrs-detail__content--detail">
        <div class="okrs-detail__content--detail__header">
          <span class="content">Kết quả then chốt</span>
          <span class="target">Mục tiêu</span>
          <span class="start">Giá trị ban đầu</span>
          <span class="obtained">Giá trị đạt được</span>
          <span class="progress-title">Tiến độ</span>
          <span class="plan">Link kế hoạch</span>
          <span class="result">Link kết quả</span>
        </div>
        <template v-for="kr in objective.keyResults">
          <grid-detail-okrs :key="kr.content.substring(0, 10)" :key-result="kr" />
        </template>
      </div>
    </div>
    <update-okrs-dialog :temporary-okrs="tempOkrs" :visible-dialog.sync="visibleDialog" :reload-data="reloadData" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from 'vue-property-decorator';

import OkrsRepository from '@/repositories/OkrsRepository';
import { confirmWarningConfig, notificationConfig } from '@/constants/app.constant';
import { MutationState, DispatchAction } from '@/constants/app.vuex';
@Component<OkrsDetailPage>({
  name: 'OkrsDetailPage',
  head() {
    return {
      title: 'Chi tiết OKRs',
    };
  },
  async asyncData({ params }) {
    try {
      const { data } = await OkrsRepository.getOkrsDetail(+params.id);
      return {
        objective: Object.freeze(data.data),
      };
    } catch (error) {}
  },
  created() {
    this.tempOkrs = this.objective;
  },
  mounted() {
    this.$store.dispatch(DispatchAction.SET_MEASURE_UNITS);
  },
  beforeRouteLeave(_, __, next) {
    this.$store.dispatch(DispatchAction.CLEAR_MEASURE_UNITS);
    next();
  },
})
export default class OkrsDetailPage extends Vue {
  private visibleDialog: boolean = false;
  private fullscreenLoading: boolean = false;

  private tempOkrs: any = null;

  private goToOkrsDashboard() {
    this.$router.push('/OKRs');
  }

  private checkIsRootObjective(objective: any) {
    return objective.isRootObjective;
  }

  private deleteOkrs(okrsId: number) {
    this.$confirm('Bạn có chắc chắn muốn xóa OKRs này không?', { ...confirmWarningConfig }).then(async () => {
      try {
        await OkrsRepository.deleteOkrs(okrsId).then((res) => {
          this.$notify.success({
            ...notificationConfig,
            message: 'Xóa OKRs thành công',
          });
        });
        this.$router.push('/OKRs');
      } catch (error) {}
    });
  }

  private async reloadData() {
    this.fullscreenLoading = true;
    try {
      const { data } = await OkrsRepository.getOkrsDetail(+this.$route.params.id);
      // @ts-ignore
      this.objective = Object.freeze(data.data);
      // @ts-ignore
      this.tempOkrs = this.objective;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 300);
    } catch (error) {
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 300);
    }
  }

  /**
   * Just display 2 buttons(Update & delete) when this user own this OKRs
   */
  private checkDisplayButtons(okrsId: number) {
    const userId = +this.$store.state.auth.user.id;
    return userId === okrsId;
  }

  private updateOkrs(okrsId: number) {
    this.visibleDialog = true;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-detail {
  padding: $unit-12 $unit-10 0 $unit-8;
  &--top-action {
    display: flex;
    place-content: center space-between;
    &__title {
      font-size: $unit-7;
    }
    &__button {
      button {
        font-size: $unit-4;
      }
    }
  }
  &__content {
    &--overview {
      display: flex;
      place-content: center flex-start;
      margin-top: $unit-7;
      @include box-okrs-detail;
    }
    &--align {
      @include box-okrs-detail;
      margin-top: $unit-5;
      display: grid;
      row-gap: $unit-5;
      grid-template-rows: auto;
      grid-template-columns: 1.5fr 3.5fr 1.5fr 3.5fr;
      grid-template-areas:
        'createdBy username alignedWith parentOkrs'
        'alignedBy alignedOkrs . .';
      .created {
        grid-area: createdBy;
      }
      .username,
      .parentOkrs,
      .alignedOkrs {
        color: $neutral-primary-2;
        font-size: 0.875rem;
      }
      .username {
        grid-area: username;
        color: $neutral-primary-2;
      }
      .alignedWith {
        grid-area: alignedWith;
      }
      .parentOkrs {
        @include truncate-oneline();
        color: $blue-primary-1;
        grid-area: parentOkrs;
      }
      .alignedBy {
        grid-area: alignedBy;
      }
      .list-aligned-okrs {
        display: flex;
        flex-direction: column;
        .alignedOkrs {
          @include truncate-oneline();
          grid-area: alignedOkrs;
          color: $blue-primary-1;
        }
      }
    }
    &--detail {
      @include box-okrs-detail;
      margin-top: $unit-5;
      &__header {
        display: grid;
        grid-template-rows: auto;
        padding-bottom: $unit-4;
        grid-template-columns: 4fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-areas: 'content target start obtained progress-title plan result';
        .content {
          grid-area: content;
        }
        .target {
          grid-area: target;
        }
        .start {
          grid-area: start;
        }
        .obtained {
          grid-area: obtained;
        }
        .progress-title {
          grid-area: progress-title;
        }
        .plan {
          grid-area: plan;
        }
        .result {
          grid-area: result;
        }
        .content,
        .target,
        .start,
        .obtained,
        .progress-title,
        .plan,
        .result {
          border-bottom: 1px solid $neutral-primary-0;
          padding-bottom: $unit-3;
        }
      }
    }
  }

  .el-progress {
    width: 25vw;
    margin-left: auto;
    .el-progress-bar {
      &__outer {
        border-radius: $border-radius-medium;
        background-color: $purple-primary-1;
      }
      &__inner {
        border-radius: $border-radius-medium;
        background-color: $purple-primary-4;
      }
    }
  }
}
</style>
