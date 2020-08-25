<template>
  <el-row v-if="user" class="sidebar" type="flex" justify="start" align="center">
    <nuxt-link to="/" :class="['sidebar__link', { 'nuxt-link-exact-active': isHome }]">
      <div class="sidebar__link__tab">
        <Dashboard class="sidebar__link__tab__icon" />
        <span>Dashboard</span>
      </div>
    </nuxt-link>
    <nuxt-link to="/checkin" :class="['sidebar__link', { 'nuxt-link-exact-active': isCheckinActive }]">
      <div class="sidebar__link__tab">
        <Checkin class="sidebar__link__tab__icon" />
        <span>Check-in</span>
      </div>
    </nuxt-link>
    <nuxt-link to="/OKRs" :class="['sidebar__link', { 'nuxt-link-exact-active': isOkrsActive }]">
      <div class="sidebar__link__tab">
        <OKRs class="sidebar__link__tab__icon" />
        <span>OKRs</span>
      </div>
    </nuxt-link>
    <nuxt-link to="/CFRs" :class="['sidebar__link', { 'nuxt-link-exact-active': isCfrsActive }]">
      <div class="sidebar__link__tab">
        <CFRs class="sidebar__link__tab__icon" />
        <span>CFRs</span>
      </div>
    </nuxt-link>
    <!-- Start Role Permission action -->
    <nuxt-link v-if="user.role.name === 'ADMIN'" to="/admin/cai-dat" :class="['sidebar__link', { 'nuxt-link-exact-active': isSettingCompanyActive }]">
      <div class="sidebar__link__tab">
        <Setting class="sidebar__link__tab__icon" />
        <p>Cài đặt</p>
        <p>công ty</p>
      </div>
    </nuxt-link>
    <nuxt-link v-if="user.role.name === 'HR'" to="/quan-ly/nhan-su" :class="['sidebar__link', { 'nuxt-link-exact-active': isHRsActive }]">
      <div class="sidebar__link__tab">
        <human-resources class="sidebar__link__tab__icon" />
        <span>Quản lý nhân sự</span>
      </div>
    </nuxt-link>
    <!-- End Role Permission action -->
  </el-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { RootState } from '@/store/auth';
import Dashboard from '@/assets/images/common/sidebar/dashboard.svg';
import CFRs from '@/assets/images/common/sidebar/cfrs.svg';
import Checkin from '@/assets/images/common/sidebar/checkin.svg';
import OKRs from '@/assets/images/common/sidebar/okrs.svg';
import Setting from '@/assets/images/common/sidebar/setting.svg';
import HumanResources from '@/assets/images/common/sidebar/nhan-su.svg';
import { GetterState } from '@/constants/app.vuex';
@Component<SideBar>({
  name: 'SideBar',
  components: {
    Dashboard,
    CFRs,
    Checkin,
    OKRs,
    Setting,
    HumanResources,
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
})
export default class SideBar extends Vue {
  private get isHome() {
    if (this.$route.path === '/' || this.$route.query.cycleId) {
      return true;
    }
  }

  private get isCfrsActive() {
    return !!this.$route.path.startsWith('/CFRs');
  }

  private get isCheckinActive() {
    return !!this.$route.path.startsWith('/checkin');
  }

  private get isOkrsActive() {
    return !!this.$route.path.startsWith('/OKRs');
  }

  private get isSettingCompanyActive() {
    return !!this.$route.path.startsWith('/admin/cai-dat');
  }

  private get isHRsActive() {
    return !!this.$route.path.startsWith('/quan-ly/nhan-su');
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.sidebar {
  flex-direction: column;
  height: 100%;
  font-size: $unit-6;
  color: $purple-primary-2;
  box-shadow: $box-shadow-default;
  background-color: $white;
  position: fixed;
  width: 170px;
  .nuxt-link-exact-active {
    @include sidebar-hover;
  }
  &__link {
    width: 60%;
    align-self: center;
    color: $purple-primary-2;
    padding: $unit-3;
    transition: all 0.2s ease-in-out;
    margin: $unit-4 0 0 0;
    &:hover {
      @include sidebar-hover;
    }
    &__tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      span,
      p {
        font-size: $unit-4;
      }
      &__icon {
        @include size($unit-10, $unit-10);
      }
    }
  }
}
</style>
