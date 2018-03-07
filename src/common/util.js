/* eslint-disable */
export default {
  getURLParam(name, url) {
    const re = new RegExp(`[\\?&#]${name}=([^&#]+)`, 'gi');
    const ma = (url || location.href).match(re);
    let strArr;
    if (ma && ma.length > 0) {
        strArr = (ma[ma.length - 1]);
        const _index = strArr.indexOf("=");
        return strArr.substring(_index + 1);
    }
    return '';
  },
  getCookie(name) {
    const RE = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    const arr = document.cookie.match(RE);
    if (arr) {
      return unescape(arr[2]);
    }
    return '';
  },
  isIOS() {
    const u = navigator.userAgent;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    return isiOS;
  },
  isMobileYY: function() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (/yy/i.test(ua)) {
      return true;
    }
    return false;
  },
}
