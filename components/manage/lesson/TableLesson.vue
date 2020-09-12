<template>
  <div class="table-lesson">
    <div class="table-lesson__search search">
      <div class="search__left">
        <el-input v-model="paramsLesson.text" class="search__input" placeholder="Từ khoá tìm kiếm" prefix-icon="el-icon-search" />
        <el-button class="el-button--white el-button--small el-button--search" @click="handleSearch(paramsLesson.text)">Tìm kiếm</el-button>
      </div>
      <div class="search__right">
        <el-button class="el-button--purple el-button--small el-button--create" icon="el-icon-plus" @click="handleCreate">Thêm bài mới</el-button>
      </div>
    </div>
    <el-table v-loading="loading" empty-text="Không có dữ liệu" class="table-lesson__content" :data="tableLesson" style="width: 100%;">
      <el-table-column label="Tiêu đề" min-width="650">
        <template slot-scope="{ row }">
          <span class="table-lesson__title" @click="handleClickTitle(row.slug)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ngày tạo" min-width="150">
        <template slot-scope="{ row }">
          <span>{{ new Date(row.createdAt) | dateFormat('DD/MM/YYYY') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thao tác" align="center">
        <template slot-scope="{ row }">
          <el-tooltip class="table-lesson__icon" content="Sửa" placement="top">
            <i class="el-icon-edit" @click="handleUpdate(row)"></i>
          </el-tooltip>
          <el-tooltip class="table-lesson__icon" content="Xóa" placement="top">
            <i class="el-icon-delete" @click="handleDelete(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <base-pagination
      class="table-lesson__pagination"
      :total="meta.totalItems"
      :page.sync="paramsLesson.page"
      :limit.sync="paramsLesson.limit"
      @pagination="handlePagination"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { notificationConfig, pageLimit } from '@/constants/app.constant';
import { LessonDTO } from '@/constants/app.interface';
import LessonRepository from '@/repositories/LessonRepository';
@Component<TableLesson>({
  name: 'TableLesson',
  created() {
    this.getList();
  },
})
export default class TableLesson extends Vue {
  private loading: boolean = false;
  private paramsLesson = {
    text: this.$route.query.text ? String(this.$route.query.text) : '',
    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
    limit: pageLimit,
  };

  private tableLesson: Array<object> = [];
  private meta: Object = {};

  private handleSearch(text: string) {
    this.paramsLesson.page = 1;
    this.$router.push(`?text=${text}`);
  }

  private handlePagination() {
    this.$route.query.text === undefined
      ? this.$router.push(`?page=${this.paramsLesson.page}`)
      : this.$router.push(`?text=${this.$route.query.text}&page=${this.paramsLesson.page}`);
  }

  private handleCreate() {
    this.$router.push('/bai-hoc-okrs/tao-moi');
  }

  private handleUpdate(row: any) {
    this.$router.push(`/bai-hoc-okrs/cap-nhat/${row.slug}`);
  }

  @Watch('$route.query')
  private async getList() {
    try {
      this.loading = true;
      const tableLesson = await LessonRepository.get(this.paramsLesson);
      this.tableLesson = tableLesson.data.data.items;
      this.meta = tableLesson.data.data.meta;
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }

  private handleClickTitle(slug: string) {
    this.$router.push(`/bai-hoc-okrs/${slug}`);
  }

  private handleDelete(row) {
    this.$confirm('Bạn có chắc chắn muốn xoá bài học này này?', {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
    }).then(async () => {
      try {
        await LessonRepository.delete(row.id).then((res: any) => {
          this.$notify.success({
            ...notificationConfig,
            message: 'Xoá bài viết thành công',
          });
        });
        this.getList();
      } catch (error) {}
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
.table-lesson {
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: $unit-8;
    @include breakpoint-down(phone) {
      flex-direction: column;
      justify-content: start;
      align-items: start;
    }
    &__left {
      display: flex;
    }
    &__input {
      width: $unit-64;
    }
    .el-button {
      &--search {
        margin-left: $unit-3;
        padding-left: $unit-8;
        padding-right: $unit-8;
      }
      &--create {
        padding-top: $unit-3;
        padding-bottom: $unit-3;
        font-size: $text-sm;
        @include breakpoint-down(phone) {
          margin-top: $unit-2;
        }
      }
    }
  }

  &__title {
    cursor: pointer;
    color: $purple-primary-4;
    &:hover {
      color: $purple-primary-3;
    }
  }

  &__pagination {
    margin-top: $unit-8;
  }
  &__icon {
    cursor: pointer;
    margin: 0 $unit-1;
  }
}
</style>
