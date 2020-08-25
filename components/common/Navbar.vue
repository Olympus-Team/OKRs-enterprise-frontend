<template>
  <div class="header">
    <div class="header__logo">
      <nuxt-link to="/">
        <img src="@/assets/images/common/logo.png" alt="logo" />
      </nuxt-link>
    </div>
    <div v-if="user" class="header__info side-right">
      <div class="side-right__list">
        <el-dropdown class="side-right__item item" trigger="click">
          <div class="item__wrapper">
            <img :src="user.imageUrl" alt="avatar" class="item__avatar" />
            <div class="item__info info">
              <span class="info__name">
                {{ user.fullName }}
                <i class="el-icon-caret-bottom" />
              </span>
              <span class="info__role">{{ displayRoleName(user) }}</span>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <nuxt-link to="/thong-tin-tai-khoan">
              <el-dropdown-item>
                <div class="item__div">
                  <icon-profile class="item__div--icon" />
                  <span>Thông tin tài khoản</span>
                </div>
              </el-dropdown-item>
            </nuxt-link>
            <nuxt-link v-if="user.role.name === 'ADMIN'" to="/admin/cai-dat">
              <el-dropdown-item>
                <div class="item__div">
                  <icon-setting class="item__div--icon" />
                  <span>Cài đặt công ty</span>
                </div>
              </el-dropdown-item>
            </nuxt-link>
            <nuxt-link v-if="user.role.name === 'HR' || user.role.name === 'ADMIN'" to="/quan-ly/nhan-su">
              <el-dropdown-item>
                <div class="item__div">
                  <icon-hr class="item__div--icon item__div--icon--hr" />
                  <span>Quản lý nhân sự</span>
                </div>
              </el-dropdown-item>
            </nuxt-link>
            <nuxt-link v-if="user.role.name === 'HR' || user.role.name === 'ADMIN'" to="/bai-hoc-okrs">
              <el-dropdown-item>
                <div class="item__div">
                  <icon-lesson class="item__div--icon" />
                  <span>Quản lý bài học OKRs</span>
                </div>
              </el-dropdown-item>
            </nuxt-link>
            <nuxt-link to="/hoc-okrs">
              <el-dropdown-item>
                <div class="item__div">
                  <icon-lesson class="item__div--icon" />
                  <span>Bài học OKRs</span>
                </div>
              </el-dropdown-item>
            </nuxt-link>
            <nuxt-link to="/doi-mat-khau">
              <el-dropdown-item>
                <div class="item__div">
                  <icon-password class="item__div--icon" />
                  <span>Đổi mật khẩu</span>
                </div>
              </el-dropdown-item>
            </nuxt-link>
            <el-dropdown-item divided>
              <div class="item__div" @click="logout()">
                <icon-logout class="item__div--icon" />
                <span>Đăng xuất</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import IconPassword from '@/assets/images/common/navbar/password-key.svg';
import IconLesson from '@/assets/images/common/navbar/lesson-okrs.svg';
import IconLogout from '@/assets/images/common/navbar/logout.svg';
import IconProfile from '@/assets/images/common/navbar/profile.svg';
import IconSetting from '@/assets/images/common/navbar/setting.svg';
import IconHr from '@/assets/images/common/navbar/hr.svg';
import { DispatchAction, GetterState } from '@/constants/app.vuex';
@Component<Navbar>({
  name: 'Navbar',
  components: {
    IconPassword,
    IconLesson,
    IconLogout,
    IconProfile,
    IconSetting,
    IconHr,
  },
  computed: {
    ...mapGetters({
      user: GetterState.USER,
    }),
  },
})
export default class Navbar extends Vue {
  private dialogVisible: boolean = false;
  private changePasswordDialogVisible: boolean = false;
  private show: boolean = true;

  private async logout() {
    await this.$store.dispatch(DispatchAction.CLEAR_AUTH);
    this.$router.push('/login');
  }

  private displayRoleName(user: any) {
    if (user.isLeader && user.role.name !== 'ADMIN' && user.role.name !== 'HR') {
      return 'LEADER';
    }
    return user.role.name;
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 7vh;
  padding: $unit-6 $unit-10 $unit-6 $unit-5;
  background-color: $purple-primary-5;

  @include breakpoint-down(phone) {
    padding: 0 $unit-4;
  }
}

.side-right {
  &__list {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__item {
    .el-icon-message-solid {
      cursor: pointer;
      color: $white;
    }
  }
}
.item {
  height: 100%;
  vertical-align: text-bottom;
  cursor: pointer;
  position: relative;

  &__dot {
    background-color: $red-primary-1;
    width: $unit-2;
    height: $unit-2;
    border-radius: $border-radius-large;
    position: absolute;
    bottom: 80%;
    left: 65%;
  }

  &__div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &--icon {
      display: inline-block;
      width: $unit-6;
      margin-right: $unit-3;
      color: $neutral-primary-2;
      &--hr {
        padding-top: 0;
        padding-left: -1px;
      }
    }
  }

  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    .el-icon-caret-bottom {
      cursor: pointer;
      font-size: $text-xs;
    }
  }

  &__info {
    span {
      display: block;
      color: $white;
      margin-left: $unit-1;
    }
  }

  &__avatar {
    cursor: pointer;
    width: $unit-8;
    height: $unit-8;
    border-radius: $border-radius-large;
  }
}

.info {
  &__name {
    font-size: $text-xs;
    font-weight: $font-weight-base;
  }
  &__role {
    font-size: $text-xs;
    font-weight: $font-weight-light;
  }
}
.el-dropdown-menu__item {
  font-size: $text-sm;
}

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: $purple-primary-0;
  color: $neutral-primary-3;
}

.nuxt-link-exact-active {
  .el-dropdown-menu__item {
    background-color: $purple-primary-0;
  }
}
</style>
