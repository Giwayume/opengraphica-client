import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/home.vue')
    },
	{
		path: '/edit',
		name: 'editor-main',
		component: () => import(/* webpackChunkName: "editor-main" */ '../views/editor-main.vue')
    }
];

const router = new VueRouter({
    mode: process.env.NODE_ENV === 'development' ? 'hash' : 'history',
	routes
});

export default router;
