<template>
  <a-layout>
    <a-layout-content
    :style="{background : '#fff' , padding:'24px' , margin : 0,minHeight:'280px'}"
    >
      <p>
        <a-form layout="inline" :model="param">
          <a-form-item>
            <a-input v-model:value="param.name" placeholder="请输入关键字">
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleQuery({page: 1, size: pagination.pageSize})">
              查询
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="add()">
              新增
            </a-button>
          </a-form-item>
        </a-form>
      </p>

      <a-table :columns="columns" :data-source="ebooks" :pagination="pagination" @change="handleTableChange">
        <template #headerCell="{ column }">
          <template v-if="column.key === 'cover'">
             封面
          </template>
        </template>
      </a-table>
    </a-layout-content>
    <a-modal
        title="电子书表单"
        v-model:visible="modalVisible"
        :confirm-loading="modalLoading"
        @ok="handleModalOk"
    >
      <a-form :model="ebook" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="封面" >
          <a-input v-model:value="ebook.cover" />
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-model:value="ebook.name" />
        </a-form-item>
        <a-form-item label="分类">
          <a-cascader
              v-model:value="categoryIds"
              :field-names="{ label: 'name', value: 'id', children: 'children' }"
              :options="level1"
          />
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-model:value="ebook.description" type="textarea" />
        </a-form-item>
      </a-form>
    </a-modal>

  </a-layout>

</template>


<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'AdminEbook',
  setup() {
    const param = ref();
    param.value = {};
    const ebooks = ref([]);
    const pagination = ref({
      current: 1,
      pageSize: 5,
      total: 0
    });
    const loading = ref(false);

    const columns = [
      {
        name: '封面',
        dataIndex: 'cover',
        key: 'cover',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '分类一',
        dataIndex: 'category1',
        key: 'category1',
      },
      {
        title: '分类二',
        key: 'category2',
        dataIndex: 'category2',
      },
      {
        title: '文档数',
        key: 'count',
      },
      {
        title: '阅读数',
        key: 'readCount',
      },
      {
        title: '点赞数',
        key: 'goodCont',
      },
      {
        title: '操作',
        key: 'operation',
      },
    ];

    /**
     * 数据查询
     **/
    const handleQuery = (params: any) => {
      loading.value = true;
      // 如果不清空现有数据，则编辑保存重新加载数据后，再点编辑，则列表显示的还是编辑前的数据
      ebooks.value = [];
      axios.get("/eBook/list/", {
        params: {
          page: params.page,
          size: params.size,
          name: param.value.name
        }
      }).then((response) => {
        loading.value = false;
        const data = response.data;
        if (data.success) {
          ebooks.value = data.data.list;

          // 重置分页按钮
          pagination.value.current = params.page ;
          pagination.value.total = data.data.total;


          console.log(pagination.value.total);

          console.log( ebooks.value );
        } else {
          message.error(data.message);
        }
      });
    };

    /**
     * 表格点击页码时触发
     */
    const handleTableChange = (pagination: any) => {
      console.log("看看自带的分页参数都有啥：" + pagination);
      handleQuery({
        page: pagination.current,
        size: pagination.pageSize
      });
    };

    // -------- 表单 ---------
    /**
     * 数组，[100, 101]对应：前端开发 / Vue
     */
    const categoryIds = ref();
    const ebook = ref();
    const modalVisible = ref(false);
    const modalLoading = ref(false);
    const handleModalOk = () => {
      modalLoading.value = true;
      ebook.value.category1Id = categoryIds.value[0];
      ebook.value.category2Id = categoryIds.value[1];
      axios.post("/ebook/save", ebook.value).then((response) => {
        modalLoading.value = false;
        const data = response.data; // data = commonResp
        if (data.success) {
          modalVisible.value = false;

          // 重新加载列表
          handleQuery({
            page: pagination.value.current,
            size: pagination.value.pageSize,
          });
        } else {
          message.error(data.message);
        }
      });
    };

    onMounted(() => {
       handleQuery({
        page:1,
        size:pagination.value.pageSize,

       });
    });

    return {
      param,
      ebooks,
      pagination,
      columns,
      loading,
      handleTableChange,
      handleQuery,

      // edit,
      ebook,
      modalVisible,
      modalLoading,
      handleModalOk,
      categoryIds,

    }
  }
});

</script>



<style scoped>
img {
  width: 50px;
  height: 50px;
}
</style>