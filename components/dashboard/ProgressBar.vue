<template>
  <div v-loading="loading" class="progress">
    <div class="progress__item">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="6" :md="6" class="progress__header">OKRs công ty:</el-col>
        <el-col v-if="dataOkrsProgress.startDate" :xs="24" :sm="4" :md="2" class="progress__start-cycle">
          {{ new Date(dataOkrsProgress.startDate) | dateFormat('MM/YYYY') }}
        </el-col>
        <el-col :xs="24" :sm="6" :md="12">
          <el-progress :percentage="dataOkrsProgress.root ? dataOkrsProgress.root : 0" :color="customColors" :text-inside="true" :stroke-width="26" />
        </el-col>
        <el-col v-if="dataOkrsProgress.endDate" :xs="24" :sm="4" :md="2" class="progress__end-cycle">
          {{ new Date(dataOkrsProgress.endDate) | dateFormat('MM/YYYY') }}
        </el-col>
      </el-row>
    </div>
    <div v-if="user.role.name !== 'ADMIN'" class="progress__item">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="6" :md="6" class="progress__header">OKRs nhóm:</el-col>
        <el-col v-if="dataOkrsProgress.startDate" :xs="24" :sm="4" :md="2" class="progress__start-cycle">
          {{ new Date(dataOkrsProgress.startDate) | dateFormat('MM/YYYY') }}
        </el-col>
        <el-col :xs="24" :sm="6" :md="12">
          <el-progress :percentage="dataOkrsProgress.team ? dataOkrsProgress.team : 0" :color="customColors" :text-inside="true" :stroke-width="26" />
        </el-col>
        <el-col v-if="dataOkrsProgress.endDate" :xs="24" :sm="4" :md="2" class="progress__end-cycle">
          {{ new Date(dataOkrsProgress.endDate) | dateFormat('MM/YYYY') }}
        </el-col>
      </el-row>
    </div>
    <div class="progress__item">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="6" :md="6" class="progress__header">OKRs cá nhân:</el-col>
        <el-col v-if="dataOkrsProgress.startDate" :xs="24" :sm="4" :md="2" class="progress__start-cycle">
          {{ new Date(dataOkrsProgress.startDate) | dateFormat('MM/YYYY') }}
        </el-col>
        <el-col :xs="24" :sm="6" :md="12">
          <el-progress
            :percentage="dataOkrsProgress.personal ? dataOkrsProgress.personal : 0"
            :color="customColors"
            :text-inside="true"
            :stroke-width="26"
          />
        </el-col>
        <el-col v-if="dataOkrsProgress.endDate" :xs="24" :sm="4" :md="2" class="progress__end-cycle">
          {{ new Date(dataOkrsProgress.endDate) | dateFormat('MM/YYYY') }}
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { customColors } from '../okrs/okrs.constant';
import { GetterState } from '@/constants/app.vuex';
@Component<ProgressBarComponent>({
  name: 'ProgressBarComponent',
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
})
export default class ProgressBarComponent extends Vue {
  @Prop(Object) readonly dataOkrsProgress;
  @Prop(Boolean) readonly loading!: boolean;
  private customColors = customColors;
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.progress {
  margin: $unit-8 0;
  padding: $unit-3 $unit-7;
  background: $white;
  border-radius: $unit-1;
  box-shadow: $box-shadow-default;
  &__item {
    padding: $unit-3 $unit-1;
  }
  &__header {
    font-weight: $font-weight-bold;
  }
  &__start-cycle {
    text-align: right;
    @include breakpoint-down(phone) {
      text-align: left;
    }
  }
  .el-progress {
    .el-progress-bar {
      &__outer {
        background-color: $purple-primary-2;
        border-radius: $border-radius-medium;
        .el-progress-bar__inner {
          border-radius: $border-radius-medium;
        }
      }
    }
  }
}
</style>
