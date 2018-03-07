/* eslint-disable */
import util from './util';

const isMobileYY = (() => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (/yy/i.test(ua)) {
    return true;
  }
  return false;
})();

const appClient = {
  webIsLogined() {
    const uid = util.getCookie('yyuid');
    return uid !== '';
  },
  isLogined() {
    return (() => {
      const dtd = $.Deferred();
      try {
        window.YYApiCore.invokeClientMethod('data', 'isLogined', {}, (isLogin) => {
          dtd.resolve(isLogin);
        });
      } catch(e) {
        const isLogin = this.webIsLogined();
        dtd.resolve(isLogin);
      }
      return dtd.promise();
    })();
  },
  myUid() {
    return (() => {
      const dtd = $.Deferred();
      try {
        window.YYApiCore.invokeClientMethod('data', 'myUid', {}, (myUid) => {
          dtd.resolve(myUid);
        });
      } catch(e) {
        const uid = util.getCookie('yyuid');
        dtd.resolve(uid);
      }
      return dtd.promise();
    })();
  },
  myYY() {
    return (() => {
      const dtd = $.Deferred();
      try {
        window.YYApiCore.invokeClientMethod('data', 'myImid', {}, (myImid) => {
          dtd.resolve(myImid);
        });
      } catch(e) {
        dtd.resolve();
      }
      return dtd.promise();
    })();
  },
  getTicket() {
    return (() => {
      const dtd = $.Deferred();
      try {
        window.YYApiCore.invokeClientMethod('data', 'webTicket', {}, (ticket) => {
          dtd.resolve(ticket);
        });
      } catch(e) {
        dtd.resolve();
      }
      return dtd.promise();
    })();
  },
  goToUrl(url) {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'goto', {
        uri: `yymobile://Web/Features/5/Url/${encodeURIComponent(url)}`,
      });
    } else {
      window.open(url, '_blank');
    }
  },
  localUrl(url) {
    if (isMobileYY) {
      const link = `//page.yy.com/${url}`;
      window.location.href = link;
    } else {
      const link = `//page.yy.com/${url}`;
      window.location.href = link;
    }
  },
  openUrl(url) {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'goto', {
        uri: `yymobile://Web/Features/5/Url/${encodeURIComponent(url)}`,
      });
    } else {
      window.open(url, '_blank');
    }
  },
  // 开播预览页
  goToPreViewPage() {
    window.YYApiCore.invokeClientMethod('ui', 'goto', {
      uri: 'yymobile://MobileLive/PreViewPage',
    });
  },
  loginApp() {
    if (isMobileYY) {
      // const self = this;
      // 登录成功会调用多次，sign防止多次执行
      // let sign = true;
      window.YYApiCore.invokeClientMethod('ui', 'goto', {
        uri: 'yymobile://Login/Login',
      });
      // window.onBridgeEvent = function (event) {
      //   if (sign) {
      //     switch (event.type) {
      //       case 'LoginEvent':
      //         self.toast('登录成功');
      //         window.location.reload();
      //         break;
      //       case 'LogoutEvent':
      //         self.toast('退出成功');
      //         break;
      //       default:
      //     }
      //     sign = false;
      //   }
      // };
    } else {
      // alert('请先登录');
    }
  },
  setNavigationBar(conf, callback) {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'setNavigationBar', conf, (res) => {
        callback(res);
      });
    }
  },
  toast(txt) {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'toast', {
        msg: txt,
        duration: 3,
      });
    } else {
      console.log(txt);
    }
  },
  prevView() {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'popViewController');
    } else {
      window.history.go(-1);
    }
  },
  showLoginDialog() {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'showLoginDialog');
    }
  },
  submitFeedBack(conf) {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'submitFeedBack', conf);
    }
  },
  gotoBrowser(link) {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'gotoBrowser', { url: link });
    } else {
      window.open(link, '_blank');
    }
  },
  showAlertDialog(conf, callback) {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'showAlertDialog', {
        title: '提示',
        message: conf.msg,
        buttons: [conf.btn0 || '确定', conf.btn1 || '取消'],
      }, (res) => {
        callback(res.index);
      });
    }
  },
  showAlertDialog2(conf, callback) {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'showAlertDialog', {
        title: '提示',
        message: conf.msg,
        buttons: [conf.btn0 || '确定'],
      }, (res) => {
        callback(res.index);
      });
    }
  },
  banPullRefresh(bool = false) {
    if (isMobileYY) {
      window.YYApiCore.invokeClientMethod('ui', 'setPullRefreshEnable', { isRefresh: bool });
    }
  },
  getHdid() {
    if (isMobileYY) {
      if (util.isIOS()) {
        return (() => {
          const dtd = $.Deferred();
          try {
            window.YYApiCore.invokeClientMethod('device', 'hdid', {}, (hdid) => {
              dtd.resolve(hdid);
            });
          } catch(e) {
            dtd.resolve();
          }
          return dtd.promise();
        })();
      } else {
        return (() => {
          const dtd = $.Deferred();
          try {
            window.YYApiCore.invokeClientMethod('ui', 'hdid', {}, (hdid) => {
              dtd.resolve(hdid);
            });
          } catch(e) {
            dtd.resolve();
          }
          return dtd.promise();
        })();
      }
    }
  },
  getImei() {
    return (() => {
      const dtd = $.Deferred();
      try {
        window.YYApiCore.invokeClientMethod('device', 'imei', {}, (imei) => {
          dtd.resolve(imei);
        });
      } catch(e) {
        dtd.resolve();
      }
      return dtd.promise();
    })();
  },
  getMac() {
    return (() => {
      const dtd = $.Deferred();
      try {
        window.YYApiCore.invokeClientMethod('data', 'getMac', {}, (mac) => {
          dtd.resolve(mac);
        });
      } catch(e) {
        dtd.resolve();
      }
      return dtd.promise();
    })();
  },
  appDevice() {
    const self = this;
    if (isMobileYY) {
      return $.when(
        self.myUid(),
        self.getHdid(),
        self.getImei(),
        self.getMac(),
      );
    }
    return {};
  },
  appVersion() {
    if (isMobileYY) {
      return (() => {
        const dtd = $.Deferred();
        try {
          window.YYApiCore.invokeClientMethod('device', 'appVersion', {}, (ver) => {
            dtd.resolve(ver);
          });
        } catch(e) {
          dtd.resolve();
        }
        return dtd.promise();
      })();
    }
  },
  sysVersion() {
    if (isMobileYY) {
      return (() => {
        const dtd = $.Deferred();
        try {
          window.YYApiCore.invokeClientMethod('device', 'systemName', {}, (sysVer) => {
            dtd.resolve(sysVer);
          });
        } catch(e) {
          dtd.resolve();
        }
        return dtd.promise();
      })();
    }
  },
  appEnvironment() {
    if (isMobileYY) {
      return (() => {
        const dtd = $.Deferred();
        try {
          window.YYApiCore.invokeClientMethod('device', 'environment', {}, (env) => {
            dtd.resolve(env);
          });
        } catch(e) {
          dtd.resolve();
        }
        return dtd.promise();
      })();
    }
  },
  live(sid, ssid) {
    window.YYApiCore.invokeClientMethod('ui', 'goto', {
      uri: `yymobile://Channel/Live/${sid}/${ssid}`,
    });
  },
  // 个人主页
  personal(uid) {
    window.YYApiCore.invokeClientMethod('ui', 'goto', {
      uri: `yymobile://PersonalCenter/${uid}`,
    });
  },
  // 通知客户端显示隐藏红点--1：显示红点；0：隐藏红点
  hideRedPoint() {
    window.YYApiCore.invokeClientMethod('ui', 'showTreasureBoxRedPoint', { show: 0 });
  },
  // 跳转玩法聚合页: crane-抓娃娃；ball-篮球；eater-吃货脸萌；pk-欢乐斗；facial-消消乐; 陪我-payone
  aggregationPage(type) {
    window.YYApiCore.invokeClientMethod('ui', 'goto', {
      uri: `yymobile://AggregationPage/Game?biz=${type}&parentBiz=near2&serv=2`,
    });
  },
  // 锦标赛进入比赛: crane-抓娃娃；ball-篮球；eater-吃货脸萌；pk-欢乐斗；facial-消消乐
  gameEntrance(type) {
    window.YYApiCore.invokeClientMethod('ui', 'goto', {
      uri: `yymobile://LivePreview/GameEntrance?biz=${type}`,
    });
  },
  setLiveRoomTip(delay, message) {
    window.YYApiCore.invokeClientMethod('ui', 'setLiveRoomTip', JSON.stringify({
      delay,
      message,
    }));
  },
};

appClient.isMobileYY = isMobileYY;

export default appClient;
