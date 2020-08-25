<template>
  <el-dialog
    title="Cập nhật OKRs"
    :visible.sync="syncUpdateDialog"
    width="800px"
    placement="center"
    :before-close="handleCloseDialog"
    class="update-okrs"
  >
    <el-form ref="updateOkrsForm" :model="tempObjective" :rules="rules">
      <el-form-item label="Mục tiêu" prop="title" class="custom-label" label-width="80px">
        <el-input v-model="tempObjective.title" placeholder="Nhập tên OKRs" />
      </el-form-item>
    </el-form>
    <div v-loading="formLoading">
      <krs-form
        v-for="(item, index) in krFormItems"
        :key="index"
        ref="krsForm"
        :index-kr-form="index"
        :key-result.sync="item"
        :is-updating="true"
        @deleteKr="deleteKrForm($event)"
      />
    </div>
    <el-button class="el-button el-button--white el-button--small update-okrs__button" @click="addNewKRs">
      <icon-add-krs />
      <span>Thêm KRs</span>
    </el-button>
    <span slot="footer">
      <el-button class="el-button--white el-button--modal" @click="handleCloseDialog">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" :loading="loading" @click="updateOkrs">Cập nhật</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import IconAddKrs from '@/assets/images/okrs/add-krs.svg';
import { Maps, Rule } from '@/constants/app.type';
import OkrsRepository from '@/repositories/OkrsRepository';
import { notificationConfig, confirmWarningConfig } from '@/constants/app.constant';
import KrsForm from '@/components/okrs/KrsForm.vue';
import { PayloadOkrs } from '@/constants/app.interface';
import { max255Char } from '@/components/account/account.constant';
@Component<UpdateOkrsDialog>({
  name: 'UpdateOkrsDialog',
  components: {
    IconAddKrs,
    KrsForm,
  },
  created() {
    this.krFormItems = this.temporaryOkrs.keyResults;
  },
  beforeMount() {
    this.formLoading = true;
    setTimeout(() => {
      this.formLoading = false;
    }, 500);
  },
})
export default class UpdateOkrsDialog extends Vue {
  @Prop(Function) public reloadData!: Function;
  @PropSync('visibleDialog', { type: Boolean, required: true }) public syncUpdateDialog!: boolean;
  @Prop({ type: Object, required: true }) public temporaryOkrs!: any;

  private tempObjective: any = {
    id: JSON.parse(JSON.stringify(this.temporaryOkrs.id)),
    title: JSON.parse(JSON.stringify(this.temporaryOkrs.title)),
  };

  private loading: boolean = false;
  private formLoading: boolean = false;
  private krFormItems: any[] = [];

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vui lòng nhập tên mục tiêu', trigger: 'blur' }, max255Char],
  };

  private handleDataDialog() {
    this.tempObjective.title = JSON.parse(JSON.stringify(this.temporaryOkrs.title));
    (this.$refs.updateOkrsForm as Form).clearValidate();
    const numberForms = this.krFormItems.length;
    const form = this.$refs.krsForm;
    for (let i = 0; i < numberForms; i++) {
      if (!form[i].syncTempKr.id) {
        this.krFormItems.pop();
      }
      (form[i].$refs.keyResult as Form).clearValidate();
    }
    this.syncUpdateDialog = false;
    this.krFormItems = this.temporaryOkrs.keyResults;
  }

  private handleCloseDialog() {
    this.$confirm('Những thay đổi sẽ không được lưu, bạn có chắc chắn muốn thoát ra ngoài?', { ...confirmWarningConfig }).then(() => {
      this.handleDataDialog();
    });
  }

  private addNewKRs() {
    this.formLoading = true;
    this.krFormItems.push({
      startValue: 0,
      targetValue: 100,
      content: '',
      linkPlans: '',
      linkResults: '',
      measureUnitId: 1,
    });
    setTimeout(() => {
      this.formLoading = false;
    }, 500);
  }

  private deleteKrForm(indexForm: number) {
    this.formLoading = true;
    this.krFormItems.splice(indexForm, 1);
    setTimeout(() => {
      this.formLoading = false;
    }, 300);
  }

  private updateOkrs() {
    const krs: any[] = [];

    this.loading = true;
    if (this.krFormItems.length === 0) {
      setTimeout(() => {
        this.loading = false;
      }, 300);
      this.$message.error('Cần có ít nhất 1 kết quả then chốt');
    } else {
      (this.$refs.updateOkrsForm as Form).validate(async (isValid: boolean) => {
        if (isValid) {
          let validForm: number = 0;
          (this.$refs.krsForm as any).forEach((form) => {
            (form.$refs.keyResult as Form).validate((isValid: boolean, invalidatedFields: object) => {
              if (isValid) {
                validForm++;
              }
            });
            krs.push(Object.freeze(form.syncTempKr));
          });
          if (validForm === krs.length) {
            const payload: PayloadOkrs = {
              objective: this.$store.state.okrs.objective
                ? this.$store.state.okrs.objective
                : Object.assign({}, { id: this.$route.params.id ? +this.$route.params.id : +this.temporaryOkrs.id, title: this.tempObjective.title }),
              keyResult: krs,
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
          } else {
            setTimeout(() => {
              this.loading = false;
            }, 300);
            this.$message.error('Vui lòng nhập đúng các trường yêu cầu');
          }
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        }
      });
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';

.update-okrs {
  &__button {
    margin: $unit-4 0 $unit-4 0;
    &:hover,
    &:focus,
    &:active {
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
  .el-form-item__label {
    color: $neutral-primary-4;
    font-weight: $font-weight-medium;
  }
  .el-dialog__body {
    padding: $unit-5 $unit-5;
  }
}
</style>
