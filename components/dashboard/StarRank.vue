<template>
  <div class="star">
    <el-row v-loading="loading" :gutter="30">
      <el-col :sm="24" :md="12">
        <div class="star__col star__income">
          <div class="star__col__header">
            <icon-star-dashboard class="star__col__icon" />
            <p class="star__col__title">Top sao nhận được</p>
          </div>
          <div v-for="(item, index) in dataStarInCome" :key="item.id" class="star-item">
            <div class="star-item__left">
              <icon-star-first v-if="index === 0" class="star__col__icon" />
              <icon-star-second v-if="index === 1" class="star__col__icon" />
              <icon-star-third v-if="index === 2" class="star__col__icon" />
              <p class="star-item__name">{{ item.fullname }}</p>
            </div>
            <div class="star-item__right">
              <p>{{ item.numberofstar }}</p>
              <icon-star class="star__col__icon" style="margin-left: 5px;" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12">
        <div class="star__col">
          <div class="star__col__header">
            <icon-star-dashboard class="star__col__icon" />
            <p class="star__col__title">Top sao cho đi</p>
          </div>
          <div v-for="(item, index) in dataStarOutCome" :key="item.id" class="star-item">
            <div class="star-item__left">
              <icon-star-first v-if="index === 0" class="star__col__icon" />
              <icon-star-second v-if="index === 1" class="star__col__icon" />
              <icon-star-third v-if="index === 2" class="star__col__icon" />
              <p class="star-item__name">{{ item.fullname }}</p>
            </div>
            <div class="star-item__right">
              <p>{{ item.numberofstar }}</p>
              <icon-star class="star__col__icon" style="margin-left: 5px;" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import IconStar from '@/assets/images/admin/star.svg';
import IconStarDashboard from '@/assets/images/dashboard/star-dashboard.svg';
import IconStarFirst from '@/assets/images/dashboard/top-1.svg';
import IconStarSecond from '@/assets/images/dashboard/top-2.svg';
import IconStarThird from '@/assets/images/dashboard/top-3.svg';
@Component<ProgressBarComponent>({
  name: 'ProgressBarComponent',
  components: {
    IconStar,
    IconStarDashboard,
    IconStarFirst,
    IconStarSecond,
    IconStarThird,
  },
})
export default class ProgressBarComponent extends Vue {
  @Prop(Array) readonly dataStarInCome;
  @Prop(Array) readonly dataStarOutCome;
  @Prop(Boolean) readonly loading!: boolean;
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.star {
  margin: $unit-8 0;
  &__col {
    background-color: $white;
    padding: $unit-8;
    border-radius: $unit-1;
    box-shadow: $box-shadow-default;
    &__header {
      font-size: $text-base;
      padding: 0 0 $unit-4;
      display: flex;
      place-content: center;
      box-shadow: inset 0px -1px 0px #dfe3e8;
      border-radius: $border-radius-base $border-radius-base 0px 0px;
    }
    &__icon {
      display: flex;
      align-self: center;
    }
    &__title {
      font-size: $text-base;
      font-weight: $font-weight-medium;
    }
  }
  &__income {
  }
  &__recognition {
  }
}
.star-item {
  display: flex;
  flex-direction: row;
  padding: 0.75rem 0;
  justify-content: space-between;
  &__left {
    display: flex;
    align-self: center;
  }
  &__right {
    display: flex;
    align-self: center;
  }
  &__name {
    display: flex;
    align-self: center;
    font-weight: $font-weight-medium;
    font-size: $text-sm;
  }
}
</style>
