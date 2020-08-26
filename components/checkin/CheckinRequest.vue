<template>
  <fragment>
    <slot name="chartOKRs" />
    <div class="checkinDetail">
      <el-form ref="checkinRuleForm" label-position="left" :model="syncCheckin" :rules="rules">
        <el-table empty-text="Không có dữ liệu" class="checkinDetail__form" :data="syncCheckin.checkinDetails" style="width: 100%;">
          <el-table-column label="Kết quả chính" min-width="250">
            <template slot-scope="scope">
              <p>{{ scope.row.keyResult.content }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Mục tiêu" min-width="100">
            <template slot-scope="scope">
              <el-form-item>
                <el-input v-model.number="scope.row.keyResult.targetValue" :readonly="true"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Số đạt được" min-width="150">
            <template v-slot="scope">
              <el-form-item :prop="'checkinDetails.' + scope.$index + '.valueObtained'" :rules="rules.valueObtained">
                <el-input v-model.number="scope.row.valueObtained"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Tiến độ" min-width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'checkinDetails.' + scope.$index + '.progress'" :rules="rules.progress">
                <el-input v-model="scope.row.progress" type="textarea" :rows="4" placeholder="Nhập tiến độ"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Vấn đề" min-width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'checkinDetails.' + scope.$index + '.problems'" :rules="rules.problems">
                <el-input v-model="scope.row.problems" type="textarea" :rows="4" placeholder="Nhập vấn đề"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Kế hoạch" min-width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'checkinDetails.' + scope.$index + '.plans'" :rules="rules.plans">
                <el-input v-model="scope.row.plans" type="textarea" :rows="4" placeholder="Nhập kế hoạch"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="Độ tự tin" min-width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'checkinDetails.' + scope.$index + '.confidentLevel'">
                <el-select v-model="scope.row.confidentLevel" placeholder="Chọn độ tự tin">
                  <el-option v-for="item in dropdownConfident" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <div class="checkinDetail__bottom">
          <el-form-item label-width="40%" label="Chọn mức độ tự tin hoàn thành mục tiêu" :prop="'confidentLevel'">
            <el-radio-group v-model="syncCheckin.confidentLevel">
              <el-radio :label="3">Ổn định</el-radio>
              <el-radio :label="2">Bình thường</el-radio>
              <el-radio :label="1">Không ổn lắm</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row>
            <el-col :sm="24" :lg="12">
              <el-form-item label-width="30%" :prop="'nextCheckinDate'" label="Ngày check-in tiếp theo">
                <el-date-picker
                  v-model="syncCheckin.nextCheckinDate"
                  :clearable="false"
                  type="date"
                  :picker-options="pickerOptions"
                  :format="dateFormat"
                  :value-format="dateFormat"
                  placeholder="Chọn ngày checkin tiếp theo"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="12">
              <el-form-item label-width="30%" :prop="'isCompleted'" label="Hoàn thành OKRs">
                <el-checkbox v-model="syncCheckin.isCompleted"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="checkinDetail__footer">
      <el-button class="el-button--white" @click="handleBack">Quay lại</el-button>
      <el-button class="el-button--purple" :loading="loading" @click="handleSubmitCheckin">Check-in xong</el-button>
    </div>
  </fragment>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';
import { Form } from 'element-ui';
import CheckinRepository from '@/repositories/CheckinRepository';
import { statusCheckin, confidentLevel, notificationConfig } from '@/constants/app.constant';
import { formatDateToYYYY, formatDateToDD } from '@/utils/dateParser';
import { Maps, Rule } from '@/constants/app.type';
@Component<DetailHistory>({
  name: 'DetailHistory',
})
export default class DetailHistory extends Vue {
  @PropSync('checkin', { type: Object }) syncCheckin!: any;
  private tempCheckin: any;
  private status = statusCheckin;
  private dateFormat: string = 'dd/MM/yyyy';
  private dropdownConfident = confidentLevel;
  private loading: boolean = false;

  private customColors(confident) {
    return confident === 1 ? '#DE3618' : confident === 2 ? '#47C1BF' : '#50B83C';
  }

  private checkNumber = (rule, value, callback) => {
    if (!Number.isInteger(value)) {
      return callback(new Error('Phải là số nguyên dương'));
    } else if (value < 0) {
      callback(new Error('Không được nhỏ hơn 0'));
    } else {
      callback();
    }
  };

  private validateDate = (rule, value, callback) => {
    console.log(value);
    if (value < formatDateToDD(new Date())) {
      return callback(new Error('Không được nhỏ hơn ngày hiện tại'));
    } else {
      callback();
    }
  };

  private checkText = (rule, value, callback) => {
    const valid: boolean = /^[^-\s]/.test(value);
    if (!valid) {
      return callback(new Error('Không được bỏ trống'));
    } else {
      callback();
    }
  };

  private pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() <= Date.now();
    },
  };

  private rules: Maps<Rule[]> = {
    valueObtained: [{ validator: this.checkNumber, trigger: ['change', 'blur'] }],
    progress: [
      {
        required: true,
        message: 'Không được bỏ trống',
        trigger: ['blur', 'change'],
      },
      { validator: this.checkText, trigger: ['change', 'blur'] },
    ],
    problems: [
      {
        required: true,
        message: 'Không được bỏ trống',
        trigger: ['blur', 'change'],
      },
      { validator: this.checkText, trigger: ['change', 'blur'] },
    ],
    plans: [
      {
        required: true,
        message: 'Không được bỏ trống',
        trigger: ['blur', 'change'],
      },
      { validator: this.checkText, trigger: ['change', 'blur'] },
    ],
    nextCheckinDate: [{ validator: this.validateDate, trigger: ['change', 'blur'] }],
  };

  private handleBack() {
    this.$router.push('/checkin?tab=request-checkin');
  }

  private handleSubmitCheckin() {
    const tempCheckin: any = {
      checkin: {
        confidentLevel: this.syncCheckin.confidentLevel,
        objectiveId: this.syncCheckin.objective.id,
        isCompleted: this.syncCheckin.isCompleted,
        nextCheckinDate: formatDateToYYYY(this.syncCheckin.nextCheckinDate),
      },
      checkinDetails: [],
    };
    this.loading = true;
    (this.$refs.checkinRuleForm as Form).validate((isValid: boolean, invalidFields: object) => {
      if (isValid) {
        this.syncCheckin.checkinDetails.map((item) => {
          tempCheckin.checkinDetails.push({
            id: item.id,
            targetValue: item.keyResult.targetValue,
            valueObtained: item.valueObtained,
            confidentLevel: item.confidentLevel,
            progress: item.progress,
            problems: item.problems,
            plans: item.plans,
            keyResultId: item.keyResult.id,
          });
        });
        this.$confirm(`Bạn có chắc chắn muốn check-in?`, {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy bỏ',
          type: 'warning',
        }).then(async () => {
          try {
            await CheckinRepository.leaderUpdateCheckin(tempCheckin, this.syncCheckin.id).then((res: any) => {
              setTimeout(() => {
                this.loading = false;
              }, 300);
              this.$notify.success({
                ...notificationConfig,
                message: 'Checkin thành công',
              });
              this.$router.push('/checkin?tab=request-checkin');
            });
          } catch (error) {
            setTimeout(() => {
              this.loading = false;
            }, 300);
            if (error.response.data.statusCode === 475) {
              this.$notify.error({
                ...notificationConfig,
                message: 'Bạn chỉ có thể checkin những form mà member gửi lên',
              });
            }
            this.$router.push('/checkin?tab=request-checkin');
          }
        });
      }
      if (invalidFields) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.checkinDetail {
  &__form {
    background-color: $white;
  }
  &__bottom {
    margin-top: $unit-4;
    padding: $unit-6;
    background-color: $white;
  }
  &__footer {
    margin-top: $unit-4;
    margin-bottom: $unit-4;
    float: right;
  }
}
</style>
