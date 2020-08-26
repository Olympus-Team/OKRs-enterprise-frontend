<template>
  <el-dialog class="krs-detail" title="Danh sách kết quả then chốt" :visible.sync="syncDetailKrsDialog" width="50%" @close="handleClose">
    <el-table :data="listKrs" header-row-class-name="krs-detail__table-header">
      <el-table-column label="KRs" min-width="300">
        <template v-slot="{ row }">
          <span class="krs-detail__content">{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tiến độ" width="150">
        <template v-slot="{ row }">
          <div class="krs-detail__progress">
            <el-progress style="width: 80%;" :percentage="getProgressKrs(row)" :color="customColors" :text-inside="true" :stroke-width="20" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Link kế hoạch" width="150">
        <template v-slot="{ row }">
          <a class="krs-detail__link" :href="`${row.linkPlans}`" target="_blank">
            {{ row.linkPlans }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="Link kết quả" width="150">
        <template v-slot="{ row }">
          <a class="krs-detail__link" :href="`${row.linkPlans}`" target="_blank">
            {{ row.linkPlans }}
          </a>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { customColors } from '../okrs.constant';
@Component<DetailKrsDialog>({ name: 'DetailKrsDialog' })
export default class DetailKrsDialog extends Vue {
  @PropSync('visibleDetailKrs', { type: Boolean, required: true }) public syncDetailKrsDialog!: boolean;
  @Prop({ type: Array, required: true }) public listKrs!: any[];

  private handleClose() {
    this.syncDetailKrsDialog = false;
  }

  private customColors = customColors;
  private getProgressKrs(krs: any) {
    return Math.floor(krs.valueObtained / krs.targetValue) * 100;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.krs-detail {
  &__header {
    color: $neutral-primary-4;
  }
  &__table-header {
    color: $neutral-primary-4;
    font-size: $unit-4;
  }
  &__content {
    word-break: break-word;
  }
  &__progress {
    width: 150px;
  }
  &__link {
    color: $blue-primary-2;
    @include text-ellipsis(1);
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
  .el-dialog {
    &__header {
      padding: $unit-4 $unit-7;
    }
    &__body {
      padding: 0 $unit-5 $unit-5;
    }
  }
}
</style>
