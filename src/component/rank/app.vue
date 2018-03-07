<script>
import yyapp from 'common/yyApp';
import Api from 'common/api';
import Util from 'common/util';

export default {
  name: 'app',
  data() {
    return {
      isShowRuleAlert: false, // 榜单规则弹窗
      curNav: 'mc', // 主播榜/用户榜:user
      curSubNav: 1, // 1:小时榜/2:日榜/3:总榜
      rankList: [],
      curRank: {},
      loading: false,
      aid: '',
    };
  },
  computed: {
    top3List() {
      if (this.rankList.length > 0) {
        const tempArr = this.rankList.slice(0, 3);
        const emptyObj = {
          nick: '虚位以待',
          calories: 0,
          avatar: 'https://yyweb.yystatic.com/pc/images/portrait/person/1.jpg',
        };
        if (tempArr.length === 1) {
          tempArr.unshift(emptyObj);
          tempArr.push(emptyObj);
          return tempArr;
        }
        const temp = tempArr[0];
        tempArr[0] = tempArr[1]; // eslint-disable-line
        tempArr[1] = temp;
        if (tempArr.length === 2) {
          tempArr.push(emptyObj);
        }
        return tempArr;
      }
      return [];
    },
    normalList() {
      if (this.rankList.length > 0) {
        return this.rankList.slice(3);
      }
      return [];
    },
  },
  created() {
    this.aid = Util.getURLParam('aid');
    this.getMcRankData();
  },
  methods: {
    /**
     * @method getRankData
     * @description 获取主播排行榜数据
     */
    getMcRankData() {
      this.loading = true;
      Api.anchorRank({
        aid: this.aid,
        rankType: this.curSubNav,
        platform: 'h5',
      }).then((res) => {
        this.loading = false;
        if (res.code === 0) {
          console.log('主播排行榜', res);
          this.curRank = res.data.anchorRank;
          this.rankList = res.data.ranks;
        }
      }).fail((err) => {
        this.loading = false;
        console.log(err);
      });
    },
    /**
     * @method getUserRankData
     * @description 获取用户排行榜数据
     */
    getUserRankData() {
      this.loading = true;
      $.when(yyapp.getTicket()).done((ticket) => {
        Api.userRank({
          ticket,
          rankType: this.curSubNav,
          platform: 'h5',
        }).then((res) => {
          this.loading = false;
          if (res.code === 0) {
            console.log('用户排行榜', res.data.ranks.length);
            this.curRank = res.data.userRank;
            this.rankList = res.data.ranks;
          }
        }).fail((err) => {
          this.loading = false;
          console.log(err);
        });
      });
    },
    /**
     * @method selectNav
     * @description 切换nav
     */
    selectNav(type) {
      if (type !== this.curNav) {
        this.curNav = type;
        this.curSubNav = 1;
        this.reqHandlerFun();
      }
    },
    /**
     * @method selectSubNav
     * @description 切换子nav
     */
    selectSubNav(type) {
      if (type !== this.curSubNav) {
        this.curSubNav = type;
        this.reqHandlerFun();
      }
    },
    /**
     * @method reqHandlerFun
     * @description 判断是请求哪个接口排行榜
     */
    reqHandlerFun() {
      if (this.curNav === 'mc') {
        this.getMcRankData();
      } else {
        this.getUserRankData();
      }
    },
    jump(data) {
      if (data.isLive === 1) {
        this.jumpLive(data);
      } else {
        this.personal(data.uid);
      }
    },
    /**
     * @method jumpLive
     * @description 跳转直播间
     */
    jumpLive(data) {
      yyapp.live(data.sid, data.ssid);
    },
    /**
     * @method personal
     * @description 个人主页
     */
    personal(uid) {
      if (uid) {
        yyapp.personal(uid);
      }
    },
    /**
     * @method showRuleAlert
     * @description 显示规则弹窗
     */
    showRuleAlert() {
      this.isShowRuleAlert = true;
    },
    /**
     * @method closeRuleAlert
     * @description 隐藏规则弹窗
     */
    closeRuleAlert() {
      this.isShowRuleAlert = false;
    },
  },
};
</script>

