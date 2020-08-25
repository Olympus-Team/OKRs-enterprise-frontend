<template>
  <el-row v-if="currentTabComponent === 'history'" class="navbar-history">
    <el-col :xs="8" :sm="8" :md="8" :lg="8">
      <el-select v-model.number="cycleId" filterable placeholder="Nhập chu kỳ" no-match-text="Không tìm thấy chu kỳ">
        <el-option v-for="cycle in listCycles" :key="cycle.id" :label="cycle.label" :value="cycle.id" />
      </el-select>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="12">
      <el-autocomplete
        v-model="textSearch"
        prefix-icon="el-icon-search"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="true"
        placeholder="Tìm kiếm CFRs của"
        @select="handleSearchSelect"
      >
        <template v-slot="{ item }">
          <div class="navbar-history__search">
            <el-avatar :size="30">
              <img :src="item.avatarURL ? item.avatarURL : item.gravatarURL" alt="avatar" />
            </el-avatar>
            <div class="navbar-history__search--info">
              <p class="navbar-history__search--info--fullName">{{ item.fullName }}</p>
              <p class="navbar-history__search--info--department">{{ getInforUser(item) }}</p>
            </div>
          </div>
        </template>
      </el-autocomplete>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from 'vue-property-decorator';
import CycleRepository from '@/repositories/CycleRepository';
import { MutationState } from '@/constants/app.vuex';
import UserRepository from '@/repositories/UserRepository';
@Component<NavbarCrfs>({
  name: 'NavbarCrfs',
  created() {
    this.getAllCycles();
  },
  mounted() {
    this.getAllUsers();
  },
  destroyed() {
    this.$store.commit(MutationState.SET_USERS, []);
    this.$store.commit(MutationState.SET_TEMP_USER, null);
  },
})
export default class NavbarCrfs extends Vue {
  @Prop({ required: true, type: String }) private currentTabComponent!: string;

  private textSearch: string = '';
  private allUsers: any[] = [];
  private listCycles: any[] = [];
  private cycleId: number = this.$store.state.cycle.cycle.id;

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

  @Watch('cycleId')
  private handleSelectCycle(cycleId: number) {
    this.$store.commit(MutationState.SET_TEMP_CYCLE, cycleId);
  }

  private handleSearchSelect(item) {
    this.$store.commit(MutationState.SET_TEMP_USER, item);
  }

  private async getAllCycles() {
    // Get 2 years(8 cycles OKRs) ago until now
    if (this.$store.state.cycle.cycles.length) {
      this.listCycles = this.$store.state.cycle.cycles;
      const cycleId = this.listCycles.find((item) => item.label === this.cycleId);
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

  private getInforUser(item: any): String {
    if (item.isLeader) {
      return `Trưởng ${item.team.name}`;
    } else {
      return `Thành viên ${item.team.name}`;
    }
  }

  private async getAllUsers() {
    try {
      await UserRepository.getAllUsers().then((res) => {
        if (res.data.data.length) {
          this.allUsers = Object.freeze(res.data.data);
          this.$store.commit(MutationState.SET_USERS, this.allUsers);
        }
      });
    } catch (error) {}
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/main.scss';
.navbar-history {
  @include breakpoint-down(phone) {
    display: flex;
    justify-content: space-between;
  }
  &__search {
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
  .el-autocomplete {
    width: 100%;
  }
  // .el-autocomplete-suggestion__list {
  //   li {
  //     padding-bottom: $unit-2;
  //     &:last-child {
  //       padding-bottom: 0;
  //     }
  //   }
  // }
}
</style>
