// import 'css/rank.scss';
import App from 'component/rank/app.vue';
import Filters from 'common/filter';

if (__DEV__) { require('html/pages/rank.hbs'); } // eslint-disable-line global-require

document.addEventListener('touchstart', () => {});

Object.keys(Filters).forEach((key) => {
  Vue.filter(key, Filters[key]);
});

new Vue({ // eslint-disable-line
  el: '#app',
  template: '<App/>',
  components: { App },
});

console.log(Vue);
