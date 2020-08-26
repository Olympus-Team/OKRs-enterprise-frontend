<template>
  <el-tooltip class="okrs-tooltip" content="Hành động" placement="right-start" effect="dark">
    <el-popover placement="top" trigger="click">
      <div class="okrs-tooltip__popover">
        <p @click="viewDetailOkrs">Xem chi tiết</p>
        <div v-if="editable">
          <p @click="openUpdateDialog(1)">Cập nhật</p>
          <p v-if="!isRootOkrs" @click="openUpdateDialog(2)">Liên kết</p>
          <p style="color: #e53e3e;" @click="handleDeleteOKrs">Xóa</p>
        </div>
      </div>
      <i slot="reference" class="el-icon-more okrs-tooltip__icon"></i>
    </el-popover>
  </el-tooltip>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';

import IconSetting from '@/assets/images/okrs/setting.svg';
import { confirmWarningConfig, notificationConfig } from '@/constants/app.constant';
import OkrsRepository from '@/repositories/OkrsRepository';
import { DialogTooltipAction } from '@/constants/app.interface';
@Component<OkrsActionTooltip>({
  name: 'OkrsActionTooltip',
  components: {
    IconSetting,
  },
})
export default class OkrsActionTooltip extends Vue {
  @PropSync('okrsId', { type: Number, required: true }) private syncOkrsId!: number;
  @Prop(Object) private tempOkrs!: object;
  @Prop(Function) private reloadData!: Function;
  @Prop(Boolean) private editable!: boolean;
  @Prop({ required: false, type: Boolean }) private isRootOkrs!: boolean;

  private viewDetailOkrs() {
    this.$router.push(`/OKRs/chi-tiet/${this.syncOkrsId}`);
  }

  private openUpdateDialog(dialogType: number) {
    const payload: DialogTooltipAction = { okrs: this.tempOkrs, dialogType };
    this.$emit('updateTempOkrs', payload);
  }

  private handleDeleteOKrs(id: number) {
    this.$confirm('Bạn có chắc chắn muốn xóa mục tiêu này?', {
      ...confirmWarningConfig,
    }).then(async () => {
      try {
        await OkrsRepository.deleteOkrs(+this.syncOkrsId).then((res: any) => {
          this.reloadData();
          this.$notify.success({
            ...notificationConfig,
            message: 'Xóa OKRs thành công',
          });
        });
      } catch (error) {}
    });
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-tooltip {
  margin-left: $unit-10;
  &__popover {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    place-content: center;
    text-align: center;
    p {
      padding: $unit-2;
      border-bottom: 1px solid $purple-primary-1;
      &:last-child {
        border-bottom: unset;
      }
      &:hover {
        background-color: $purple-primary-1;
      }
    }
  }
  &__icon {
    cursor: pointer;
  }
}
.el-popover {
  min-width: 120px !important;
  padding: unset !important;
}
</style>
