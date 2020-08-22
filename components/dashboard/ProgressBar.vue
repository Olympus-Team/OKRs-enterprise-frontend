<template>
  <div v-loading="loading" class="progress">
    <div class="progress__item">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" class="progress__header">OKR công ty:</el-col>
        <el-col v-if="dataOkrsProgress.startDate" :xs="5" :sm="4" :md="2" class="progress__start-cycle">{{
          new Date(dataOkrsProgress.startDate) | dateFormat('MM/YYYY')
        }}</el-col>
        <el-col :xs="8" :sm="6" :md="12">
          <el-progress :percentage="dataOkrsProgress.root ? dataOkrsProgress.root : 0" :color="customColors" :text-inside="true" :stroke-width="26" />
        </el-col>
        <el-col v-if="dataOkrsProgress.endDate" :xs="5" :sm="4" :md="2" class="progress__end-cycle">{{
          new Date(dataOkrsProgress.endDate) | dateFormat('MM/YYYY')
        }}</el-col>
      </el-row>
    </div>
    <div class="progress__item">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" class="progress__header">OKR nhóm:</el-col>
        <el-col v-if="dataOkrsProgress.startDate" :xs="5" :sm="4" :md="2" class="progress__start-cycle">{{
          new Date(dataOkrsProgress.startDate) | dateFormat('MM/YYYY')
        }}</el-col>
        <el-col :xs="8" :sm="6" :md="12">
          <el-progress :percentage="dataOkrsProgress.team ? dataOkrsProgress.team : 0" :color="customColors" :text-inside="true" :stroke-width="26" />
        </el-col>
        <el-col v-if="dataOkrsProgress.endDate" :xs="5" :sm="4" :md="2" class="progress__end-cycle">{{
          new Date(dataOkrsProgress.endDate) | dateFormat('MM/YYYY')
        }}</el-col>
      </el-row>
    </div>
    <div class="progress__item">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" class="progress__header">OKR cá nhân:</el-col>
        <el-col v-if="dataOkrsProgress.startDate" :xs="5" :sm="4" :md="2" class="progress__start-cycle">{{
          new Date(dataOkrsProgress.startDate) | dateFormat('MM/YYYY')
        }}</el-col>
        <el-col :xs="8" :sm="6" :md="12">
          <el-progress
            :percentage="dataOkrsProgress.personal ? dataOkrsProgress.personal : 0"
            :color="customColors"
            :text-inside="true"
            :stroke-width="26"
          />
        </el-col>
        <el-col v-if="dataOkrsProgress.endDate" :xs="5" :sm="4" :md="2" class="progress__end-cycle">{{
          new Date(dataOkrsProgress.endDate) | dateFormat('MM/YYYY')
        }}</el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component<ProgressBarComponent>({
  name: 'ProgressBarComponent',
})
export default class ProgressBarComponent extends Vue {
  @Prop(Object) readonly dataOkrsProgress;
  @Prop(Boolean) readonly loading!: boolean;
  private customColors(percentage: number) {
    if (percentage < 30) {
      return '#e3d0ff';
    } else if (percentage < 70) {
      return '#9c6ade';
    } else {
      return '#50248f';
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.progress {
  margin: $unit-8 0;
  padding: $unit-3 $unit-7;
  background: $white;
  border-radius: $unit-1;
  box-shadow: $box-shadow-default;
  &__item {
    padding: $unit-3 $unit-1;
    .el-progress-bar {
      &__outer {
        background-color: $purple-primary-1;
        border-radius: $border-radius-medium;
        .el-progress-bar__inner {
          border-radius: $border-radius-medium;
        }
      }
    }
  }
  &__header {
    font-weight: $font-weight-bold;
  }
  &__start-cycle {
    text-align: right;
  }
  &__end-cycle {
  }
}
</style>
