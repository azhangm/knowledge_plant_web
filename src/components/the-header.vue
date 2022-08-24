<template>
  <a-layout-header class="header">
    <div class="logo" />
    <a-menu
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
    >
      <a-menu-item  key="1">
        <router-link to="/">首页</router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <router-link to="/admin/ebook">电子书管理</router-link>
      </a-menu-item>
      <a-menu-item key="3">
        <router-link to="/about">关于我</router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script lang="ts">
  export default {
    name:"the-header",
  }
</script>