<template>
  <div class="app">
    <div class="spa-ico"></div>
    <div class="banner">
      <div class="rank-rule" @click="showRuleAlert"></div>
      <div class="nav-wrap">
        <div class="nav">
          <div class="nav-item" :class="{'active': curNav === 'mc'}" @click="selectNav('mc')">主播榜</div>
          <div class="nav-item" :class="{'active': curNav === 'user'}" @click="selectNav('user')">用户榜</div>
        </div>
      </div>
    </div>
    <div class="rank-bd">
      <div class="sub-nav-wrap">
        <div class="sub-nav">
          <div class="sub-nav-item" :class="{'active': curSubNav === 1}" @click="selectSubNav(1)">
            <div class="active-bg">
              <span class="text">小时榜</span>
            </div>
          </div>
          <div class="sub-nav-item" :class="{'active': curSubNav === 2}" @click="selectSubNav(2)">
            <div class="active-bg">
              <span class="text">日榜</span>
            </div>
          </div>
          <div class="sub-nav-item" :class="{'active': curSubNav === 3}" @click="selectSubNav(3)">
            <div class="active-bg">
              <span class="text">总榜</span>
            </div>
          </div>
        </div>
      </div>
      <div class="first-three-wrap">
        <div class="first-three-item" :class="{'top-2': index === 0, 'top-1': index === 1, 'top-3': index === 2,}" v-for="(item, index) in top3List" :key="index" @click="jump(item)">
          <div class="item-avatar" :style="{'background-image': `url(${item.avatar})`}"></div>
          <div class="item-rank-style">
            <p class="name">{{decodeURIComponent(item.nick) | substr(4)}}</p>
          </div>
          <p class="living" v-show="item.isLive === 1">直播中</p>
          <div class="calories">
            <p class="title">卡路里</p>
            <p class="value">{{item.calories | commafy}}</p>
          </div>
        </div>
      </div>
      <div class="list-wrap">
        <div class="list-item" v-for="(item, index) in normalList" :key="index" @click="jump(item)">
          <span class="rank-num">{{item.rank}}</span>
          <span class="change-state" :class="{'equal-state': item.trend === 3 || item.trend === 0, 'up-state': item.trend === 1, 'down-state': item.trend === 2}"></span>
          <img :src="item.avatar" alt="" class="avatar">
          <div class="info">
            <p class="name">{{decodeURIComponent(item.nick) | substr(20)}}</p>
            <p class="calories">卡路里：{{item.calories | commafy}}</p>
          </div>
          <div class="living" v-show="item.isLive === 1">
            <span>直播中</span>
            <span class="play-ico"></span>
          </div>
        </div>
      </div>
      <div class="loading-wrap" v-show="loading">
        <div class="loading" :class="{'show': loading}"></div>
      </div>
    </div>
    <div class="my-rank-wrap" @click="personal(curRank.uid)">
      <div class="list-item">
        <span class="rank-num">{{+curRank.rank > 99 ? '99+': curRank.rank}}</span>
        <img :src="curRank.avatar" alt="" class="avatar" v-if="curRank.avatar">
        <img src="//yyweb.yystatic.com/pc/images/portrait/person/1.jpg" alt="" class="avatar" v-else>
        <div class="info">
          <p class="name">{{decodeURIComponent(curRank.nick)}}</p>
          <p class="calories">卡路里：{{curRank.calories | commafy}}</p>
        </div>
      </div>
    </div>
    <div class="rule-mask" v-show="isShowRuleAlert" @click="closeRuleAlert"></div>
    <div class="rule-alert" v-show="isShowRuleAlert">
      <div class="rule-hd">
        <span class="close-ico" @click="closeRuleAlert"></span>
      </div>
      <div class="rule-con">
        <p class="text">1、直播间开启竞猜，每轮竞猜结束后，从胜利方盈利部分碎钻抽取一定比例转化为卡路里奖励/贡献。</p>
        <p class="text">2、每收到/赠送一个游戏专属礼物“干脆面”，增加一定数量卡路里奖励/贡献。</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~css/rank.scss';
