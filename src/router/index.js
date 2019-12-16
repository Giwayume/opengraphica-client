import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
    },
	{
		path: '/edit',
		name: 'editorMain',
		component: () => import(/* webpackChunkName: "editor-main" */ '../views/EditorMain.vue')
    }
];

const router = new VueRouter({
    mode: process.env.NODE_ENV === 'development' ? 'hash' : 'history',
	routes
});

export default router;
