<template>
  <fragment>
    <base-editor-markdown :post="post" :length="length" />
  </fragment>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LessonRepository from '@/repositories/LessonRepository';
@Component<UpdateLesson>({
  name: 'UpdateLesson',
  head() {
    return {
      title: 'Cập nhật bài học OKRs',
    };
  },
  middleware: 'employeesPage',
  async asyncData({ params }) {
    try {
      const [post, length] = await Promise.all([LessonRepository.getPost(params.slug), LessonRepository.getMetaData()]);
      return {
        post: post.data.data,
        length: length.data.data.length,
      };
    } catch (error) {}
  },
})
export default class UpdateLesson extends Vue {}
</script>
