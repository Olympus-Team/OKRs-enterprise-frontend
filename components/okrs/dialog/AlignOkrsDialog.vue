<template>
  <el-dialog
    title="Cập nhật liên kết mục tiêu"
    :visible.sync="syncAlignDialog"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="align-okrs"
  >
    <div class="align-okrs__form">
      <div v-loading="formLoading" class="align-okrs__form--item">
        <div v-if="listOkrs.length > 0" class="item-parent">
          <p class="item-parent__title">Liên kết OKRs cấp trên</p>
          <el-select
            v-if="listOkrs.length > 0"
            v-model="parentObjectiveId"
            filterable
            no-match-text="Không tìm thấy kết quả"
            placeholder="Chọn OKRs cấp trên"
          >
            <el-option v-for="okrs in listOkrs" :key="okrs.id" :label="okrsLeaderFormat(okrs)" :value="okrs.id" />
          </el-select>
        </div>
        <div class="item-aligned">
          <p class="item-aligned__title">Liên kết chéo</p>
          <div class="item-aligned__items">
            <div class="item-aligned__items--form">
              <step-align-okrs-form
                v-for="(item, index) in itemsAlignOkrs"
                :key="index"
                ref="alignForms"
                :index-align-form="index"
                :align-okrs.sync="item"
                @deleteAlignOkrs="deleteAlignOkrs($event)"
              />
            </div>
            <el-button class="el-button el-button--white el-button--small align-okrs__form--button" @click="addNewAlignOkrs">
              <icon-add-krs />
              <span>Thêm Okrs liên kết chéo</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button :loading="loading" class="el-button--purple el-button--modal" @click="updateAlignOkrs">Cập nhật</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import IconAddKrs from '@/assets/images/okrs/add-krs.svg';
