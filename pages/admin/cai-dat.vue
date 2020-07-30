<template>
  <div>
    <admin-slot class="admin">
      <template #top>
        <el-row type="flex" justify="space-between" class="admin__top">
          <el-col :span="17">
            <div class="admin__top__left">
              <el-autocomplete
                v-model="textSearch"
                class="admin__top__left--input"
                prefix-icon="el-icon-search"
                :placeholder="topChange.textPlaceholder"
              ></el-autocomplete>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="admin__top__right">
              <el-button class="el-button--purple el-button--small el-button--invite" icon="el-icon-plus" @click="addNew">
                Thêm mới {{ topChange.buttonName }}
              </el-button>
            </div>
          </el-col>
        </el-row>
      </template>
      <template #tab>
        <el-tabs v-model="currentTab" class="admin__tab" @tab-click="switchTabs(currentTab)">
          <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" :lazy="true" />
          <div class="admin__tab__table">
            <component
              :is="currentTabComponent"
              :table-data="tableData"
              :loading="loading"
              :total="totalItems"
              :page.sync="adminParams.page"
              :limit.sync="adminParams.limit"
            />
          </div>
        </el-tabs>
      </template>
    </admin-slot>
    <new-cycle-okrs-dialog v-if="topChange.tab === 1" :cycle-visible-dialog.sync="cycleVisibleDialog" />
    <new-department-dialog v-if="topChange.tab === 2" :team-visible-dialog.sync="teamVisibleDialog" />
    <new-job-dialog v-if="topChange.tab === 3" :job-visible-dialog.sync="jobVisibleDialog" />
    <new-criteria-dialog v-if="topChange.tab === 4" :criteria-visible-dialog.sync="criteriaVisibleDialog" />
    <new-unit-dialog v-if="topChange.tab === 5" :unit-visible-dialog.sync="unitVisibleDialog" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Context } from '@nuxt/types';
import { pageLimit } from '@/constants/app.constant';
import { AdminTabsVn, AdminTabsEn } from '@/constants/app.enum';
import ManageCycleOkrs from '@/components/admin/CycleOkrs.vue';
import ManageMeasureUnit from '@/components/admin/MeasureUnit.vue';
import ManageDepartment from '@/components/admin/Department.vue';
import ManageEvaluationCriteria from '@/components/admin/EvaluationCriteria.vue';
import ManageJobPosition from '@/components/admin/JobPosition.vue';
import TeamRepository from '@/repositories/TeamRepository';
import CycleRepository from '@/repositories/CycleRepository';
import JobRepository from '@/repositories/JobRepository';
import MeasureUnitRepository from '@/repositories/MeasureUnitRepository';
import EvaluationCriteriaRepository from '@/repositories/EvaluationCriteriaRepository';
import { AdminParams } from '@/constants/app.interface';

@Component<SettingCompanyPage>({
  name: 'SettingCompanyPage',
  created() {
    this.getListData();
  },
  middleware: ['isAdmin'],
})
export default class SettingCompanyPage extends Vue {
  private tableData: any[] = [];
  private metaPagination: object = {};
  private totalItems: number = 1;

  private loading: boolean = false;
  private tabs: string[] = [...Object.values(AdminTabsVn)];
  private textSearch: string = '';
  private cycleVisibleDialog: boolean = false;
  private teamVisibleDialog: boolean = false;
  private jobVisibleDialog: boolean = false;
  private criteriaVisibleDialog: boolean = false;
  private unitVisibleDialog: boolean = false;

  private currentTab: string =
    this.$route.query.tab === AdminTabsEn.MeasureUnit
      ? AdminTabsVn.MeasureUnit
      : this.$route.query.tab === AdminTabsEn.EvaluationCriterial
      ? AdminTabsVn.EvaluationCriterial
      : this.$route.query.tab === AdminTabsEn.JobPosition
      ? AdminTabsVn.JobPosition
      : this.$route.query.tab === AdminTabsEn.Department
      ? AdminTabsVn.Department
      : AdminTabsVn.CycleOKR;

  private adminParams: AdminParams = {
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    limit: pageLimit,
  };

  private switchTabs(currentTab: string) {
    if (currentTab === AdminTabsVn.CycleOKR) {
      this.adminParams.page = 1;
      this.$router.push(`?tab=${AdminTabsEn.CycleOKR}`);
    } else if (currentTab === AdminTabsVn.Department) {
      this.adminParams.page = 1;
      this.$router.push(`?tab=${AdminTabsEn.Department}`);
    } else if (currentTab === AdminTabsVn.JobPosition) {
      this.adminParams.page = 1;
      this.$router.push(`?tab=${AdminTabsEn.JobPosition}`);
    } else if (currentTab === AdminTabsVn.EvaluationCriterial) {
      this.adminParams.page = 1;
      this.$router.push(`?tab=${AdminTabsEn.EvaluationCriterial}`);
    } else {
      this.adminParams.page = 1;
      this.$router.push(`?tab=${AdminTabsEn.MeasureUnit}`);
    }
  }

