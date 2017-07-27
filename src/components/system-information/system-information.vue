<template>
    <div>
        <div class="title">Information</div>
        <div class="items">
            <div class="item">
                <div class="name">Path:</div>
                <div class="value">{{ path }}</div>
            </div>
            <div class="item">
                <div class="name">Route Name:</div>
                <div class="value">{{ name }}</div>
            </div>
            <div class="item">
                <div class="name">Vue.js:</div>
                <div class="value">{{ vue }}</div>
            </div>
            <div class="item">
                <div class="name">Electron:</div>
                <div class="value">{{ electron }}</div>
            </div>
            <div class="item">
                <div class="name">Node:</div>
                <div class="value">{{ node }}</div>
            </div>
            <div class="item">
                <div class="name">Platform:</div>
                <div class="value">{{ platform }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                electron: process.versions['atom-shell'],
                name: 'landing-page',
                node: process.versions.node,
                path: '/',
                platform: require('os').platform(),
                vue: require('vue/package.json').version
            }
        },
        //数组或对象，用于接收来自父组件的数据
        props: {

        },
        //计算
        computed: {

        },
        //方法
        methods: {

        },
        //生命周期函数
        created() {

        },
        beforeMount() {

        },
        mounted() {},
        //监视
        watch: {

        },
        //组件
        components: {

        },
        //过滤器
        filters: {

        },
        //自定义指令
        directive: {

        }
    }
</script>

<style lang="less" scoped>
    .title {
        color: #888;
        font-size: 18px;
        font-weight: initial;
        letter-spacing: .25px;
        margin-top: 10px;
    }

    .items {
        margin-top: 8px;
    }

    .item {
        display: flex;
        margin-bottom: 6px;
    }

    .item .name {
        color: #6a6a6a;
        margin-right: 6px;
    }

    .item .value {
        color: #35495e;
        font-weight: bold;
    }
</style>