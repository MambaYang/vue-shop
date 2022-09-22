import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import ElementPlus from './plugins/element'

// 导入全局样式表
import './assets/css/global.css'
// import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
// 文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import { Loading } from 'element-ui'

// axios.defaults.baseURL = 'https://api.naccl.top/vue/shop/api/private/v1/'
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.baseURL = 'http://8.131.62.137:1016/api/private/v1'

let loadingRes
// 配置 axios请求拦截器

axios.interceptors.request.use(config => {
    loadingRes = Loading.service({
        target:
            document.querySelector('.el-table') ||
            document.querySelector('.treeTable') ||
            document.querySelector('#main'),
        text: '加载中'
    })

    // 为请求头添加 Token 验证的 Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

axios.interceptors.response.use(config => {
    loadingRes.close()

    return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
// 注册为全局组件
Vue.use(VueQuillEditor)

// 时间过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
