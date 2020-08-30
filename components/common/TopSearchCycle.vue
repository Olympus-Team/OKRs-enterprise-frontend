<template>
  <el-row class="top-search-cycle">
    <el-col :xs="8" :sm="8" :md="8" :lg="8">
      <el-select v-if="listCycles.length > 0" v-model="topSearch.cycleId" filterable placeholder="Nhập chu kỳ" no-match-text="Không tìm thấy chu kỳ">
        <el-option v-for="cycle in listCycles" :key="cycle.id" :label="cycle.label" :value="cycle.id" />
      </el-select>
    </el-col>
    <el-col class="top-search-cycle__suggestion" :xs="12" :sm="12" :md="12" :lg="12">
      <el-autocomplete
        v-model="topSearch.textSearch"
        prefix-icon="el-icon-search"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="true"
        placeholder="Tìm kiếm OKRs"
        @select="handleSearchSelect"
      >
        <template v-slot="{ item }">
          <div class="user-suggestion">
            <el-avatar :size="30">
              <img :src="item.avatarURL ? item.avatarURL : item.gravatarURL" alt="avatar" />
            </el-avatar>
            <div class="user-suggestion--info">
              <b class="user-suggestion--info--fullName">{{ item.fullName }}</b>
              <p class="user-suggestion--info--department">{{ getInforUser(item) }}</p>
            </div>
          </div>
        </template>
      </el-autocomplete>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import CycleRepository from '@/repositories/CycleRepository';
import { MutationState } from '@/constants/app.vuex';
import OkrsRepository from '@/repositories/OkrsRepository';
import UserRepository from '@/repositories/UserRepository';
@Component<TopSearchCycle>({
  name: 'TopSearchCycle',
  async created() {
    await this.getListCycle();
  },
  mounted() {
    this.getAllUsers();
  },
})
export default class TopSearchCycle extends Vue {
  private topSearch: any = {
    cycleId: this.$store.state.cycle.cycleTemp,
    textSearch: '' as string,
  };

  private allUsers: any[] = [];
  private listCycles: any[] = [];

  @Watch('topSearch.cycleId', { immediate: false })
  private changeCycleData(cycleId: number) {
    this.$store.commit(MutationState.SET_TEMP_CYCLE, cycleId);
    const userId = this.$store.state.user.tempUser ? this.$store.state.user.tempUser.id : this.$store.state.auth.user.id;
    this.$emit('changeCycleData', userId);
  }

  private querySearch(textQuery: string, callback: any) {
    let results: any[] = [];
    if (textQuery) {
      results = this.allUsers.filter((item) => {
        return item.fullName.toLowerCase().includes(textQuery.toLowerCase());
      });
    } else {
      results = this.allUsers;
    }
    // call callback function to return suggestions
    callback(results);
  }

  private handleSearchSelect(item) {
    this.topSearch.textSearch = item.fullName;
    this.$store.commit(MutationState.SET_TEMP_USER, item);
  }

  private getInforUser(item: any): String {
    if (item.role.name === 'ADMIN') {
      return 'OKRs Master';
    } else if (item.isLeader) {
      return `Trưởng ${item.team.name.toLowerCase()}`;
    } else {
      return `Thành viên ${item.team.name.toLowerCase()}`;
    }
  }

  private async getAllUsers() {
    try {
      await UserRepository.getAllUsers().then((res) => {
        if (res.data.data.length) {
          this.allUsers = Object.freeze(res.data.data);
        }
      });
    } catch (error) {}
  }

  private async getListCycle() {
    if (this.$store.state.cycle.cycles.length) {
      this.listCycles = this.$store.state.cycle.cycles;
    } else {
      try {
        const { data } = await CycleRepository.getMetadata();
        this.listCycles = data.data.all.map((item) => {
          return {
            id: item.id,
            label: item.name,
          };
        });
        this.$store.commit(MutationState.SET_ALL_CYCLES, this.listCycles);
      } catch (error) {}
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.top-search-cycle {
  @include breakpoint-down(phone) {
    display: flex;
    justify-content: space-between;
  }
  &__suggestion {
    margin-left: $unit-4;
  }
  .el-autocomplete {
    width: 100%;
  }
}
.user-suggestion {
  display: flex;
  place-content: center flex-start;
  padding: $unit-2 0 $unit-2 0;
  span {
    align-self: center;
  }
  &--info {
    align-self: center;
    line-height: $unit-5;
    padding-left: $unit-2;
  }
}
</style>
