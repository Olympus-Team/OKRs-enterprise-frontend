<template>
  <div>
    <div :class="['item-okrs', indexItem === 2 ? 'last-item-okrs' : null]">
      <p class="item-okrs__header">{{ textHeader }}</p>
      <el-table :data="tableData" header-row-class-name="item-okrs__table-header" style="width: 100%;">
        <el-table-column type="expand" width="20">
          <template v-slot="{ row }">
            <div v-for="objective in row.childObjectives" :key="objective.id" class="item-okrs__expand">
              <div style="display: flex;">
                <div class="item-okrs__expand--objective">
                  <icon-ellipse />
                  <span>{{ objective.title }}</span>
                </div>
                <nuxt-link class="item-okrs__expand--krs" :to="`OKRs/chi-tiet/${objective.id}`">{{ objective.keyResults.length }} kết quả</nuxt-link>
                <div class="item-okrs__expand--progress">
                  <el-progress :percentage="+objective.progress" :color="customColors" :text-inside="true" :stroke-width="26" />
                </div>
              </div>
              <div class="item-okrs__expand--action">
                <span :class="isUpProgress(changeValue, true)">{{ changeValue }}%</span>
                <okrs-action-tooltip
                  :reload-data="reloadData"
                  :editable="editableOkrs(objective.user.id)"
                  :okrs-id.sync="objective.id"
                  :temp-okrs="objective"
                  @updateTempOkrs="updateTempOkrs($event)"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Mục tiêu" width="400">
          <template v-slot="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Kết quả then chốt" width="200">
          <template v-slot="{ row }">
            <nuxt-link class="item-okrs__expand--krs" :to="`OKRs/chi-tiet/${row.id}`">{{ row.keyResults.length }} kết quả</nuxt-link>
          </template>
        </el-table-column>
        <el-table-column label="Tiến độ">
          <template v-slot="{ row }">
            <el-progress :percentage="+row.progress" :color="customColors" :text-inside="true" :stroke-width="26" />
          </template>
        </el-table-column>
        <el-table-column label="Thay đổi" width="200">
          <template v-slot="{ row }">
            <div class="item-okrs--row--change">
              <p :class="isUpProgress(row.progress, false)">{{ row.progress }}%</p>
              <okrs-action-tooltip
                :reload-data="reloadData"
                :editable="editableOkrs(row.user.id)"
                :okrs-id.sync="row.id"
                :temp-okrs="row"
                @updateTempOkrs="updateTempOkrs($event)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <update-okrs-dialog v-if="visibleUpdateDialog" :temporary-okrs="tempOkrs" :visible-dialog.sync="visibleUpdateDialog" :reload-data="reloadData" />
    <align-okrs-dialog v-if="visibleAlignDialog" :temporary-okrs="tempOkrs" :visible-dialog.sync="visibleAlignDialog" :reload-data="reloadData" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import IconEllipse from '@/assets/images/okrs/ellipse.svg';
import { DialogTooltipAction } from '@/constants/app.interface';
@Component<OKRsItem>({
  name: 'OKRsItem',
  components: {
    IconEllipse,
  },
})
export default class OKRsItem extends Vue {
  @Prop(String) private textHeader!: string;
  @Prop(Number) private indexItem!: number;
  @Prop(Array) private tableData!: object[];
  @Prop(Function) private reloadData!: Function;
  private tempOkrs: any = {};
  private visibleUpdateDialog: boolean = false;
  private visibleAlignDialog: boolean = false;
  private changeValue: number = 0;
  private customColors(percentage: number) {
    if (percentage < 30) {
      return '#e3d0ff';
    } else if (percentage < 70) {
      return '#9c6ade';
    } else {
      return '#50248f';
    }
  }

  private isUpProgress(progress: number, isRowExpanded: boolean): string {
    if (isRowExpanded) {
      return progress > 0 ? 'item-okrs__expand--action--happy' : 'item-okrs__expand--action--sad';
    } else {
      return progress > 0 ? 'item-okrs--row--change--happy' : 'item-okrs--row--change--sad';
    }
  }

  private updateTempOkrs({ dialogType, okrs }: DialogTooltipAction) {
    this.tempOkrs = okrs;
    if (dialogType === 1) {
      this.visibleUpdateDialog = true;
    } else {
      this.visibleAlignDialog = true;
    }
  }

  private editableOkrs(userId) {
    return userId === this.$store.state.auth.user.id;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.last-item-okrs {
  margin-bottom: $unit-5;
}
.item-okrs {
  background: $white;
  color: $neutral-primary-4;
  margin-top: $unit-8;
  border-radius: $border-radius-base;
  @include drop-shadow;
  &__header {
    font-size: $text-2xl;
    padding: $unit-5 0 $unit-5 $unit-5;
    @include box-shadow;
    border-radius: $border-radius-base $border-radius-base 0px 0px;
  }
  &--row--change {
    display: flex;
    place-content: center space-between;
    &--happy {
      color: $green-primary-1;
    }
    &--sad {
      color: $red-primary-1;
    }
  }
  &__expand {
    display: flex;
    place-content: center space-between;
    padding-bottom: $unit-5;
    &:last-child {
      padding-bottom: 0;
    }
    &--objective {
      width: 400px;
      display: flex;
      align-items: center;
      padding-right: $unit-8;
      span {
        padding-left: $unit-5;
      }
    }
    &--krs {
      width: 200px;
    }
    &--progress {
      width: calc(100% - (400px + 200px + 150px + 50px));
    }
    &--action {
      width: 200px;
      margin-right: $unit-11;
      display: flex;
      place-content: center space-between;
      &--happy {
        color: $green-primary-1;
      }
      &--sad {
        padding-left: $unit-21;
        color: $red-primary-1;
      }
    }
  }
  &__sub-header {
    padding-top: $unit-6;
    font-size: $text-base;
  }
  &__table-header {
    > th {
      font-weight: $font-weight-medium;
      color: $neutral-primary-4;
      padding-left: $unit-5;
    }
  }
  .el-table {
    .cell {
      white-space: unset;
    }
    border-radius: $border-radius-base;
    .el-table__header-wrapper {
      .el-table__header {
        width: 100% !important;
      }
    }
    .el-table__body-wrapper {
      padding-left: $unit-5;
      .el-table__body {
        width: 100% !important;
        .el-table__row {
          > td {
            &:nth-child(3) {
              .cell {
                color: $blue-primary-2;
              }
            }
            &:nth-child(2) {
              padding-right: $unit-5;
            }
            &:nth-child(5) {
              padding-right: $unit-16;
            }
          }
        }
      }
    }
    .el-progress-bar {
      &__outer {
        background-color: $purple-primary-1;
        border-radius: $border-radius-medium;
        .el-progress-bar__inner {
          border-radius: $border-radius-medium;
        }
      }
    }
    .el-icon-arrow-right {
      color: $purple-primary-4;
      font-weight: $font-weight-medium;
    }
    .el-progress {
      width: $unit-40;
    }
    .el-table__expanded-cell {
      padding: $unit-5 30px;
    }
  }
}
</style>
