<template>
  <div :id="indexKrForm">
    <div :class="['control-collapse', hovering ? 'hovering' : '']" @mouseenter="hovering = true" @mouseleave="hovering = false">
      <div class="control-collapse__expand" @click="expandForm">
        <span :class="['control-collapse__expand--caret', 'el-icon-caret-right', isExpanded ? 'expanded' : '']" />
        <span v-if="syncTempKr.content.length !== 0" class="control-collapse__expand--content">{{ syncTempKr.content }}</span>
        <span v-if="syncTempKr.content.length === 0" class="control-collapse__expand--content example">Ấn vào đây để chỉnh sửa</span>
      </div>
      <el-popover v-model="popoverVisisble" placement="top-start" width="200" trigger="click">
        <div class="control-collapse__popover">
          <p class="control-collapse__popover--title">Bạn muốn xóa KR này?</p>
          <div class="control-collapse__popover--action">
            <el-button class="el-button--white el-button--small" @click="popoverVisisble = false">Không</el-button>
            <el-button class="el-button--purple el-button--small" @click="deleteKr(keyResult)">Xóa bỏ</el-button>
          </div>
        </div>
        <el-tooltip slot="reference" content="Xóa" placement="right-start">
          <icon-delete class="control-collapse__delete" />
        </el-tooltip>
      </el-popover>
    </div>
    <div :class="['content-collapse', isExpanded ? 'margin-form' : '']" :style="isExpanded ? `max-height: ${scrollHeight}px` : 'max-height: 0'">
      <el-form ref="keyResult" :model="syncTempKr" :rules="rules" label-position="left" class="krs-form">
        <el-form-item prop="content">
          <el-input v-model="syncTempKr.content" placeholder="Nhập kết quả then chốt" tabindex="1" />
        </el-form-item>
        <div class="krs-form__detail">
          <div class="krs-form__detail--value">
            <el-row>
              <el-col :span="7">
                <el-form-item label="Đơn vị" class="custom-label" label-width="65px">
                  <el-select
                    v-model.number="syncTempKr.measureUnitId"
                    size="medium"
                    filterable
                    no-match-text="Không tìm thấy kết quả"
                    placeholder="Chọn đơn vị"
                  >
                    <el-option v-for="unit in units" :key="unit.id" :label="unit.type" :value="unit.id" tabindex="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item class="custom-label krs-form__detail--value--start" prop="startValue" label="Giá trị bắt đầu" label-width="100px">
                  <el-input v-model.number="syncTempKr.startValue" size="medium" tabindex="3" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="targetValue" label="Mục tiêu" class="custom-label" label-width="80px">
                  <el-input v-model.number="syncTempKr.targetValue" size="medium" tabindex="4" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="krs-form__detail--links">
            <el-form-item prop="linkPlans" label="Link kế hoạch" label-width="120px">
              <el-input v-model.number="syncTempKr.linkPlans" size="small" type="url" placeholder="Điền link kế hoạch " />
            </el-form-item>
            <el-form-item prop="linkResults" label="Link kết quả" label-width="120px">
              <el-input v-model.number="syncTempKr.linkResults" size="small" type="url" placeholder="Điền link kết quả" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { max255Char } from '../account/account.constant';
import { Maps, Rule } from '@/constants/app.type';
import IconDelete from '@/assets/images/common/delete.svg';
import OkrsRepository from '@/repositories/OkrsRepository';
import { notificationConfig } from '@/constants/app.constant';

@Component<KrsForm>({
  name: 'KrsForm',
  components: {
    IconDelete,
  },
  created() {
    this.units = Object.freeze(this.$store.state.measureUnit.measureUnits);
  },
})
export default class KrsForm extends Vue {
  @PropSync('keyResult', {
    type: Object,
    required: true,
    default: () => ({
      startValue: 0,
      targetValue: 100,
      content: '',
      linkPlans: '',
      linkResults: '',
      measureUnitId: 1,
    }),
  })
  private syncTempKr!: any;

  @Prop(Number) private indexKrForm!: number;

  private hovering: boolean = false;
  private popoverVisisble: boolean = false;
  private isExpanded: boolean = false;
  private scrollHeight: number = 0;
  private tempContentKr: string = 'Ấn vào đây để chỉnh sửa';

  private units: any[] = [];

  private async deleteKr(keyResult: any) {
    if (keyResult.id) {
      if (this.indexKrForm === 0) {
        this.popoverVisisble = false;
        this.$message.error('Cần có ít nhất 1 kết quả then chốt đã được tạo');
      } else {
        try {
          await OkrsRepository.deleteKr(keyResult.id).then((res) => {
            if (res.data.statusCode === 404) {
              this.$notify.success({
                ...notificationConfig,
                message: res.data.message,
              });
              this.popoverVisisble = false;
            }
            if (res.data.statusCode === 480) {
              this.$notify.success({
                ...notificationConfig,
                message: res.data.message,
              });
              this.popoverVisisble = false;
            }
            if (res.data.statusCode === 200) {
              this.$notify.success({
                ...notificationConfig,
                message: 'Xóa KR thành công',
              });
              this.popoverVisisble = false;
            }
            this.$emit('deleteKr', this.indexKrForm);
          });
        } catch (error) {}
      }
    } else {
      this.popoverVisisble = false;
      this.$emit('deleteKr', this.indexKrForm);
    }
  }

