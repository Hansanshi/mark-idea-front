<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  created() {
            this.$store.commit('setWebsiteTitle', document.title);
  }
}
</script>>

