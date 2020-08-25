<template>
  <fragment>
    <el-form ref="tempObjective" :model="tempObjective" :rules="rules" class="create-objective" label-position="top">
      <el-form-item prop="title" class="custom-label" label-width="120px">
        <el-input v-model="tempObjective.title" type="textarea" placeholder="Nhập mục tiêu" :autosize="autoSizeConfig"></el-input>
      </el-form-item>
      <div v-loading="loadingSelect" class="create-objective__select">
        <el-form-item prop="cycleId" label="Chu kỳ" class="custom-label" label-width="120px">
          <el-select v-model="tempObjective.cycleId" filterable no-match-text="Không tìm thấy chu kỳ" placeholder="Chọn chu kỳ">
            <el-option v-for="cycle in listCycles" :key="cycle.id" :label="cycle.label" :value="cycle.id" />
          </el-select>
        </el-form-item>
        <!-- OKRs company -->
        <div v-if="isCompanyOkrs" />
        <!-- Select OKrs của các Team Leader -->
        <el-form-item
          v-else-if="!isCompanyOkrs && !isTeamLeader() && this.$store.state.auth.user.role.name !== 'ADMIN'"
          prop="parentObjectiveId"
          label="OKRs cấp trên"
          class="custom-label"
          label-width="120px"
        >
          <el-select v-model="tempObjective.parentObjectiveId" filterable no-match-text="Không tìm thấy kết quả" placeholder="Chọn OKRs cấp trên">
            <el-option v-for="okrs in listOkrs" :key="okrs.id" :label="okrsLeaderFormat(okrs)" :value="okrs.id" />
          </el-select>
        </el-form-item>
        <!-- Select OKrs của công ty -->
        <el-form-item
          v-else-if="(!isCompanyOkrs && isTeamLeader()) || this.$store.state.auth.user.role.name === 'ADMIN'"
          prop="parentObjectiveId"
          label="OKRs công ty"
          class="custom-label"
          label-width="120px"
        >
          <el-select v-model="tempObjective.parentObjectiveId" filterable no-match-text="Không tìm thấy kết quả" placeholder="Chọn OKRs công ty">
            <el-option v-for="okrs in listOkrs" :key="okrs.id" :label="okrs.title" :value="okrs.id" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="okrs-button-action">
      <el-button class="el-button--white el-button--modal" @click="closeObjectiveForm">Hủy</el-button>
      <el-button class="el-button--purple el-button--modal" :loading="loading" @click="nextStepTwo">Tiếp theo</el-button>
    </div>
  </fragment>
</template>

<script lang="ts">
import { Form } from 'element-ui';
import { Component, Vue, PropSync, Watch, Prop } from 'vue-property-decorator';
import { ObjectiveDTO, ParamsQuery } from '@/constants/app.interface';
import { Maps, Rule } from '@/constants/app.type';
import CycleRepository from '@/repositories/CycleRepository';
import OkrsRepository from '@/repositories/OkrsRepository';
import { DispatchAction, MutationState } from '@/constants/app.vuex';
import { max255Char } from '@/components/account/account.constant';

@Component<CreateObjectiveStep>({
  name: 'CreateObjectiveStep',
  created() {
    this.getListCycle();
    if (!this.isCompanyOkrs) {
      if (!this.$store.state.okrs.objective) {
        this.getListOkrs();
      }
    }
  },
  beforeDestroy() {
    this.$store.dispatch(DispatchAction.SET_MEASURE_UNITS);
  },
})
export default class CreateObjectiveStep extends Vue {
  @Prop({ type: Boolean, default: false }) private isCompanyOkrs!: boolean;
  @PropSync('active', Number) private syncActive!: number;
  @PropSync('visibleDialog', Boolean) private syncVisibleDialog!: boolean;

  private loading: boolean = false;
  private loadingSelect: boolean = false;

  public tempObjective: ObjectiveDTO = {
    title: !this.$store.state.okrs.objective ? '' : this.$store.state.okrs.objective.title,
    parentObjectiveId: this.$store.state.okrs.objective ? this.$store.state.okrs.objective.parentObjectiveId : null,
    // Set option cycles to defautl current cycle
    cycleId: this.$store.state.okrs.objective ? this.$store.state.okrs.objective.cycleId : this.$store.state.cycle.cycle.id,
  };

  private listOkrs: any[] = [];
  private listCycles: any[] = [];
  private autoSizeConfig = { minRows: 2, maxRows: 2 };
  private listDataParams: ParamsQuery = {
    page: 1,
    limit: 10,
  };

  private nextStepTwo(): void {
    this.loading = true;
    (this.$refs.tempObjective as Form).validate((isValid: boolean, invalidatedFields: object) => {
      if (isValid) {
        this.$store.commit(MutationState.SET_OBJECTIVE, this.tempObjective);
        this.syncActive++;
        this.loading = false;
      }
      if (invalidatedFields) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }

  private async getListCycle() {
    if (this.$store.state.cycle.cycles.length) {
      this.listCycles = this.$store.state.cycle.cycles;
    } else {
      try {
        const { data } = await CycleRepository.get({ page: 1, limit: 8 });
        this.listCycles = data.data.items.map((item) => {
          return {
            id: item.id,
            label: item.name,
          };
        });
        this.$store.commit(MutationState.SET_ALL_CYCLES, this.listCycles);
      } catch (error) {}
    }
  }

  @Watch('tempObjective.cycleId', { immediate: true })
  private async getListOkrs() {
    if (!this.isCompanyOkrs) {
      this.loadingSelect = true;
      try {
        if (this.tempObjective.cycleId == null) {
          this.tempObjective.cycleId = this.$store.state.cycle.cycle.id;
        }
        let listOkrs: any[] = [];
        if (this.isTeamLeader() || this.$store.state.auth.user.role.name === 'ADMIN') {
          const { data } = await OkrsRepository.getListOkrs(+this.tempObjective.cycleId, 1);
          listOkrs = Object.freeze(data.data);
        } else {
          const { data } = await OkrsRepository.getListOkrs(+this.tempObjective.cycleId, 2);
          listOkrs = Object.freeze(data.data);
        }
        if (this.listOkrs.length > 0) {
          this.listOkrs = [];
        }
        this.listOkrs = listOkrs;
        setTimeout(() => {
          this.loadingSelect = false;
        }, 300);
      } catch (error) {
        setTimeout(() => {
          this.loadingSelect = false;
        }, 300);
      }
    }
  }

  private rules: Maps<Rule[]> = {
    title: [{ type: 'string', required: true, message: 'Vui lòng nhập mục tiêu', trigger: 'blur' }, max255Char],
    cycleId: [{ type: 'number', required: true, message: 'Vui lòng chọn chy kỳ', trigger: 'blur' }],
    parentObjectiveId: [{ type: 'number', required: true, message: 'Vui lòng chọn OKRs cấp trên', trigger: 'blur' }],
  };

  public closeObjectiveForm() {
    (this.$refs.tempObjective as Form).clearValidate();
    this.tempObjective.title = '';
    this.$store.commit(MutationState.SET_OBJECTIVE, null);
    this.tempObjective.parentObjectiveId = null;
    this.syncVisibleDialog = false;
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
.create-objective {
  padding: 0 $unit-5;
  &__select {
    display: flex;
    place-content: center flex-start;
    .el-form-item {
      &:nth-child(2) {
        padding-left: 3rem;
        width: 100%;
        .el-select {
          width: 100%;
        }
      }
    }
  }
  .el-form-item__label {
    padding: 0;
  }
}
.okrs-button-action {
  @include okrs-button-action;
}
</style>
