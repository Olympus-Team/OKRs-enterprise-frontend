<template>
  <el-drawer v-if="listKrs.length" :visible.sync="syncVisibleDrawer" size="50%" :before-close="handleClose" :show-close="false" class="krs-drawer">
    <h2 slot="title" class="krs-drawer__header">Danh sách kết quả then chốt</h2>
    <el-table :data="listKrs" header-row-class-name="krs-drawer__table-header">
      <el-table-column label="KRs" min-width="300">
        <template v-slot="{ row }">
          <span class="krs-drawer__content">{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tiến độ" width="150">
        <template v-slot="{ row }">
          <div class="krs-drawer__progress">
            <el-progress style="width: 80%;" :percentage="getProgressKrs(row)" :color="customColors" :text-inside="true" :stroke-width="20" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Link kế hoạch" width="150">
        <template v-slot="{ row }">
          <a class="krs-drawer__link" :href="`${row.linkPlans}`" target="_blank">
            {{ row.linkPlans }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="Link kết quả" width="150">
        <template v-slot="{ row }">
          <a class="krs-drawer__link" :href="`${row.linkPlans}`" target="_blank">
            {{ row.linkPlans }}
          </a>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import { customColors } from './okrs.constant';
@Component<OkrsDrawer>({ name: 'OkrsDrawer' })
export default class OkrsDrawer extends Vue {
  @PropSync('visibleDrawer', { type: Boolean, required: true }) public syncVisibleDrawer!: boolean;
  @Prop({ type: Array, required: true }) public listKrs!: any[];

  private handleClose(done: any) {
    this.syncVisibleDrawer = false;
    done();
  }

  private customColors = customColors;
  private getProgressKrs(krs: any) {
    return Math.floor(krs.valueObtained / krs.targetValue) * 100;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.krs-drawer {
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
  .el-drawer {
    &__header {
      padding: $unit-5 $unit-3 0 $unit-3;
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
}
</style>
