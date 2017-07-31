<template>
    <div id="wrapper">
        <img id="logo" src="./images/logo.png" alt="electron-vue">
        <main>
            <div class="left-side">
                <span class="title">
          Welcome to your new project!
        </span>
                <system-information></system-information>
            </div>

            <div class="right-side">
                <div class="doc">
                    <div class="title">Getting Started</div>
                    <p>
                        electron-vue comes packed with detailed documentation that covers everything from internal configurations, using the project structure, building your application, and so much more.
                    </p>
                    <button @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">Read the Docs</button><br><br>
                </div>
                <div class="doc">
                    <div class="title alt">Other Documentation</div>
                    <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
                    <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
                </div>
            </div>
        </main>
        <!--<webview class="webview" autosize="on" minwidth="576" minheight="500" :src="src"></webview>-->
    </div>
</template>

<script>
    import systemInformation from '@/components/system-information/system-information'

    export default {
        name: 'landing-page',
        //实例的数据对象
        data() {
            return {
                src: 'https://www.baidu.com/'
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
            open(link) {
                this.$electron.shell.openExternal(link)
            }
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
            systemInformation
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
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    #wrapper {
        background: radial-gradient( ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, .9) 100%);
        height: 100vh;
        padding: 60px 80px;
        width: 100vw;
    }

    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 420px;
    }

    main {
        display: flex;
        justify-content: space-between;
    }

    main>div {
        flex-basis: 50%;
    }

    .left-side {
        display: flex;
        flex-direction: column;
    }

    .welcome {
        color: #555;
        font-size: 23px;
        margin-bottom: 10px;
    }

    .title {
        color: #2c3e50;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 6px;
    }

    .title.alt {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .doc {
        p {
            color: black;
            margin-bottom: 10px;
        }
        button {
            font-size: .8em;
            cursor: pointer;
            outline: none;
            padding: 0.75em 2em;
            border-radius: 2em;
            display: inline-block;
            color: #fff;
            background-color: #4fc08d;
            transition: all 0.15s ease;
            box-sizing: border-box;
            border: 1px solid #4fc08d;
        }
        button.alt {
            color: #42b983;
            background-color: transparent;
        }
    }

    .webview {
        display: flex;
        height: 480px;
    }
</style>