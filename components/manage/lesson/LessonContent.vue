<template>
  <div class="lesson-content">
    <!-- <el-page-header v-if="prevRoute.path === '/bai-hoc-okrs'" title="Quản lý bài học OKRs" @back="goBack('manage')" />
    <el-page-header v-else title="Bài Học OKRs" @back="goBack('learn')" /> -->
    <slot name="header" />
    <h1 class="lesson-content__title">{{ post.title }}</h1>
    <div class="lesson-content__des">
      <div>
        <img alt="avatar-logo" class="lesson-content__avatar" src="@/assets/images/common/logoflame.png" />
      </div>
      <div class="lesson-content__author">
        <span class="lesson-content__name">Flame OKRs</span>
        <div class="lesson-content__muted">
          <span style="color: #757575;">{{ new Date(post.createdAt) | dateFormat('DD/MM/YYYY') }}</span>
          <img
            src="https://cdn-images-1.medium.com/proxy/1*dMba6LR4dsoQTHzQ5T7oaA.png"
            alt="Member only content"
            width="12"
            height="12"
            class="lesson-content__star"
          />
          <reading-time :content="post.content" />
        </div>
      </div>
    </div>
    <div class="lesson-content__article md-contents markdown-body">
      <div v-html="$md.render(post.content)"></div>
    </div>
    <div class="lesson-content__paginate paginate">
      <div class="paginate__link paginate__link--left">
        <div class="paginate__title">Bài trước</div>
        <nuxt-link v-if="post.preLesson !== null" :to="`${post.preLesson.slug}`" class="paginate__slug">{{ post.preLesson.title }}</nuxt-link>
      </div>
      <div class="paginate__link paginate__link--right">
        <div class="paginate__title">Bài tiếp theo</div>
        <nuxt-link v-if="post.nextLesson !== null" :to="`${post.nextLesson.slug}`" class="paginate__slug">{{ post.nextLesson.title }}</nuxt-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LessonRepository from '@/repositories/LessonRepository';
@Component<LessonContent>({
  name: 'LessonContent',
})
export default class LessonContent extends Vue {
  @Prop(Object) readonly post;
  private loading: boolean = false;
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.lesson-content {
  background-color: $white;
  padding: $unit-4 $unit-6;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: $unit-8 auto;
  max-width: 762px;
  width: 100%;
  min-width: 0;
  &__des {
    align-items: center;
    display: flex;
  }
  &__avatar {
    background-color: #e2e8f0;
    display: block;
    width: 3rem;
    height: 2.5rem;
    border-radius: 100%;
  }
  &__author {
    width: 100%;
    display: block;
    margin-left: 12px;
  }
  &__name {
    flex: 1;
    color: rgba(41, 41, 41, 1);
    font-weight: $font-weight-light;
    max-height: 20px;
    font-size: $text-base;
  }

  &__muted {
    display: flex;
    align-items: center;
    font-size: $text-sm;
    color: #757575;
  }
  &__star {
    width: auto;
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
  }
  &__paginate {
    margin-top: $unit-4;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    @include breakpoint-down(phone) {
      flex-direction: column;
    }
  }
  .paginate {
    border-top: 1px solid #757575;
    &__link {
      max-width: 350px;
      &--right {
        text-align: right;
        @include breakpoint-down(phone) {
          margin-top: $unit-4;
          text-align: left;
        }
      }
    }
    &__title {
      font-size: $text-lg;
      font-style: normal;
      color: #757575;
      color: $black-light;
      font-weight: $font-family-base;
      line-height: 48px;
    }
    &__slug {
      font-size: $text-xl;
      color: $purple-primary-4;
      &:hover {
        color: $purple-primary-3;
      }
    }
  }
}
</style>