@font-face {
  font-family: 'number-font';
  src: url('~font/dinmittelschrift-webfont.woff2') format('woff2'),
       url('~font/dinmittelschrift-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
.app {
  .banner {
    @include bg-img(100%, 227px, '~img/banner.jpg');
    display: block;
    position: relative;
    .rank-rule {
      position: absolute;
      top: 90px;
      right: 0;
      @include bg-img(124px, 56px, '~img/rank_rule_btn.png');
    }
    .nav-wrap {
      width: 100%;
      height: 98px;
      line-height: 98px;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .nav {
      display: flex;
      position: relative;
      text-align: center;
      color: #000;
      font-size: 32px;
      &:after {
        content: '';
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 1px;
        height: 40px;
        background-color: #000;
        transform: translate3d(-50%, -50%, 0);
      }
    }
    .nav-item {
      flex: 1;
      position: relative;
      &.active {
        font-weight: bold;
        &:after {
          content: '';
          display: inline-block;
          position: absolute;
          bottom: 15px;
          left: 50%;
          width: 50px;
          height: 6px;
          background-color: #fff;
          border-radius: 6px;
          transform: translate3d(-50%, 0, 0);
        }
      }
    }
  }
  .list-item {
    position: relative;
    height: 140px;
    line-height: 140px;
    padding: 0 28px;
    border-bottom: 1px solid #e9e9e9;
    font-size: 0;
    &:last-child {
      border: none;
    }
    .rank-num {
      display: inline-block;
      font-size: 26px;
      color: #666;
      vertical-align: middle;
    }
    .change-state {
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px;
      transform: translateY(8px);
      &.up-state {
        @include bg-img(15px, 18px, '~img/base64/up_ico.png');
      }
      &.down-state {
        @include bg-img(15px, 18px, '~img/base64/down_ico.png');
      }
      &.equal-state {
        width: 15px;
        height: 2PX;
        background-color: #666;
      }
    }
    .avatar {
      display: inline-block;
      vertical-align: middle;
      width: 62px;
      height: 62px;
      border-radius: 50%;
    }
    .info {
      display: inline-block;
      vertical-align: middle;
      line-height: 35px;
      margin-left: 15px;
      margin-top: 5px;
      .name {
        color: #1d1d1d;
        font-size: 26px;
        word-break: break-all;
      }
      .calories {
        color: #999;
        font-size: 24px;
      }
    }
    .living {
      position: absolute;
      top: 50%;
      right: 30px;
      width: 120px;
      height: 46px;
      line-height: 46px;
      border-radius: 46px;
      background-color: #ffdd00;
      text-align: center;
      color: #1d1d1d;
      transform: translate3d(0, -50%, 0);
      span {
        font-size: 22px;
      }
      .play-ico {
        @include bg-img(11px, 15px, '~img/base64/play_ico.png');
        margin-left: 10px;
      }
    }
  }
  .sub-nav-wrap {
    width: 530px;
    height: 60px;
    margin: 20px auto 0;
    background-color: #f5f5f5;
    border-radius: 60px;
    .sub-nav {
      display: flex;
      padding: 5px;
      text-align: center;
      font-size: 24px;
      color: #999;
    }
    .sub-nav-item {
      flex: 1;
      position: relative;
      &.active {
        color: #1d1d1d;
        font-weight: bold;
        .active-bg {
          background-color: #fff;
        }
      }
      .active-bg {
        width: 166px;
        height: 50px;
        margin: 0 auto;
        line-height: 52px;
        background-color: none;
        border-radius: 50px;
      }
    }
  }
  .first-three-wrap {
    @include bg-img(715px, 384px, '~img/rank_top_bg.jpg');
    display: block;
    display: flex;
    margin: 50px auto 0;
    text-align: center;
    .first-three-item {
      flex: 1;
      position: relative;
      &.top-1 {
        .item-avatar {
          top: 22px;
          width: 163px;
          height: 163px;
        }
        .item-rank-style {
          top: -23px;
          @include bg-img(205px, 232px, '~img/top_1.png');
        }
        .name {
          color: #a25c01;
        }
        .calories {
          padding-top: 245px;
        }
        .living {
          bottom: 217px;
        }
      }
      &.top-3 {
        .item-rank-style {
          background-image: url('~img/top_3.png');
        }
        .name {
          color: #bb5429;
        }
      }
      .item-avatar {
        display: inline-block;
        position: absolute;
        left: 50%;
        top: 95px;
        width: 130px;
        height: 130px;
        border-radius: 50%;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: translateX(-50%);
      }
      .item-rank-style {
        position: absolute;
        left: 50%;
        top: 60px;
        @include bg-img(183px, 191px, '~img/top_2.png');
        transform: translateX(-50%);
      }
      .living {
        position: absolute;
        bottom: 173px;
        right: 28px;
        width: 75px;
        height: 28px;
        line-height: 30px;
        text-align: center;
        font-size: 18px;
        color: #1d1d1d;
        background-color: #ffdd00;
        border-radius: 28px;
      }
      .name {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 145px;
        height: 40px;
        font-size: 26px;
        line-height: 40px;
        color: #727c84;
        transform: translateX(-50%);
      }
      .calories {
        padding-top: 285px;
        color: #fac200;
        line-height: 38px;
        .title {
          font-size: 24px;
        }
        .value {
          font-size: 30px;
          font-family: 'number-font';
        }
      }
    }
  }
  .list-wrap {
    padding-bottom: 150px;
  }
  .my-rank-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 140px;
    background-color: rgba(255, 248, 204, 0.9);
    .avatar {
      margin-left: 30px;
    }
  }
  .rule-mask {
    position: fixed;
    z-index: 500;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4)
  }
  .rule-alert {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 500;
    background-color: #fff;
    border-radius: 18px;
    transform: translate3d(-50%, -50%, 0);
    .rule-hd {
      @include bg-img(522px, 106px, '~img/rule_alert_hd.png');
    }
    .close-ico {
      position: absolute;
      top: 15px;
      right: 15px;
      @include bg-img(22px, 22px, '~img/base64/close_ico.png');
    }
    .rule-con {
      padding: 40px 25px;
      line-height: 38px;
      font-size: 26px;
      color: #1d1d1d;
      .text {
        margin-bottom: 10px;
      }
    }
  }
  @keyframes rotate {
    0% {
      transform: translate3d(-50%, 0, 0) rotate(0deg);
    }
    100% {
      transform: translate3d(-50%, 0, 0) rotate(360deg);
    }
  }
  .rank-bd {
    position: relative;
    .loading-wrap {
      position: fixed;
      top: 350px;
      left: 0;
      bottom: 0;
      width: 100%;
      .loading {
        @include bg-img(42px, 47px, '~img/loading.png');
        position: absolute;
        top: 400px;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        &.show {
          animation: rotate 1s linear infinite;
        }
      }
    }
  }
}
</style>