import OkrsRepository from '@/repositories/OkrsRepository';
import { PayloadOkrs } from '@/constants/app.interface';
import { notificationConfig, confirmWarningConfig } from '@/constants/app.constant';
@Component<AlignOkrsDialog>({
  name: 'AlignOkrsDialog',
  components: {
    IconAddKrs,
  },
  created() {
    this.getListOkrs();
    if (this.temporaryOkrs.alignmentObjectives.length) {
      this.itemsAlignOkrs = this.temporaryOkrs.alignmentObjectives.map((item) => {
        return {
          objectiveId: item.id,
        };
      });
    } else {
      this.itemsAlignOkrs = [{ objectiveId: null }];
    }
  },
  beforeMount() {
    this.formLoading = true;
    setTimeout(() => {
      this.formLoading = false;
    }, 500);
  },
})
export default class AlignOkrsDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true }) public syncAlignDialog!: boolean;
  @Prop({ type: Object, required: true }) public temporaryOkrs!: any;

  private itemsAlignOkrs: any = [];
  private loading: boolean = false;
  private formLoading: boolean = false;
  private parentObjectiveId: number | any = this.temporaryOkrs.parentObjectiveId ? this.temporaryOkrs.parentObjectiveId : null;
  private listOkrs: any[] = [];

  private handleDataDialog() {
    const numberForms = this.itemsAlignOkrs.length;
    const form = this.$refs.alignForms;
    for (let i = 0; i < numberForms; i++) {
      if (!form[i].syncAlignOkrs.objectiveId) {
        this.itemsAlignOkrs.pop();
      }
      (form[i].$refs.alignOkrs as Form).clearValidate();
    }
    this.syncAlignDialog = false;
  }

  private addNewAlignOkrs() {
    this.formLoading = true;
    this.itemsAlignOkrs.push({ objectiveId: null });
    setTimeout(() => {
      this.formLoading = false;
    }, 300);
  }

  private handleCloseDialog() {
    this.$confirm('Những thay đổi sẽ không được lưu, bạn có chắc chắn muốn thoát ra ngoài?', { ...confirmWarningConfig }).then(() => {
      this.handleDataDialog();
    });
  }

  private async updateAlignOkrs() {
    const tempAlignOkrs: Set<Number> = new Set();
    // Check validate each forms
    let validForm: number = 0;
    // Check duplicate OKRs ID
    let invalidContent: number = 0;
    this.loading = true;
    (this.$refs.alignForms as any).forEach((form) => {
      (form.$refs.alignOkrs as Form).validate((isValid: boolean, invalidatedFields: object) => {
        if (!isValid) {
          validForm++;
        }
      });
      if (form.syncAlignOkrs.objectiveId !== null) {
        if (!tempAlignOkrs.has(form.syncAlignOkrs.objectiveId)) {
          tempAlignOkrs.add(form.syncAlignOkrs.objectiveId);
        } else {
          invalidContent++;
        }
      }
    });
    // console.log(': -------------------------------------------------');
    // console.log('updateAlignOkrs -> invalidContent', invalidContent);
    // console.log(': -------------------------------------------------');
    if (invalidContent > 0) {
      setTimeout(() => {
        this.loading = false;
      }, 300);
      this.$message.error('Trùng lặp OKRs liên kết chéo, xin vui lòng chọn lại');
    } else if (validForm > 0) {
      setTimeout(() => {
        this.loading = false;
      }, 300);
    } else {
      const payload: PayloadOkrs = {
        objective: Object.assign(
          {},
          { id: +this.temporaryOkrs.id },
          { alignObjectivesId: !tempAlignOkrs.size ? [] : Array.from(tempAlignOkrs) },
          { parentObjectiveId: this.parentObjectiveId },
        ),
      };
      try {
        await OkrsRepository.createOrUpdateOkrs(payload).then((res) => {
          this.loading = false;
          this.handleDataDialog();
          this.reloadData();
          this.$notify.success({
            ...notificationConfig,
            message: 'Cập nhật OKRs thành công',
          });
        });
      } catch (error) {
        this.loading = false;
      }
    }
  }

  private deleteAlignOkrs(indexForm: number) {
    this.formLoading = true;
    this.itemsAlignOkrs.splice(indexForm, 1);
    setTimeout(() => {
      this.formLoading = false;
    }, 300);
  }

  private async getListOkrs() {
    const cycleId = this.$store.state.cycle.cycleTemp ? this.$store.state.cycle.cycleTemp : this.$store.state.cycle.cycle.id;
    if (this.isTeamLeader()) {
      await OkrsRepository.getListOkrs(cycleId, 1).then(({ data }) => {
        this.listOkrs = Object.freeze(data.data);
      });
    } else {
      await OkrsRepository.getListOkrs(cycleId, 2).then(({ data }) => {
        this.listOkrs = Object.freeze(data.data);
      });
    }
  }

  private isTeamLeader(): boolean {
    return this.$store.state.auth.user.isLeader;
  }

  private okrsLeaderFormat(item) {
    return `[${item.user.email}] ${item.title}`;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.align-okrs {
  &__form {
    display: flex;
    flex-direction: row;
    place-content: center space-between;
    padding-bottom: $unit-8;
    &--item {
      width: 100%;
      display: flex;
      flex-direction: column;
      .item-parent {
        margin-bottom: 1rem;
        &__title {
          font-size: $unit-4;
          font-weight: 500;
          margin-bottom: $unit-2;
        }
      }
      .item-aligned {
        &__title {
          font-size: $unit-4;
          font-weight: 500;
          margin-bottom: $unit-2;
        }
        &__items {
          width: 100%;
          display: flex;
          flex-direction: row;
          &--form {
            width: 100%;
          }
        }
      }
    }
    &--button {
      margin-left: $unit-10;
      height: $unit-10;
      &:hover {
        span {
          svg {
            path {
              fill: $white;
            }
          }
        }
      }
      span {
        display: flex;
        place-items: center;
        span {
          padding-left: $unit-1;
        }
      }
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>
