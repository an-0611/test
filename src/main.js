import Vue from 'vue'
import App from './App.vue'
import store from './store'

import 'vue2-timepicker/dist/VueTimepicker.css';

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
