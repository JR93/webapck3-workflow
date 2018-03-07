/* eslint-disable */
const TEN_THOUSAND = 10000;
const ONE_MILLION = 1000000;

const Filters = {
  numFormat(value) {
    const val = parseInt(value, 10);
    if (val < TEN_THOUSAND) {
      return val;
    } else if (val < ONE_MILLION) {
      return `${(val / TEN_THOUSAND).toFixed(2)}万`;
    }
    return `${Math.round(val / TEN_THOUSAND)}万`;
  },
  substr(value, len) {
    if (value.length <= len) {
      return value;
    }
    return `${value.substr(0, len)}...`;
  },
  commafy(val, sep) {
    const value = `${val}`;
    const separator = sep || ',';

    if (value.length <= 3) {
      return value;
    }

    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(value)) {
      return value;
    }

    const a = RegExp.$1;
    let b = RegExp.$2;
    const c = RegExp.$3;
    const re = new RegExp('(\\d)(\\d{3})(,|$)');

    while (re.test(b)) {
      b = b.replace(re, '$1,$2$3');
    }

    b = b.replace(/,/g, separator);

    return `${a}${b}${c}`;
  },
  fromatDate: function (time, fmt) {
    var _time = new Date(time);
    var o = {
      "M+": _time.getMonth() + 1, //月份
      "d+": _time.getDate(), //日
      "h+" : _time.getHours()%12 === 0 ? 12 : _time.getHours()%12, //12小时制
      "H+": _time.getHours(), //小时
      "m+": _time.getMinutes(), //分
      "s+": _time.getSeconds(), //秒
      "q+": Math.floor((_time.getMonth() + 3) / 3), //季度
      "S": _time.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (_time.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  },
};

export default Filters;
