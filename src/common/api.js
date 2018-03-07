/* eslint-disable */
import yyapp from './yyApp';
import util from './util';

const isMobileYY = util.isMobileYY();
const api = {};
let mdevice = {};
// const domain = yyapp.appEnvironment() === 'Preview' ? '//wtest.3g.yy.com' : '//wap.yy.com';
const domain = '//wap.yy.com';
// const domain = '//wtest.3g.yy.com';
const sys = util.isIOS() ? 0 : 2;

const url = {
  // 主播卡路里排行榜
  anchorRank: `${domain}/mobileweb/guess/anchorRank`,
  // 用户卡路里排行榜
  userRank: `${domain}/mobileweb/guess/userRank`,
  // 用户端查询竞猜记录
  userGuess: `${domain}/mobileweb/guess/userGuess`,
  // 兑奖礼物信息接口
  changeInfo: `${domain}/mobileweb/guess/changeInfo`,
};

if (isMobileYY) {
  yyapp.appDevice().done((uid, hdid, imei, mac) => {
    console.log('app设备信息', uid, hdid, imei, mac);
    mdevice.uid = uid;
    mdevice.hdid = hdid;
    mdevice.imei = imei;
    mdevice.macaddress = mac;
  }).fail((err) => {
    console.log('app设备信息获取失败', err);
  });
}

Object.keys(url).forEach((k) => {
  api[k] = function (params = {}, arrStr = '') {
    const str = arrStr ? `?${arrStr}` : '';
    return $.ajax({
      url: url[k] + str,
      dataType: 'jsonp',
      jsonp: 'jsonpcb',
      data: params,
    });
  };
});

// 商城兑换商品
api['changeCommodity'] = function (ticket, params = {}) {
  return $.ajax({
    url: '//ysapi.yy.com/api/internal/weeklyMall/changeCommodity.json',
    // url: '//ysapitest.yy.com/api/internal/weeklyMall/changeCommodity.json',
    dataType: 'jsonp',
    data: {
      ticket: ticket,
      data: JSON.stringify(params)
    },
  });
}

/**
 * 海度上报
 * @doc https://data.hiido.com/index.php?r=sdkdemand/eventview&id=20021149
 * @method report
 * @param {String} acttype,行为类型
 * @param {Object} json,自定义参数,见文档
 */
function reportHandlerFn(id, acttype, mdevice) {
  const hiido = new hiidoEvent('yylive', id);
  hiido.setActtype(acttype);
  hiido.setSys(sys);
  hiido.setUid(mdevice.uid);
  hiido.setImei(mdevice.imei);
  hiido.setMac(mdevice.macaddress);
  hiido.setHdid(mdevice.hdid);
  hiido.setMoreinfo({"key1": 1});
  hiido.reportJudge();
}

api.report = (acttype = 1, id = '20021149') => {
  if (mdevice.uid && mdevice.imei && mdevice.macaddress && mdevice.hdid) {
    reportHandlerFn(id, acttype, mdevice);
  } else {
    if (isMobileYY) {
      yyapp.appDevice().done((uid, hdid, imei, mac) => {
        mdevice.uid = uid;
        mdevice.hdid = hdid;
        mdevice.imei = imei;
        mdevice.macaddress = mac;
        reportHandlerFn(id, acttype, mdevice);
      }).fail((err) => {
        console.log('app设备信息获取失败', err);
      });
    }
  }
};

export default api;
