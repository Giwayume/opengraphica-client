import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import Vue2TouchEvents from 'vue2-touch-events';
import VueInputAutowidth from 'vue-input-autowidth';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(Vue2TouchEvents);
Vue.use(VueInputAutowidth);

import App from './App.vue';
import router from './router';
import store from './store';

import './main.scss';
import '@fortawesome/fontawesome-free/css/all.css';

Vue.prototype.$deepGet = function (obj, props, defaultValue) {
    if (obj === undefined || obj === null) {
        return defaultValue;
    }

    if (props.length === 0) {
        return obj;
    }

    var foundSoFar = obj[props[0]];
    var remainingProps = props.slice(1);

    return Vue.prototype.$deepGet(foundSoFar, remainingProps, defaultValue);
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');