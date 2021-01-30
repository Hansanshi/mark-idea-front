<template>
  <div>
        <div style="padding-bottom: 10px">
<router-link style="color: black ; text-decoration: none;" to="/">
  <el-button >返回</el-button>
</router-link>
  </div>


    <el-tabs type="border-card" tab-position="top" >



                <el-tab-pane label="🗺️ 网站管理"><website-setting></website-setting></el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import WebsiteSetting from '@/components/WebsiteSetting'


export default {
    components: {
        WebsiteSetting
    }
}
</script>

<style>

</style>