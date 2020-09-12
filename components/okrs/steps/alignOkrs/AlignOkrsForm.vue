<template>
  <div class="align-okrs-form">
    <el-form ref="alignOkrs" :model="syncAlignOkrs" class="align-okrs-form__input">
      <el-form-item prop="objectiveId">
        <el-select v-model.number="syncAlignOkrs.objectiveId" filterable no-match-text="Không tìm thấy kết quả" placeholder="Chọn OKRs liên kết chéo">
          <el-option v-for="item in itemsAlignOkrs" :key="item.id" :label="staffOkrsFormat(item)" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="indexAlignForm !== 0" class="align-okrs-form__delete" @click="deleteAlignOkrs(indexAlignForm)">
      <el-tooltip content="Xóa" placement="right-start">
        <icon-delete />
      </el-tooltip>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import IconDelete from '@/assets/images/common/delete.svg';
import OkrsRepository from '@/repositories/OkrsRepository';
import { Maps, Rule } from '@/constants/app.type';
@Component<InputAlignOkrs>({
  name: 'InputAlignOkrs',
  components: {
    IconDelete,
  },
  mounted() {
    this.itemsAlignOkrs = this.$store.state.okrs.staffOkrs.map((item) => ({ ...item }));
  },
})
export default class InputAlignOkrs extends Vue {
  @PropSync('alignOkrs', {
    type: Object,
    required: true,
    default: () => ({
      objectiveId: null,
    }),
  })
  private syncAlignOkrs!: any;

  @Prop(Number) private indexAlignForm!: number;

  private hovering: boolean = false;
  private itemsAlignOkrs: any[] = [];

  // private rules: Maps<Rule[]> = {
  //   objectiveId: [{ type: 'number', required: true, message: 'Vui lòng chọn OKRs để liên kết', trigger: ['blur', 'change'] }],
  // };

  private deleteAlignOkrs(indexAlignForm: number) {
    this.$emit('deleteAlignOkrs', indexAlignForm);
  }

  private staffOkrsFormat(item) {
    return `[${item.user.email}] ${item.title}`;
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.align-okrs-form {
  display: flex;
  place-content: center space-between;
  &__input {
    width: 100%;
  }
  &__delete {
    &:hover {
      cursor: pointer;
    }
    margin-right: -4.675rem;
    margin-top: $unit-2;
  }
}
</style>
