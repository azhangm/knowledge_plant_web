<template>
  <a-layout>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
        mode="inline"
        :style="{ height: '100%', borderRight: 0 }"
        @click="handleClick"
        :openKeys="openKeys"
    >
      <a-menu-item key="welcome">
        <MailOutlined />
        <span>欢迎</span>
      </a-menu-item>
      <a-sub-menu v-for="item in level1" :key="item.id" >
        <template v-slot:title>
          <span><user-outlined />{{item.name}}</span>
        </template>
        <a-menu-item v-for="child in item.children" :key="child.id">
          <MailOutlined /><span>{{child.name}}</span>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="tip" :disabled="true">
        <span >博客分类</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
  <a-layout-content
      :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
  >
    <div v-show="isShowWelcome">
      你好~~~~欢迎你
    </div>

    <a-list v-show="!isShowWelcome" item-layout="vertical" size="large" :grid="{ gutter: 20, column: 3 }" :data-source="ebooks">
      <template #renderItem="{ item }">
        <a-list-item key="item.name">
          <template #actions>
              <span>
                <component v-bind:is="'FileOutlined'" style="margin-right: 8px" />
                {{ item.docCount }}
              </span>
            <span>
                <component v-bind:is="'UserOutlined'" style="margin-right: 8px" />
                {{ item.viewCount }}
              </span>
            <span>
                <component v-bind:is="'LikeOutlined'" style="margin-right: 8px" />
                {{ item.voteCount }}
              </span>
          </template>
          <a-list-item-meta :description="item.description">
            <template #title>
              <router-link :to="'/doc?ebookId=' + item.id">
                {{ item.name }}
              </router-link>
            </template>
            <template #avatar><a-avatar :src="item.cover"/></template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, toRef } from 'vue';
import axios from 'axios';
import {Tool} from "@/assets/ts/tool";
import {message} from "ant-design-vue";
let ebooks = ref([]);
const loading = ref(false);
let isShowWelcome = ref(true);
export default defineComponent({
  name: 'HomeView',
  components: {
  },
  setup() {
    const handleQueryEbook = () => {
      axios.get("/eBook/list/", {
        params: {
          page: 1,
          size: 1000,
        }
      }).then((resp) => {
        console.log(resp);
        ebooks.value = resp.data.data.list;
      });
    };
    const level1 =  ref();
    let categorys: any;
    /**
     * 查询所有分类
     **/
    const handleQueryCategory = () => {
      loading.value = true;
      axios.get("/category/selectAll/").then((response) => {
        loading.value = false;
        const data = response.data;
        if (data.success) {
          categorys = data.data;
          console.log("原始数组：", categorys);

          level1.value = [];
          level1.value = Tool.array2Tree(categorys, 0);
          console.log("树形结构：", level1.value);
          // 加载玩分类后在加载电子书 否则电子书报错
          handleQueryEbook();

        } else {
          message.error(data.message);
        }
      });
    };
  const handleClick = (value : any) => {
    // console.log(value.key);
    isShowWelcome.value = value.key === 'welcome';

  }

    onMounted(() => {
      handleQueryCategory();
    });

    return {
      ebooks,
      level1,
      isShowWelcome,
      handleClick
    }
  }
});

// const listData: any = [];
// for (let i = 0; i < 23; i++) {
//   listData.push({
//     href: 'https://www.antdv.com/',
//     title: `ant design vue part ${i}`,
//     avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
//     description:
//         'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//     content:
//         'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
//   });
// }
</script>

<style scoped>
.ant-avatar {
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 8%;
  margin: 5px 0;
}
</style>