<template>  <a-layout-header>
  <div class="logo" />
  <a-menu
      theme="dark"
      mode="horizontal"
      v-model:selectedKeys="selectedKeys"
      :style="{ lineHeight: '64px' }"
  >
    <a-menu-item key="1">首页</a-menu-item>
    <a-menu-item key="2">电子书管理</a-menu-item>
    <a-menu-item key="3">关于我</a-menu-item>
  </a-menu>
</a-layout-header>
</template>

<script lang="ts">
  export default {
    name:"the-header",
  }
</script>


