import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ './views/login.vue'),
    },
    {
        path: "/",
        name: "admin",
        component: () =>import(/* webpackChunkName: "about" */ "./views/Admin.vue"),
        children: [
            {
                path: '/',
                name: 'home',
                component: () => import(/* webpackChunkName: "about" */ './views/home.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/article',
                name: 'article',
                component: () => import(/* webpackChunkName: "about" */ './views/article.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/classify',
                name: 'classify',
                component: () => import(/* webpackChunkName: "about" */ './views/classify.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/comment',
                name: 'comment',
                component: () => import(/* webpackChunkName: "about" */ './views/comment.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/user',
                name: 'user',
                component: () => import(/* webpackChunkName: "about" */ './views/user.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/article_edit/:id',
                name: 'article_edit',
                component: () => import(/* webpackChunkName: "about" */ './views/article_edit.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/article_add',
                name: 'article_add',
                component: () => import(/* webpackChunkName: "about" */ './views/article_add.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/admin_user',
                name: 'admin_user',
                component: () => import(/* webpackChunkName: "about" */ './views/admin_user.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/NotFound',
                name: 'NotFound',
                component: () => import(/* webpackChunkName: "about" */ './views/NotFound.vue'),
                meta: {requireAuth: true}
            },
        ]
    },
  ]
});
