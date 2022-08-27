<template>
  <a-layout>
    <a-layout-content
        :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
    >
      <a-row>
        <a-col :span="6">
          <p>
            <a-form layout="inline" :model="param">
              <a-form-item>
                <a-input v-model:value="param.name" placeholder="名称" size="large">
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="handleQuery()" size="large">
                  查询
                </a-button>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="add()" size="large">
                  新增
                </a-button>
              </a-form-item>
            </a-form>
          </p>

          <a-table
              :columns="columns"
              :row-key="record => record.id"
              :data-source="level1"
              :loading="loading"
              @change="handleTableChange"
              :pagination="false"
              size="small"
              :defaultExpandAllRows="true"
          >
            <template #cover="{ text: cover }">
              <img v-if="cover" :src="cover" alt="avatar" />
            </template>

            <template v-slot:action="{ text : record }">
              <a-space size="small">
                <a-button type="primary" @click="edit(record)">
                  编辑
                </a-button>
                <a-popconfirm
                    title="删除后不可恢复，确认删除?"
                    ok-text="是"
                    cancel-text="否"
                    @confirm="handleDelete(record.id)"
                >
                  <a-button type="danger" >
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>


        </a-col>
        <a-col :span="18">
          <a-form :model="doc" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item >
              <a-button type="primary" @click="handleModalOk"  class="button">
                保存
              </a-button>
            </a-form-item>
            <a-form-item label="名称">
              <a-input v-model:value="doc.name" />
            </a-form-item>
            <a-form-item label="父文档">
              <a-tree-select
                  v-model:value="doc.parent"
                  tree-data-simple-mode
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="treeSelectData"
                  placeholder=" 请选择父文档"
                  :load-data="onLoadData"
                  :replaceFields="{title : 'name' , key : 'id' , value : 'id'}"
              />

            </a-form-item>

            <a-form-item label="顺序">
              <a-input v-model:value="doc.sort" />
            </a-form-item>


            <a-form-item label="编辑内容">
              <div id="content"></div>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>



  <a-modal
      title="文档表单"
      v-model:visible="addEbookVisable"
      :confirm-loading="modalLoading"
      @ok="handleModalAdd"
  >
    <a-form :model="docAdd" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="名称">
        <a-input v-model:value="docAdd.name" />
      </a-form-item>
      <a-form-item label="父文档">
        <a-select ref="select" v-model:value="docAdd.parent">
          <a-select-option value="0">无</a-select-option>
          <a-select-option v-for="c in level1" :key="c.id" :value="c.id">
                  {{c.name}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="顺序">
        <a-input v-model:value="docAdd.sort" />
      </a-form-item>

      <a-form-item label="编辑内容">
        <div id="content1"></div>
      </a-form-item>
    </a-form>
  </a-modal>

<!--  <a-modal-->
<!--      title="文档表单"-->
<!--      v-model:visible="modalVisible"-->
<!--      :confirm-loading="modalLoading"-->
<!--      @ok="handleModalOk"-->
<!--  >-->
<!--   -->
<!--  </a-modal>-->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import {Tool} from '@/assets/ts/tool'
import {useRoute} from "vue-router";
const level1 = ref();
const param = ref();
param.value = {};
const docs = ref([]);
const loading = ref(false);
import E from 'wangeditor'
export default defineComponent({
  name: 'AdminDoc',
  setup() {


    const columns = [
      {
        title: '名称',
        dataIndex: 'name'
      },
      {
        title: "博客名称",
        dataIndex: 'ebookId'
      },
      // {
      //   title: '父文档',
      //   dataIndex: 'parent',
      //   key: 'parent'
      // },
      // {
      //   title: '顺序',
      //   dataIndex: 'sort',
      //   key: 'sort'
      // },
      {
        title: 'Action',
        key: 'action',
        slots: { customRender: 'action' }
      }
    ];

    /**
     * 数据查询
     **/
    const route = useRoute();
    const editor = new E("#content");
    const editor1 = new E("#content1");
    editor.config.zIndex=0;
    editor1.config.zIndex = 0;
    const handleQuery = (params: any) => {
      loading.value = true;
      // 如果不清空现有数据，则编辑保存重新加载数据后，再点编辑，则列表显示的还是编辑前的数据
      docs.value = [];
      axios.get("/doc/selectAll/").then((resp) => {
        loading.value = false;
        const data = resp.data;
        if (data.success) {
          docs.value = data.data;
          level1.value = [];
           level1.value = Tool.array2Tree(docs.value,0);
          treeSelectData.value = Tool.copy(level1.value) || [];
          // 为选择树添加一个"无"
          treeSelectData.value.unshift({id: 0, name: '无'});
        } else {
          message.error(data.message);
        }
      });
    };

    const handleQueryContent = (params: any) => {
      axios.get("/doc/findContent/" + doc.value.id).then((resp) => {
        const data = resp.data;
        if (data.success) {
          console.log(resp);
          editor.txt.html(data.data)
        } else {
          message.error(data.message);
        }
      });
    };




    const docIds = ref();
    const doc = ref();
    const docAdd = ref();
    const addEbookVisable = ref(false);
    const modalVisible = ref(false);
    const modalLoading = ref(false);
    doc.value = {
      ebookId: route.query.ebookId
    };
    const handleModalOk = () => {
      modalLoading.value = true;
      doc.value.content =  editor.txt.html();
      axios.put("/doc/update/", doc.value).then((response) => {
        modalLoading.value = false;
        const data = response.data; // data = commonResp
        if (data.success) {
          modalVisible.value = false;

          // 重新加载列表
          handleQuery({});
        } else {
          message.error(data.message);
        }
      });
    };


    const handleModalAdd = () => {
      modalLoading.value = true;
      docAdd.value.content =  editor1.txt.html();
      axios.post("/doc/save/", docAdd.value).then((response) => {
        modalLoading.value = false;
        const data = response.data; // data = commonResp
        if (data.success) {
          console.log(response);
          addEbookVisable.value = false;

          // 重新加载列表
          handleQuery({});
        } else {
          message.error(data.message);
        }
      });
    };
    const deleteIds: Array<string> = [];
    const deleteNames: Array<string> = [];



    const handleDelete = (id: number) => {
      getDeleteIds(level1.value,id);
      console.log("level1")
      console.log( level1.value)
      console.log(deleteIds);
      axios.delete("/doc/delete/" + deleteIds.join(",")).then((response) => {
        const data = response.data; // data = commonResp
        if (data.success) {
          // 重新加载列表
          handleQuery({
          });
          message.success("删除成功");
        } else {
          message.error(data.message);
        }
      });
    };
    /**
     * 查找整根树枝
     */
    const getDeleteIds = (treeSelectData: any, id: any) => {
      // console.log(treeSelectData, id);
      // 遍历数组，即遍历某一层节点\
      console.log("delet 数组长度"  + treeSelectData.length)
      console.log(treeSelectData);
      for (let i = 0; i < treeSelectData.length; i++) {
        const node = treeSelectData[i];
        if (node.id === id) {
          // 如果当前节点就是目标节点
          console.log("delete", node);
          // 将目标ID放入结果集ids
          // node.disabled = true;
          deleteIds.push(id);
          console.log("ids" + deleteIds)
          deleteNames.push(node.name);

          // 遍历所有子节点
          const children = node.children;
          if (Tool.isNotEmpty(children)) {
            for (let j = 0; j < children.length; j++) {
              getDeleteIds(children, children[j].id)
            }
          }
        } else {
          console.log("delete", node);
          // 如果当前节点不是目标节点，则到其子节点再找找看。
          const children = node.children;
          if (Tool.isNotEmpty(children)) {
            getDeleteIds(children, id);
          }
        }
      }
    };
    let treeSelectData = ref();
    treeSelectData.value = [];
    const setDisable = (treeSelectData : any , id : any) => {
        for (let i = 0 ; i < treeSelectData.length; i ++) {
            const node = treeSelectData[i];
            if (node.id === id) {
              node.disabled = true;
              const  children = node.children;
              if (Tool.isNotEmpty(children)) {
                for (let j = 0 ; j < children.length ; j ++) {
                  setDisable(children,children[j].id);
                }
              }
            }else {
              const children = node.children;
              if (Tool.isNotEmpty(children))
              setDisable(children,id);
            }
        }
    }
    //dfs

    /**
     * 编辑
     */

    onMounted(() => {
      handleQuery({});
      editor.create();

    });
    const edit = (record: any) => {
``
      // 清空富文本框
      modalVisible.value = true;
      doc.value = Tool.copy(record);


      // 不能选择当前节点及其所有子孙节点，作为父节点，会使树断开
      treeSelectData.value = Tool.copy(level1.value);
      setDisable(treeSelectData.value, record.id);
      handleQueryContent(doc.value);
      // 为选择树添加一个"无"
      treeSelectData.value.unshift({id: 0, name: '无'});
    };

    /**
     * 新增
     */
    const add = () => {
      addEbookVisable.value = true;
      docAdd.value = {
        ebookId: route.query.ebookId
      };
      setTimeout(() => {
        editor1.create();
      },100);
      treeSelectData.value = Tool.copy(level1.value) || [];

      // 为选择树添加一个"无"
      treeSelectData.value.unshift({id: 0, name: '无'});
    };
    return {
      param,
      columns,
      loading,
      handleQuery,
      level1,
      edit,
      add,
      docAdd,
      treeSelectData,
      doc,
      addEbookVisable,
      handleModalAdd,
      modalVisible,
      modalLoading,
      handleModalOk,
      docIds,
      getDeleteIds,
      handleDelete
    }
  }
});
</script>

<style scoped>
img {
  width: 50px;
  height: 50px;
}

.button{
  margin-left: 34%;
}
</style>