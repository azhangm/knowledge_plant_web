<template>
  <a-layout id="components-layout-demo-top-side-2">
    <TheHeader/>
  <router-view/>
    <TheFoot/>
  </a-layout>
</template>

<script lang="ts">
  import TheHeader from '@/components/the-header.vue'
  import TheFoot from '@/components/the-foot.vue'
  export default {
    components: {
      TheHeader,
      TheFoot
    }
  }

</script>

<style >
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>