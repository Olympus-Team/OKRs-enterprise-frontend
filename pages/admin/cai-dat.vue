<template>
  <div>
    <admin-slot class="admin">
      <template #top>
        <div justify="space-between" class="admin__top">
          <div class="admin__top__left">
            <el-autocomplete
              v-model="textSearch"
              class="admin__top__left--input"
              prefix-icon="el-icon-search"
              :placeholder="topChange.textPlaceholder"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              @select="handleSelectItem"
            ></el-autocomplete>
          </div>
          <div class="admin__top__right">
            <el-button class="el-button--purple el-button--invite" icon="el-icon-plus" @click="addNew">
              Thêm mới {{ topChange.buttonName }}
            </el-button>
          </div>
        </div>
      </template>
      <template #tab>
        <el-tabs v-model="currentTab" class="admin__tab" @tab-click="switchTabs(currentTab)">
          <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" :lazy="true" />
          <div class="admin__tab__table">
            <component
              :is="currentTabComponent"
              :table-data="tableData"
              :reload-data="getListData"
              :loading="loading"
              :total="totalItems"
              :page.sync="adminParams.page"
              :limit.sync="adminParams.limit"
            />
          </div>
        </el-tabs>
      </template>
    </admin-slot>
    <component :is="currentDialogComponent" :visible-dialog.sync="visibleDialog" :reload-data="getListData" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import ManageCycleOkrs from '@/components/admin/CycleOkrs.vue';
import ManageMeasureUnit from '@/components/admin/MeasureUnit.vue';
import ManageDepartment from '@/components/admin/Department.vue';
import ManageEvaluationCriteria from '@/components/admin/EvaluationCriteria.vue';
import ManageJobPosition from '@/components/admin/JobPosition.vue';
import NewCycleOkrsDialog from '@/components/admin/dialog/NewCycleOkrsDialog.vue';
import NewUnitDialog from '@/components/admin/dialog/NewUnitDialog.vue';
import NewDepartmentDialog from '@/components/admin/dialog/NewDepartmentDialog.vue';
import NewCriteriaDialog from '@/components/admin/dialog/NewCriteriaDialog.vue';
import NewJobDialog from '@/components/admin/dialog/NewJobDialog.vue';
import TeamRepository from '@/repositories/TeamRepository';
import CycleRepository from '@/repositories/CycleRepository';
import JobRepository from '@/repositories/JobRepository';
import MeasureUnitRepository from '@/repositories/MeasureUnitRepository';
import EvaluationCriteriaRepository from '@/repositories/EvaluationCriteriaRepository';
import { AdminParams } from '@/constants/app.interface';
import { pageLimit } from '@/constants/app.constant';
import { AdminTabsVn, AdminTabsEn } from '@/constants/app.enum';
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
  private visibleDialog: boolean = false;
  private timeout: any = null;
  private querySearch(queryString: string, callback) {
    const link = this.tableData;
    let results: readonly any[] = queryString ? link.filter(this.createFilter(queryString)) : link;
    results = Object.freeze(results);
    results = results.map((data) => data.name);
    // call callback function to return suggestions
    callback(results);
  }

  private createFilter(queryString: any) {
    return (dataTable: any) => {
      return dataTable.name.toLowerCase().includes(queryString.toLowerCase()) === true;
    };
  }

  private handleSelectItem(item) {
    console.log(item);
  }

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
    this.visibleDialog = true;
  }

  @Watch('$route.query')
  private async getListData() {
    this.loading = true;
    if (this.$route.query.tab === AdminTabsEn.CycleOKR || this.$route.query.tab === undefined) {
      try {
        const { data } = await CycleRepository.get(this.adminParams);
        this.tableData = Object.freeze(data.data.items);
        this.totalItems = data.data.meta.totalItems;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    } else if (this.$route.query.tab === AdminTabsEn.Department) {
      try {
        const { data } = await TeamRepository.get(this.adminParams);
        this.tableData = data.data.items;
        this.totalItems = data.data.meta.totalItems;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    } else if (this.$route.query.tab === AdminTabsEn.JobPosition) {
      try {
        const { data } = await JobRepository.get(this.adminParams);
        this.tableData = data.data.items;
        this.totalItems = data.data.meta.totalItems;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
      try {
        const { data } = await EvaluationCriteriaRepository.get(this.adminParams);
        this.tableData = data.data.items;
        this.totalItems = data.data.meta.totalItems;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    } else {
      try {
        const { data } = await MeasureUnitRepository.get(this.adminParams);
        this.tableData = data.data.items;
        this.totalItems = data.data.meta.totalItems;
        this.loading = false;
      } catch (error) {
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

  private get currentDialogComponent() {
    if (this.topChange.tab === 1) {
      return NewCycleOkrsDialog;
    } else if (this.topChange.tab === 2) {
      return NewDepartmentDialog;
    } else if (this.topChange.tab === 3) {
      return NewJobDialog;
    } else if (this.topChange.tab === 4) {
      return NewCriteriaDialog;
    } else {
      return NewUnitDialog;
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
  &__top {
    display: flex;
    justify-content: space-between;
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
    margin: $unit-8 0;
  }
  .el-button {
    height: 100%;
  }
}
</style>
