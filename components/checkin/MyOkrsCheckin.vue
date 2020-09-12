<template>
  <fragment>
    <el-table v-loading="loading" empty-text="Không có dữ liệu" class="myOKRs" :data="tableData" style="width: 100%;">
      <el-table-column label="Mục tiêu" min-width="250">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Kết quả then chốt" min-width="150">
        <template slot-scope="{ row }">
          <span class="myOKRs__txtBlue" @click="showKRs(row)">{{ row.keyResults ? row.keyResults.length : 0 }} kết quả</span>
        </template>
      </el-table-column>
      <el-table-column label="Tiến độ" min-width="180">
        <template v-slot="{ row }">
          <el-progress :percentage="row.progress ? row.progress : 0" :color="customColors" :text-inside="true" :stroke-width="26" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Thay đổi" min-width="100">
        <template slot-scope="{ row }">
          <span :style="`color: ${customColorsChanging(row.change)}`">{{ row.change }}%</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Lịch sử" min-width="150">
        <template slot-scope="{ row }">
          <nuxt-link v-if="$route.query.tab === 'checkin-company'" :to="`/checkin/lich-su-cong-ty/${row.id}`">
            <span class="myOKRs__txtBlue">Xem lịch sử</span>
          </nuxt-link>
          <nuxt-link v-else :to="`/checkin/lich-su/${row.id}`">
            <span class="myOKRs__txtBlue">Xem lịch sử</span>
          </nuxt-link>
        </template>
      </el-table-column>
      <el-table-column v-if="$route.query.tab === 'checkin-company'" label="Hành động" align="center" width="180">
        <template slot-scope="{ row }">
          <nuxt-link v-if="row.status === status.OVERDUE" :to="`/checkin/company/${row.id}`">
            <el-button type="danger" class="el-button--checkin">Quá hạn</el-button>
          </nuxt-link>
          <nuxt-link v-else-if="row.status === status.DRAFT" :to="`/checkin/company/${row.id}`">
            <el-button type="warning" class="el-button--checkin">Sửa bản nháp</el-button>
          </nuxt-link>
          <el-button v-else-if="row.status === status.COMPLETED" type="success" disabled class="el-button--checkin">Đã hoàn thành</el-button>
          <nuxt-link v-else :to="`/checkin/company/${row.id}`">
            <el-button class="el-button--purple el-button--checkin">Tạo Checkin</el-button>
          </nuxt-link>
        </template>
      </el-table-column>
      <el-table-column v-else label="Hành động" align="center" width="180">
        <template slot-scope="{ row }">
          <nuxt-link v-if="row.status === status.OVERDUE" :to="`/checkin/${row.id}`">
            <el-button type="danger" class="el-button--checkin">Quá hạn</el-button>
          </nuxt-link>
          <nuxt-link v-else-if="row.status === status.DRAFT" :to="`/checkin/${row.id}`">
            <el-button type="warning" class="el-button--checkin">Sửa bản nháp</el-button>
          </nuxt-link>
          <el-button v-else-if="row.status === status.PENDING" type="info" disabled class="el-button--checkin">Đang chờ duyệt</el-button>
          <el-button v-else-if="row.status === status.COMPLETED" type="success" disabled class="el-button--checkin">Đã hoàn thành</el-button>
          <nuxt-link v-else :to="`/checkin/${row.id}`">
            <el-button class="el-button--purple el-button--checkin">Tạo Checkin</el-button>
          </nuxt-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- show dialog KRs -->
    <el-dialog
      v-if="showDialogKRs"
      :visible.sync="showDialogKRs"
      width="90%"
      placement="bottom-start"
      :title="keyResults.title"
      :before-close="handleCloseDialog"
    >
      <el-row>
        <el-col :span="24">
          <el-table empty-text="Không có dữ liệu" class="myOKRs" :data="keyResults.keyResults" style="width: 100%;">
            <el-table-column label="Kết quả chính" min-width="150">
              <template slot-scope="{ row }">
                <span>{{ row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Mục tiêu" min-width="100">
              <template slot-scope="{ row }">
                <span>{{ row.targetValue }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Đơn vị" min-width="100">
              <template v-slot="{ row }">
                <span>{{ row.measureUnit.type }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Đạt được" min-width="100">
              <template slot-scope="{ row }">
                <span>{{ row.valueObtained }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Tiến độ" min-width="100">
              <template slot-scope="{ row }">
                <span>{{ krschange(row) }} %</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button class="el-button--purple el-button--modal" @click="handleCloseDialog">OK</el-button>
      </span>
    </el-dialog>
    <!-- end dialog KRs -->
  </fragment>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { customColors } from '../okrs/okrs.constant';
import { statusCheckin } from '@/constants/app.constant';

@Component<MyOkrsCheckin>({
  name: 'MyOkrsCheckin',
})
export default class MyOkrsCheckin extends Vue {
  @Prop(Array) readonly tableData!: Array<object>;
  @Prop(Boolean) readonly loading!: boolean;
  private customColors = customColors;
  private status = statusCheckin;
  private keyResults: any = {};
  private showDialogKRs: boolean = false;

  private customColorsChanging(change: number) {
    if (change > 0) {
      return '#27ae60';
    } else {
      return '#eb5757';
    }
  }

  private krschange(row) {
    return (row.valueObtained / row.targetValue) * 100;
  }

  private showKRs(row) {
    this.keyResults = Object.assign({}, row);
    this.showDialogKRs = true;
  }

  private handleCloseDialog() {
    this.showDialogKRs = false;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.myOKRs {
  .el-button {
    &--checkin {
      width: 100%;
    }
  }
  &__txtBlue,
  &__txtBlue:focus {
    color: #337ab7;
    cursor: pointer;

    &:hover {
      color: rgb(32, 160, 255);
    }
  }
  .el-progress {
    .el-progress-bar {
      /* &__innerText {
        color: #606266;
        font-size: 14px;
      } */
      &__outer {
        background-color: $purple-primary-2;
        border-radius: $border-radius-medium;
        .el-progress-bar__inner {
          border-radius: $border-radius-medium;
        }
      }
    }
  }
}
</style>
