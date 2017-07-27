import Vue from 'vue'
import Router from 'vue-router'

import Index from './map/Index'

//重定向 放最后面
import Redirect from './map/Redirect'

Vue.use(Router)

export default new Router({
    routes: [
        Index, //首页模块
        /*{
            path: '/',
            name: 'landing-page',
            component: require('@/components/LandingPage')
        },*/
        Redirect, //路由重定向(访问不存在的页面时，重定向到这个页面) 放最后面
    ]
})