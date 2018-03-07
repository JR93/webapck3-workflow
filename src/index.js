import 'css/index.scss';
import jsonss from './static/data.json';

if (__DEV__) { require('html/pages/index.hbs'); } // eslint-disable-line global-require

console.log(jsonss);

function a() {
  import(/* webpackChunkName: "show" */ './static/static.js').then((res) => {
    console.log('89989', res);
    document.querySelector('#app').innerHTML = res.name;
  });
}

setTimeout(() => {
  a();
}, 3000);
