<template>
  <div>
    <admin-slot class="admin">
      <template #top>
        <div justify="space-between" class="admin__top">
          <div class="admin__top__left">
            <el-input
              v-model="textSearch"
              class="admin__top__left--input"
              :placeholder="topChange.textPlaceholder"
              prefix-icon="el-icon-search"
              @keyup.enter.native="handleSearch(textSearch)"
            />
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
  head() {
    return {
      title: 'Cài đặt công ty',
    };
  },
  async created() {
    await this.getListData();
  },
  middleware: ['isAdmin'],
})
export default class SettingCompanyPage extends Vue {
  private tableData: any[] = [];
  private metaPagination: object = {};
  private totalItems: number = 1;
  private tabs: string[] = [...Object.values(AdminTabsVn)];
  private textSearch: string = '';
  private visibleDialog: boolean = false;

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
    text: this.$route.query.text ? String(this.$route.query.text) : '',
  };

  private switchTabs(currentTab: string) {
    if (currentTab === AdminTabsVn.CycleOKR) {
      this.adminParams.page = 1;
      this.adminParams.text = '';
      this.textSearch = '';
      this.$router.push(`?tab=${AdminTabsEn.CycleOKR}`);
    } else if (currentTab === AdminTabsVn.Department) {
      this.adminParams.page = 1;
      this.adminParams.text = '';
      this.textSearch = '';
      this.$router.push(`?tab=${AdminTabsEn.Department}`);
    } else if (currentTab === AdminTabsVn.JobPosition) {
      this.adminParams.page = 1;
      this.adminParams.text = '';
      this.textSearch = '';
      this.$router.push(`?tab=${AdminTabsEn.JobPosition}`);
    } else if (currentTab === AdminTabsVn.EvaluationCriterial) {
      this.adminParams.page = 1;
      this.adminParams.text = '';
      this.textSearch = '';
      this.$router.push(`?tab=${AdminTabsEn.EvaluationCriterial}`);
    } else {
      this.adminParams.page = 1;
      this.adminParams.text = '';
      this.textSearch = '';
      this.$router.push(`?tab=${AdminTabsEn.MeasureUnit}`);
    }
  }

  private handleSearch(textSearch: string) {
    this.adminParams.page = 1;
    this.adminParams.text = textSearch;
    if (!this.$route.query.tab) {
      this.$router.push(`?tab=quan-ly-chu-ky&text=${textSearch}`);
    } else {
      this.$router.push(`?tab=${this.$route.query.tab}&text=${textSearch}`);
    }
  }

  private addNew() {
    this.visibleDialog = true;
  }

  @Watch('$route.query', { deep: true })
  private async getListData() {
    this.tableData = [];
    this.currentTab =
      this.$route.query.tab === AdminTabsEn.MeasureUnit
        ? AdminTabsVn.MeasureUnit
        : this.$route.query.tab === AdminTabsEn.EvaluationCriterial
        ? AdminTabsVn.EvaluationCriterial
        : this.$route.query.tab === AdminTabsEn.JobPosition
        ? AdminTabsVn.JobPosition
        : this.$route.query.tab === AdminTabsEn.Department
        ? AdminTabsVn.Department
        : AdminTabsVn.CycleOKR;
    this.adminParams = {
      page: this.$route.query.page ? Number(this.$route.query.page) : 1,
      limit: pageLimit,
      text: this.$route.query.text ? String(this.$route.query.text) : '',
    };
    try {
      if (this.$route.query.tab === AdminTabsEn.CycleOKR || this.$route.query.tab === undefined) {
        await CycleRepository.get(this.adminParams).then((res) => {
          this.tableData = res.data.data.items;
          this.totalItems = res.data.data.meta.totalItems;
        });
      } else if (this.$route.query.tab === AdminTabsEn.Department) {
        await TeamRepository.get(this.adminParams).then((res) => {
          this.tableData = res.data.data.items;
          this.totalItems = res.data.data.meta.totalItems;
        });
      } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
        await EvaluationCriteriaRepository.get(this.adminParams).then((res) => {
          this.tableData = res.data.data.items;
          this.totalItems = res.data.data.meta.totalItems;
        });
      } else if (this.$route.query.tab === AdminTabsEn.JobPosition) {
        await JobRepository.get(this.adminParams).then((res) => {
          this.tableData = res.data.data.items;
          this.totalItems = res.data.data.meta.totalItems;
        });
      } else if (this.$route.query.tab === AdminTabsEn.MeasureUnit) {
        await MeasureUnitRepository.get(this.adminParams).then((res) => {
          this.tableData = res.data.data.items;
          this.totalItems = res.data.data.meta.totalItems;
        });
      }
    } catch (error) {}
  }

  private get currentTabComponent() {
    if (this.$route.query.tab === undefined || this.$route.query.tab === AdminTabsEn.CycleOKR) {
      return ManageCycleOkrs;
    } else if (this.$route.query.tab === AdminTabsEn.Department) {
      return ManageDepartment;
    } else if (this.$route.query.tab === AdminTabsEn.JobPosition) {
      return ManageJobPosition;
    } else if (this.$route.query.tab === AdminTabsEn.MeasureUnit) {
      return ManageMeasureUnit;
    } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
      return ManageEvaluationCriteria;
    }
  }

  private get currentDialogComponent() {
    if (this.topChange!.tab === 1) {
      return NewCycleOkrsDialog;
    } else if (this.topChange!.tab === 2) {
      return NewDepartmentDialog;
    } else if (this.topChange!.tab === 3) {
      return NewJobDialog;
    } else if (this.topChange!.tab === 5) {
      return NewUnitDialog;
    } else if (this.topChange!.tab === 4) {
      return NewCriteriaDialog;
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
    } else if (this.$route.query.tab === AdminTabsEn.MeasureUnit) {
      return {
        buttonName: 'đơn vị',
        textPlaceholder: 'Tìm kiếm đơn vị đo lường',
        tab: 5,
      };
    } else if (this.$route.query.tab === AdminTabsEn.EvaluationCriterial) {
      return {
        buttonName: 'tiêu chí',
        textPlaceholder: 'Tìm kiếm tiêu chí đánh giá',
        tab: 4,
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
