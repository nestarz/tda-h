// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'circular-std';
import VeeValidate from 'vee-validate';
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import VueOnlinePlugin from 'vue-navigator-online';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import App from './App.vue';
import apolloProvider from './config/apollo';
import './plugins/vuetify';
import router from './router';
import store from './vuex/store';

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(VeeValidate);
Vue.use(VueOnlinePlugin);
Vue.use(VueApollo);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
}).$mount('#app');
