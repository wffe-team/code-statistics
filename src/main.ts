import Vue from 'vue';
import App from './App.vue';
import { Menu, MenuItem, MenuItemGroup, Loading, Button, Dialog, Input } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Loading);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Input);

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
