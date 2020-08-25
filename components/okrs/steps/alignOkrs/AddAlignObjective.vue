<template>
  <div :class="['okrs-align', displayForm ? '' : 'confirm-button']">
    <div v-if="displayForm === false" class="okrs-align__confirm">
      <el-button class="el-button el-button--white el-button--medium" :loading="loading" @click="createOkrs(false)">
        Bỏ qua liên kết và tạo OKRs
      </el-button>
      <el-button class="el-button el-button--purple el-button--medium" :loading="loading" @click="displayForm = !displayForm">
        Liên kết mục tiêu
      </el-button>
    </div>
    <div v-else>
      <div class="okrs-align__content">
        <div v-loading="formLoading" class="okrs-align__content--item">
          <step-align-okrs-form
            v-for="(item, index) in itemsAlignOkrs"
            :key="index"
            ref="alignForm"
            :index-align-form="index"
            :align-okrs.sync="item"
            @deleteAlignOkrs="deleteAlignOkrs($event)"
          />
        </div>
        <el-button class="el-button el-button--white el-button--small okrs-align__content--button" @click="addNewAlignOkrs">
          <icon-add-krs />
          <span>Thêm Okrs liên kết chéo</span>
        </el-button>
      </div>
      <div class="okrs-align__action">
        <el-button class="el-button--white el-button--modal" @click="backToStepTwo">Quay lại</el-button>
        <el-button class="el-button--purple el-button--modal" :loading="loading" @click="createOkrs(true)">Tạo OKRs</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Form } from 'element-ui';
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import InputAlignOkrs from './InputAlignKrs.vue';
import IconAddKrs from '@/assets/images/okrs/add-krs.svg';
import CycleRepository from '@/repositories/CycleRepository';
import OkrsRepository from '@/repositories/OkrsRepository';
import { DispatchAction, MutationState } from '@/constants/app.vuex';
import { confirmWarningConfig, notificationConfig } from '@/constants/app.constant';
import { PayloadOkrs } from '@/constants/app.interface';

@Component<AddAlignObjeciveStep>({
  name: 'AddAlignObjeciveStep',
  components: {
    IconAddKrs,
  },
  beforeCreate() {
    this.$store.dispatch(DispatchAction.SET_STAFF_OKRS, { cycleId: this.$store.state.cycle.cycle.id, type: 3 });
  },
})
export default class AddAlignObjeciveStep extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('active', Number) private syncActive!: number;
  @PropSync('visibleDialog', Boolean) private syncVisibleDialog!: boolean;

  private displayForm: boolean = false;
  private loading: boolean = false;
  private itemsAlignOkrs: any[] = [{ objectiveId: null }];

  private formLoading: boolean = false;

  private addNewAlignOkrs() {
    this.formLoading = true;
    this.itemsAlignOkrs.push({ objectiveId: null });
    setTimeout(() => {
      this.formLoading = false;
    }, 300);
  }

  private async createOkrs(isAlignOkrs: boolean) {
    const payload: PayloadOkrs = {
      objective: Object.assign({}, this.$store.state.okrs.objective),
      keyResult: this.$store.state.okrs.keyResults,
    };
    this.loading = true;
    if (isAlignOkrs === true) {
      let validForm: number = 0;
      const alignObjectives: any[] = [];
      (this.$refs.alignForm as any).forEach((form) => {
        (form.$refs.alignOkrs as Form).validate((isValid: boolean, invalidatedFields: object) => {
          if (isValid) {
            validForm++;
          }
        });
        alignObjectives.push(form.syncAlignOkrs.objectiveId);
      });
      if (validForm === alignObjectives.length) {
        // add align OKRs ID
        payload.objective.alignObjectivesId = alignObjectives;
        console.log(payload);
        try {
          await OkrsRepository.createOrUpdateOkrs(payload).then((res) => {
            this.$store.dispatch(DispatchAction.CLEAR_OKRS);
            this.syncActive = 0;
            this.syncVisibleDialog = false;
            this.reloadData();
            this.$notify.success({
              ...notificationConfig,
              message: 'Tạo OKRs thành công',
            });
          });
        } catch (error) {}
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    } else {
      try {
        await OkrsRepository.createOrUpdateOkrs(payload).then((res) => {
          this.loading = true;
          this.$store.dispatch(DispatchAction.CLEAR_OKRS);
          this.syncActive = 0;
          this.syncVisibleDialog = false;
          this.reloadData();
          this.$notify.success({
            ...notificationConfig,
            message: 'Tạo OKRs thành công',
          });
        });
      } catch (error) {
        this.loading = true;
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

  private backToStepTwo() {
    this.syncActive--;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.okrs-align {
  padding: 0 $unit-6 0 $unit-14;
  &__confirm {
    padding: $unit-16;
    background-color: $neutral-primary-0;
    display: flex;
    place-content: center;
  }
  &__content {
    display: flex;
    flex-direction: row;
    place-content: center space-between;
    padding-bottom: $unit-8;
    .el-select {
      width: 100%;
    }
    &--item {
      width: 70%;
      display: flex;
      flex-direction: column;
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
  }
  &__action {
    @include okrs-button-action;
    width: 800px;
    margin-left: -$unit-14;
  }
}
.confirm-button {
  padding: 0 $unit-6 0 $unit-6;
  margin-bottom: $unit-8;
}
</style>
