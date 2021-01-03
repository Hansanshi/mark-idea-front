<template>
  <div >
  <div ><p class="about">开源私有云笔记，基于Git和MarkDown
    <br/>
    版本号: <strong>{{version}}</strong>
        <br/>

    项目地址: <a href="https://github.com/Hansanshi/mark-idea" target="_blank" >Hansanshi/mark-idea</a>
    </p>
  </div>
  </div>
  
</template>

<script>
import config from '../../package.json'

export default {
name: 'About',
data() {
  return {
    version: config.version
  }
}
}
</script>
<style scoped>
.about{
  padding-top: 5px;
  text-align: center;
  font-size: 15px;
}
</style>