  private addNew() {
    if (this.topChange.tab === 1) {
      this.cycleVisibleDialog = true;
    } else if (this.topChange.tab === 2) {
      this.teamVisibleDialog = true;
    } else if (this.topChange.tab === 3) {
      this.jobVisibleDialog = true;
    } else if (this.topChange.tab === 4) {
      this.criteriaVisibleDialog = true;
    } else {
      this.unitVisibleDialog = true;
    }
  }

  @Watch('$route.query')
  private async getListData() {
    this.loading = true;
    if (this.$route.query.tab === AdminTabsEn.CycleOKR || this.$route.query.tab === undefined) {
      try {
        const { data } = await CycleRepository.get(this.adminParams);
        this.tableData = data.data.items;
        this.totalItems = data.data.meta.totalItems;
        this.loading = false;
      } catch (error) {
        this.$notify.error({
          title: 'Lỗi',
          message: error.message,
          duration: 2000,
        });
        this.loading = false;
      }
    } else if (this.$route.query.tab === AdminTabsEn.Department) {
      try {
        const { data } = await TeamRepository.get(this.adminParams);
        this.tableData = data.data.items;
        this.totalItems = data.data.meta.totalItems;
        this.loading = false;
      } catch (error) {
        this.$notify.error({
          title: 'Lỗi',
          message: error.message,
          duration: 2000,
        });
        this.loading = false;
      }
    } else if (this.$route.query.tab === AdminTabsEn.JobPosition) {
      try {
        const { data } = await JobRepository.get(this.adminParams);
        this.tableData = data.data.items;
        this.totalItems = data.data.meta.totalItems;
        this.loading = false;
      } catch (error) {
        this.$notify.error({
          title: 'Lỗi',
          message: error.message,
          duration: 2000,
        });
        this.loading = false;
      }
    } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
      try {
        const { data } = await EvaluationCriteriaRepository.get(this.adminParams);
        this.tableData = data.data.items;
        this.totalItems = data.data.meta.totalItems;
        this.loading = false;
      } catch (error) {
        this.$notify.error({
          title: 'Lỗi',
          message: error.message,
          duration: 2000,
        });
        this.loading = false;
      }
    } else {
      try {
        const { data } = await MeasureUnitRepository.get(this.adminParams);
        this.tableData = data.data.items;
        this.totalItems = data.data.meta.totalItems;
        this.loading = false;
      } catch (error) {
        this.$notify.error({
          title: 'Lỗi',
          message: error.message,
          duration: 2000,
        });
        this.loading = false;
      }
    }
  }

  private get currentTabComponent() {
    if (this.$route.query.tab === undefined || this.$route.query.tab === AdminTabsEn.CycleOKR) {
      return ManageCycleOkrs;
    } else if (this.$route.query.tab === AdminTabsEn.Department) {
      return ManageDepartment;
    } else if (this.$route.query.tab === AdminTabsEn.JobPosition) {
      return ManageJobPosition;
    } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
      return ManageEvaluationCriteria;
    } else {
      return ManageMeasureUnit;
    }
  }

  private get topChange() {
    if (this.$route.query.tab === undefined || this.$route.query.tab === AdminTabsEn.CycleOKR) {
      return {
        buttonName: 'chu kỳ',
        textPlaceholder: 'Tìm kiếm chu kỳ',
        tab: 1,
      };
    } else if (this.$route.query.tab === AdminTabsEn.Department) {
      return {
        buttonName: 'phòng ban',
        textPlaceholder: 'Tìm kiếm phòng ban',
        tab: 2,
      };
    } else if (this.$route.query.tab === AdminTabsEn.JobPosition) {
      return {
        buttonName: 'vị trí',
        textPlaceholder: 'Tìm kiếm vị trí công việc',
        tab: 3,
      };
    } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
      return {
        buttonName: 'tiêu chí',
        textPlaceholder: 'Tìm kiếm tiêu chí đánh giá',
        tab: 4,
      };
    } else {
      return {
        buttonName: 'đơn vị',
        textPlaceholder: 'Tìm kiếm đơn vị đo lường',
        tab: 5,
      };
    }
  }
}
</script>
<style lang="ts" scoped></style>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.admin {
  margin-left: $unit-9;
  &__top {
    margin: $unit-8 0 $unit-8 0;
    &__left {
      &--input {
        width: calc(100vw * 5 / 24);
      }
    }
    &__right {
      height: 100%;
    }
  }
  &__tab {
    margin: $unit-4 0 0 0;
    width: 80%;
    &__table {
    }
  }
  .el-button {
    height: 100%;
  }
}
</style>
