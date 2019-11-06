import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home.vue';
import EditorMain from '../views/EditorMain.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
	{
		path: '/edit',
		name: 'editorMain',
		component: EditorMain
    },
	//{
	//	path: '/about',
	//	name: 'about',
	//	component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	//}
];

const router = new VueRouter({
    mode: process.env.NODE_ENV === 'development' ? 'hash' : 'history',
	routes
});

export default router;
