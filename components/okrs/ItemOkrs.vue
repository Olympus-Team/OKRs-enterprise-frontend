<template>
  <div v-if="tableData" class="item-okrs">
    <div :class="['item', indexItem !== 2 ? 'last-item' : null]">
      <p class="item__header">{{ textHeader }}</p>
      <el-table :data="tableData" header-row-class-name="item__table-header" style="width: 100%;">
        <el-table-column v-if="indexItem === 2" width="20" style="display: none;"></el-table-column>
        <el-table-column v-else type="expand" width="20">
          <template v-slot="{ row }">
            <div v-for="objective in row.childObjectives" :key="objective.id" class="item__expand">
              <div class="expand__objective">
                <icon-ellipse />
                <span>{{ objective.title }}</span>
              </div>
              <div class="expand__infor">
                <p v-if="objective.keyResults.length" class="expand__infor--link" @click="emitDrawer(objective.keyResults)">
                  {{ objective.keyResults.length }} kết quả
                </p>
                <p v-else style="width: 200px; color: #212b36;">{{ objective.keyResults.length }} kết quả</p>
                <div class="expand__infor--progress">
                  <el-progress :percentage="+objective.progress" :color="customColors" :text-inside="true" :stroke-width="26" />
                </div>
                <div class="expand__infor--action">
                  <span :class="isUpProgress(changeValue)">{{ changeValue }}%</span>
                  <okrs-action-tooltip
                    class="expand__infor--action__tooltip"
                    :reload-data="reloadData"
                    :editable="editableOkrs(objective.user.id)"
                    :okrs-id.sync="objective.id"
                    :temp-okrs="objective"
                    @updateTempOkrs="updateTempOkrs($event)"
                  />
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Mục tiêu" min-width="500">
          <template v-slot="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Kết quả then chốt" width="200">
          <template v-slot="{ row }">
            <p v-if="row.keyResults.length" class="item__krs" @click="emitDrawer(row.keyResults)">{{ row.keyResults.length }} kết quả</p>
            <p v-else style="color: #212b36;">{{ row.keyResults.length }} kết quả</p>
          </template>
        </el-table-column>
        <el-table-column label="Tiến độ" width="250">
          <template v-slot="{ row }">
            <div class="item__progress">
              <el-progress :percentage="+row.progress" :color="customColors" :text-inside="true" :stroke-width="26" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Thay đổi" width="200">
          <template v-slot="{ row }">
            <div class="item__action">
              <p :class="isUpProgress(row.progress)">{{ row.progress }}%</p>
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
import { customColors } from './okrs.constant';
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
  private changeValue: number = 0;
  private visibleUpdateDialog: boolean = false;
  private visibleAlignDialog: boolean = false;
  private customColors = customColors;

  private emitDrawer(keyResults: any) {
    this.$emit('openDrawer', keyResults);
  }

  private isUpProgress(progress: number): string {
    return progress > 0 ? 'happy' : 'sad';
  }

  private updateTempOkrs({ dialogType, okrs }: DialogTooltipAction) {
    this.tempOkrs = okrs;
    if (dialogType === 1) {
      this.visibleUpdateDialog = true;
    } else {
      this.visibleAlignDialog = true;
    }
  }

  private getProgressKrs(krs: any): number {
    return Math.floor((krs.valueObtained / krs.targetValue) * 100);
  }

  private editableOkrs(userId) {
    return userId === this.$store.state.auth.user.id;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.item-okrs {
  .last-item {
    margin-bottom: $unit-5;
  }
  .happy {
    color: $green-primary-1;
  }
  .sad {
    color: $red-primary-1;
  }
  .item {
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
    &__table-header {
      > th {
        font-weight: $font-weight-medium;
        color: $neutral-primary-4;
        padding-left: $unit-5;
      }
    }
    &__krs {
      color: $blue-primary-2;
      cursor: pointer;
    }
    &__progress {
      width: 250px;
    }
    &__action {
      display: flex;
      place-content: center space-between;
    }

    &__expand {
      display: flex;
      place-content: center space-between;
      padding-bottom: $unit-5;
      &:last-child {
        padding-bottom: 0;
      }
      .expand__objective {
        display: flex;
        place-content: center flex-start;
        align-items: center;
        padding-right: $unit-8;
        span {
          padding-left: $unit-5;
        }
      }
      .expand__infor {
        display: flex;
        &--link {
          width: 200px;
          color: $blue-primary-2;
          cursor: pointer;
        }
        &--progress {
          width: 250px;
        }
        &--action {
          width: 200px;
          margin-right: -$unit-10;
          display: flex;
          align-items: center;
          place-content: center space-between;
          &__tooltip {
            padding-right: 5.25rem;
          }
        }
      }
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
    .el-progress {
      width: 80%;
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
    .el-icon-arrow-right {
      color: $purple-primary-4;
      font-weight: $font-weight-medium;
    }
    .el-table__expanded-cell {
      padding: $unit-5 30px;
    }
  }
}
</style>