  private rules: Maps<Rule[]> = {
    content: [
      { type: 'string', required: true, message: 'Vui lòng nhập kết quả then chốt', trigger: 'blur' },
      { validator: this.validateContentKrs, trigger: 'blur' },
      max255Char,
    ],
    startValue: [
      { type: 'number', required: true, message: 'Vui lòng nhập giá trị', trigger: 'blur' },
      { validator: this.validateIsValidNumber, trigger: 'blur' },
      { validator: this.validateStartValue, trigger: 'blur' },
    ],
    targetValue: [
      { type: 'number', required: true, message: 'Vui lòng nhập giá trị', trigger: 'blur' },
      { validator: this.validateIsValidNumber, trigger: 'blur' },
      { validator: this.validateTargetValue, trigger: 'blur' },
    ],
    linkPlans: [{ type: 'url', message: 'Vui lòng nhập đúng định dạng đường link', trigger: 'blur' }, max255Char],
    linkResults: [{ type: 'url', message: 'Vui lòng nhập đúng định dạng đường link', trigger: 'blur' }, max255Char],
  };

  private validateIsValidNumber(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (isNaN(value)) {
      return callback('Giá trị phải là số');
    }
    return callback();
  }

  private validateStartValue(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (value < 0) {
      return callback('Giá trị phải là số không âm');
    }
    if (value > this.syncTempKr.targetValue) {
      return callback('Giá trị bắt đầu đang lớn hơn giá trị mục tiêu');
    }
    return callback();
  }

  private validateTargetValue(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (value <= 0) {
      return callback('Giá trị phải lớn hơn 0');
    }
    if (value < this.syncTempKr.startValue) {
      return callback('Giá trị mục tiêu phải lớn hơn bắt đầu');
    }
    return callback();
  }

  private validateContentKrs(rule: any, value: any, callback: (message?: string) => any): (message?: string) => any {
    if (!/\d/.test(value)) {
      return callback('Kết quả then chốt phải chứa số');
    }
    return callback();
  }

  public clearForm() {
    (this.$refs.keyResult as Form).clearValidate();
    this.syncTempKr.content = '';
    this.syncTempKr.targetvalue = 1;
    this.syncTempKr.linkPlans = '';
    this.syncTempKr.linkResults = '';
    this.syncTempKr.measureUnitId = 1;
  }

  private expandForm() {
    this.isExpanded = !this.isExpanded;
    const contents = document.getElementsByClassName('content-collapse');
    // @ts-ignore
    this.scrollHeight = contents.item(0).scrollHeight;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.hovering {
  background-color: $purple-primary-1;
}
.margin-form {
  margin-bottom: $unit-4;
}
.control-collapse {
  display: flex;
  place-content: center space-between;
  &:hover {
    box-shadow: $box-shadow-default;
  }
  &__expand {
    display: flex;
    width: 100%;
    .example {
      color: $neutral-primary-2;
    }
    &:hover {
      cursor: pointer;
    }
    &--caret {
      display: flex;
      align-self: center;
      margin-right: $unit-2;
      color: $neutral-primary-2;
      transition: transform 0.3s ease-in-out;
    }
    &--content {
      word-break: break-word;
      color: $neutral-primary-4;
      font-weight: $font-weight-medium;
      padding-right: $unit-5;
    }
  }
  &__delete {
    &:hover {
      cursor: pointer;
    }
  }
  .expanded {
    transform: rotate(90deg);
  }
  &__popover {
    padding: $unit-2;
    &--title {
      text-align: center;
      padding: $unit-4;
    }
    &--action {
      display: flex;
      place-content: center;
    }
  }
}
.content-collapse {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  background-color: #f1f1f1;
  margin-top: $unit-3;
  &:not(:last-child) {
    margin-bottom: $unit-2;
  }
  border-radius: $border-radius-base;
  background-color: $purple-primary-1;
  .krs-form {
    padding: $unit-4;
    &__detail {
      margin-bottom: -$unit-6;
      &--value {
        &--start {
          label {
            margin-left: -$unit-2;
            width: unset !important;
          }
          .el-form-item__error {
            left: -106px;
            right: -40px;
          }
        }
        .el-col {
          &:not(:first-child) {
            padding-left: $unit-4;
          }
        }
      }
    }
    .el-form-item__label {
      padding: 0;
    }
  }
}
</style>
