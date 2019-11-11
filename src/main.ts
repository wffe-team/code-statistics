import Vue from 'vue';
import App from './App.vue';
import { Menu, MenuItem, MenuItemGroup } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
