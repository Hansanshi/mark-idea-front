<template>
<div>
    <div class="history-preview-title">历史版本内容</div>
    <div>
    <div class="history-preview-content" style="white-space: pre-line;">
        {{text}}
    </div>
    </div>
</div>
</template>
<script>

export default {
    name: "HistoryPreview",
    data () {
        return {
            text: ""
        }
    },
    methods: {

        setText(text) {
            this.text = text
        }
    },
    mounted () {
        console.log("dhsifhsiofhods")
    }
}
</script>
<style scoped>
.history-preview-title{
    font-size: 24px;
    background-color: rgb(238, 238, 241);
    padding-bottom: 10px;
        padding-top: 10px;
        padding-left: 5px;
                padding-right: 5px;

        font-weight: bold;

}
.history-preview-content{
    padding-top: 5px;
            padding-left: 5px;
                padding-right: 5px;
    white-space: pre-line; 
    background-color: #fafafa;
}
</style>