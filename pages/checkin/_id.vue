<template>
  <div v-loading.fullscreen.lock="loading" class="createCheckinPage">
    <el-page-header title="OKRs của tôi" @back="goBack" />
    <h1 class="createCheckinPage__title">Tạo checkin</h1>
    <create-checkin v-if="checkin" :checkin.sync="checkin" :is-new="isNew">
      <chart-okrs v-if="checkin" slot="chartOKRs" :checkin.sync="checkin" />
    </create-checkin>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import CheckinRepository from '@/repositories/CheckinRepository';
import { formatDateToDD, initNewDate } from '@/utils/dateParser';
import { notificationConfig } from '@/constants/app.constant';
@Component({
  name: 'CheckinPage',
  head() {
    return {
      title: 'Tạo Check-in',
    };
  },
  created() {
    this.getCheckin();
  },
})
export default class CheckinPage extends Vue {
  private loading: boolean = false;
  private checkin: any = null;
  private isNew: boolean = false;
  private goBack() {
    this.$router.push('/checkin');
  }

  private async getCheckin() {
    this.loading = true;
    await CheckinRepository.getDetail(+this.$route.params.id)
      .then((res) => {
        if (res.data.data.checkinDetail.length === 0) {
          this.isNew = true;
          res.data.data = Object.assign(res.data.data, {
            confidentLevel: 3,
            status: 'Draft',
            isCompleted: false,
            checkinAt: formatDateToDD(res.data.data.checkin.checkinAt),
            nextCheckinDate: res.data.data.checkin.nextCheckinDate ? formatDateToDD(res.data.data.checkin.nextCheckinDate) : initNewDate(),
          });
          for (let index = 0; index < res.data.data.keyResults.length; index++) {
            res.data.data.checkinDetail.push({
              valueObtained: 0,
              confidentLevel: 2,
              progress: '',
              problems: '',
              plans: '',
              keyResult: {
                id: res.data.data.keyResults[index].id,
                targetValue: res.data.data.keyResults[index].targetValue,
                content: res.data.data.keyResults[index].content,
              },
            });
          }
        } else {
          res.data.data = Object.assign(res.data.data, {
            confidentLevel: res.data.data.checkin.confidentLevel,
            status: res.data.data.checkin.status,
            isCompleted: false,
            checkinAt: formatDateToDD(res.data.data.checkin.checkinAt),
            nextCheckinDate: formatDateToDD(res.data.data.checkin.nextCheckinDate),
          });
        }
        this.checkin = res.data.data;
        this.loading = false;
      })
      .catch((error) => {
        if (error.response.data.statusCode === 470) {
          this.$notify.error({
            ...notificationConfig,
            message: 'Bạn không có quyền truy cập checkin này',
          });
        } else if (error.response.data.statusCode === 404) {
          this.$notify.error({
            ...notificationConfig,
            message: 'Không thể tìm thấy dữ liệu',
          });
        }
        this.$router.push('/checkin');
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.createCheckinPage {
  &__title {
    font-size: $text-2xl;
    padding-bottom: $unit-10;
  }
}
</style>
