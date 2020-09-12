<template>
  <lesson-content :post="post">
    <el-page-header slot="header" title="Quản lý bài học OKRs" @back="goBack()" />
  </lesson-content>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LessonRepository from '@/repositories/LessonRepository';
@Component<ManageLessonDetail>({
  name: 'ManageLessonDetail',
  head() {
    return {
      title: 'Chi tiết bài học OKRs',
    };
  },
  watchQuery: ['page'],
  async asyncData({ params }) {
    try {
      const response = await LessonRepository.getPost(params.slug);
      return {
        post: response.data.data,
      };
    } catch (error) {}
  },
})
export default class ManageLessonDetail extends Vue {
  private prevRoute: any = null;
  private goBack() {
    this.$router.push('/bai-hoc-okrs');
  }
}
</script>
