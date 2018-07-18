import Vue from 'vue/dist/vue.js';
import VueRouter from 'vue-router';

import Foo from '../components/foo.vue';
import Bar from '../components/bar.vue';
import Resolver from '../views/resolver.vue';

Vue.use(VueRouter);

const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    { path: '/resolver', component: Resolver },
];

export default new VueRouter({routes});