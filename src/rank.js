import App from 'component/rank/app.vue';

if (__DEV__) { require('html/pages/rank.hbs'); } // eslint-disable-line global-require

document.addEventListener('touchstart', () => {});

new Vue({ // eslint-disable-line
  el: '#app',
  template: '<App/>',
  components: { App },
});

