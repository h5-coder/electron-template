//js
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import store from './store/'
import filters from './filters/index.js'
import directives from './directives/index.js'

//css
import '../static/css/reset.css'
import '../static/css/element-ui.css'
//import '../static/css/iconfont.css'

//less
import "./less/index.less"

Vue.use(ElementUI)

if (!process.env.IS_WEB){
    Vue.use(require('vue-electron'));
}
//Vue.config.silent = true;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
    router,
    store
});
