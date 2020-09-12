<template>
  <div class="wrap-editor">
    <div class="wrap-editor__form">
      <h1 class="wrap-editor__title">{{ $nuxt.$route.fullPath === '/bai-hoc-okrs/tao-moi' ? 'Thêm mới bài học OKRs' : 'Cập nhật bài học OKRs' }}</h1>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="editorForm" :model="formLesson" label-position="top" style="width: 100%;" :rules="rules">
            <el-form-item label="Tiêu đề:" prop="title" class="custom-label">
              <el-input v-model="formLesson.title" placeholder="Nhập tiêu đề bài viết" />
            </el-form-item>
            <el-form-item label="Nội dung:" prop="content" class="custom-label">
              <vue-simplemde ref="md" v-model="formLesson.content" :configs="config" preview-class="markdown-body" />
            </el-form-item>
            <el-form-item label="Mô tả:" prop="abstract">
              <el-input v-model="formLesson.abstract" type="textarea" :rows="2" placeholder="Nhập mô tả bài viết"></el-input>
            </el-form-item>
            <el-form-item label="Độ ưu tiên" class="custom-label" prop="index">
              <el-select v-model="formLesson.index" class="custom-label">
                <el-option v-for="index in custom" :key="index" :label="index" :value="index" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <div class="wrap-editor__footer">
          <el-button class="el-button--white" @click="handleCancel">Hủy</el-button>
          <el-button class="el-button--purple" :loading="loading" @click="handleSubmit(formLesson)">
            {{ $nuxt.$route.fullPath === '/bai-hoc-okrs/tao-moi' ? 'Tạo bài' : 'Cập nhật' }}
          </el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { notificationConfig } from '@/constants/app.constant';
import { LessonDTO } from '@/constants/app.interface';
import LessonRepository from '@/repositories/LessonRepository';
import { Maps, Rule } from '@/constants/app.type';
@Component<EditorMarkdown>({
  name: 'EditorMarkdown',
})
export default class EditorMarkdown extends Vue {
  @Prop({ default: undefined }) readonly post;
  @Prop(Number) length!: number;

  private loading: boolean = false;

  private rules: Maps<Rule[]> = {
    title: [
      {
        required: true,
        pattern: /^[^-\s]/,
        message: 'Tiêu đề không được bỏ trống',
        trigger: 'blur',
      },
    ],
    content: [
      {
        required: true,
        pattern: /^[^-\s]/,
        message: 'Nội dung không được bỏ trống',
        trigger: 'blur',
      },
    ],
  };

  private formLesson = {
    title: this.post ? this.post.title : '',
    abstract: this.post ? this.post.abstract : '',
    content: this.post ? this.post.content : '',
    index: this.post ? this.post.index : this.custom,
  };

  private get custom() {
    let temp = this.length;
    return this.post ? temp : ++temp;
  }

  private config = {
    autofocus: true,
    spellChecker: false,
    promptURLs: true,
    toolbar: [
      'bold',
      'italic',
      'strikethrough',
      'heading-1',
      'heading-2',
      'heading-3',
      '|',
      'code',
      'quote',
      'unordered-list',
      'ordered-list',
      'table',
      'horizontal-rule',
      'clean-block',
      '|',
      'link',
      'image',
      '|',
      'preview',
      'side-by-side',
      'fullscreen',
      '|',
      'undo',
      'redo',
      '|',
      'guide',
    ],
  };

  private handleSubmit(formLesson: LessonDTO) {
    this.loading = true;
    (this.$refs.editorForm as Form).validate((isValid: boolean, invalidFileds: object) => {
      if (isValid) {
        if (this.$nuxt.$route.fullPath === '/bai-hoc-okrs/tao-moi') {
          this.$confirm(`Bạn có chắc chắn muốn tạo bài viết này?`, {
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            type: 'warning',
          }).then(async () => {
            try {
              await LessonRepository.create(formLesson).then((res: any) => {
                setTimeout(() => {
                  this.loading = false;
                }, 300);
                this.$notify.success({
                  ...notificationConfig,
                  message: 'Tạo bài viết thành công',
                });
                this.$router.push('/bai-hoc-okrs');
              });
            } catch (error) {
              setTimeout(() => {
                this.loading = false;
              }, 300);
            }
          });
        } else {
          this.$confirm(`Bạn có chắc chắn muốn cập nhật bài viết này?`, {
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            type: 'warning',
          }).then(async () => {
            try {
              await LessonRepository.update(formLesson, this.post.id).then((res: any) => {
                setTimeout(() => {
                  this.loading = false;
                }, 300);
                this.$notify.success({
                  ...notificationConfig,
                  message: 'Cập nhật bài viết thành công',
                });
                this.$router.push('/bai-hoc-okrs');
              });
            } catch (error) {
              setTimeout(() => {
                this.loading = false;
              }, 300);
            }
          });
        }
      }
      if (invalidFileds) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
  }

  private handleCancel() {
    this.$router.push('/bai-hoc-okrs');
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.wrap-editor {
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &__form {
    width: 100%;
    margin: $unit-20;
    background-color: $white;
    padding: $unit-10;
  }
  &__footer {
    float: right;
  }
}
</style>
