import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import iView from 'iview';
import '@/assets/less/iview.less';
import '@/assets/less/main.less';
import axios from 'axios';
import 'jquery';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './assets/bootstrap/css/bootstrap.min.css';
import md5 from 'js-md5';
import echarts from 'echarts';
// import './assets/bootstrap/js/bootstrap.min';


Vue.use(iView);

Vue.config.productionTip = false;
Vue.prototype.$md5       = md5
Vue.prototype.$http      = axios;
Vue.prototype.$echarts   = echarts ;
Vue.prototype.api = process.env.NODE_ENV === 'electron' ? 'http://test.cwb763.com/blogger/' : '/blogger/' ;//development 

axios.interceptors.request.use(
    config => {
        let storage = localStorage.getItem('Back_Blogger');
        
        if (storage) {
            storage = JSON.parse(storage)

            let token = storage.token;
            let time = storage.time;
            if (new Date().getTime() - time > 60000*20) {
                localStorage.removeItem('Back_Blogger');
                router.replace({
                    path: '/login',
                    query: {redirect: router.currentRoute.fullPath}   //登录成功后跳入浏览的当前页面
                })
            }else{
                localStorage.setItem('Back_Blogger',JSON.stringify({token:token,time:new Date().getTime()}));
            }
            config.headers.Authorization = 'Bearer '+token;
        }
        return config;
    },
        err => {
            return Promise.reject(err);
        }
);

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                // case 500:
                localStorage.removeItem('Back_Blogger');
                router.replace({
                    path: '/login',
                    query: {redirect: router.currentRoute.fullPath}   //登录成功后跳入浏览的当前页面
                })
            }
        }
    return Promise.reject(error.response.data)
    }
);

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (to.meta.requireAuth) {
    NProgress.set(0.6)
        if (localStorage.getItem('Back_Blogger')) {
            next();
        }else{
            next('/login');
        }
    }
    else {
        if (to.path != '/login' && to.path != '/NotFound') {
            next({
                path: '/NotFound',
            })
        }else{
            next();
        }
    }
})

router.afterEach(transition => {
  NProgress.done();
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
