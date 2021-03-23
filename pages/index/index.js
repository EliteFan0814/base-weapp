import request from '../../api/index'
//获取应用实例
const app = getApp()

Page({
  data: {
    navOpacity: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    swiperList: [],
    classArr: [],
    periodInfo: {
      period: '',
      reduce: 0,
      text: '',
      timeSpan: ''
    },
    timeData: {},
    userInfo: {},
    todayProd: [],
    tomorrowProd: [],
    seckillProd: [],
    commonList: [],
    page: 1,
    pageSize: 10,
    totalPage: 0,
    activeTab: 'today',
    tabGoodsList: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    capsuleToTop: app.globalData.capsuleToTop
  },
  //
  openSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  // 切换tab
  handleChangeTab(e) {
    this.setData({
      activeTab: e.detail.name
    })
    this.get2Day()
  },

  //  方法
  // 获取轮播图
  getCarousel() {
    request
      .getCarouseList()
      .then((res) => {
        this.setData({
          swiperList: res.value
        })
      })
      .catch((err) => {})
  },
  // 获取商品列表
  getCommonList(type) {
    request.getCommonList(this.data.page, 10).then((res) => {
      this.data.totalPage = res.value.totalPage
      let tempCommon = this.data.commonList
      const resList = res.value.data
      if (type === 'down') {
        tempCommon.push(...resList)
        this.setData({
          commonList: tempCommon
        })
      } else {
        this.setData({
          commonList: resList
        })
      }
    })
  },
  // 获取秒杀期次
  getPeriodDate() {
    request.getPeriodDate().then((res) => {
      // const tempPeriod = res.value.period
      this.setData({
        periodInfo: res.value
        // time: res.value.reduce,
        // periodDate: res.value.period,
        // periodText: res.value.text,
        // timeSpan: res.value.timeSpan
      })
      this.getSeckillList()
    })
  },
  // 限时秒杀
  getSeckillList() {
    request
      .getSeckillList(this.data.periodInfo.timeSpan)
      .then((res) => {
        this.setData({
          seckillProd: res.value
        })
      })
      .catch((err) => {})
  },
  // 全部秒杀
  openAllSecKill(e) {
    const { period } = app.tapData(e)
    wx.navigateTo({
      url: `/pages/seckill/seckill?period=${period}`
    })
  },
  // 购买秒杀商品
  openSecKill(e) {
    const { id } = app.tapData(e)
    wx.navigateTo({
      url: `/pages/goodDetail/goodDetail?type=seckill&id=${id}`
    })
  },
  // 购买今日抢购商品
  buyTodayGood(e) {
    if (this.data.activeTab === 'today') {
      const { id } = app.tapData(e)
      wx.navigateTo({ url: '/pages/goodDetail/goodDetail?type=normal&id=' + id })
    } else {
      app.toastFail('耐心等待，明日再来！')
    }
  },
  // 购买普通商品
  buyGood(e) {
    const { id } = app.tapData(e)
    wx.navigateTo({ url: '/pages/goodDetail/goodDetail?type=normal&id=' + id })
  },
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getCommonList('down')
    }
  },
  // 获取分类列表
  getClassList() {
    request.getClassList().then((res) => {
      // res.value = res.value.concat(res.value).concat(res.value).concat(res.value).concat(res.value).concat(res.value)
      this.setData({
        classArr: res.value
      })
    })
  },
  // 获取期次列表
  // getPeriodList() {
  //   request
  //     .getPeriodList()
  //     .then((res) => {})
  //     .catch((err) => {})
  // },
  // 今日抢购 明日预告
  get2Day() {
    let temp = undefined
    if (this.data.activeTab === 'today') {
      temp = true
    } else {
      temp = false
    }
    request
      .get2Day(temp)
      .then((res) => {
        this.setData({
          tabGoodsList: res.value
        })
      })
      .catch((err) => {})
  },

  // 打开商品详情
  openDetail(e) {
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail'
    })
  },
  // 倒计时处理
  onTimeChange(e) {
    this.setData({
      timeData: e.detail
    })
  },
  // 倒计时结束
  onTimeFinished(e) {
    //如果已经开始秒杀，则秒杀结束
    if (this.data.isSeckillBegin) {
      this.setData({
        ['seckillInfo.seckillBeginReduce']: 0,
        ['seckillInfo.seckillEndReduce']: 0,
        isSeckillBegin: false
      })
    } else {
      // 如果还没开始，则设置开始秒杀
      this.setData({
        isSeckillBegin: true
      })
    }
    // const { index } = app.tapData(e)
    // const tempKey = `cartList[${index}].endReduce`
    // this.setData({
    //   [tempKey]: 0
    // })
  },
  // 静默获取用户的微信个人信息
  getWxUserInfoSilent() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  // 获取用户的微信个人信息
  getWxUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onLoad: function () {
    this.getCarousel()
    this.getClassList()
    this.get2Day()
    this.getCommonList()
    this.getPeriodDate()
  },
  onPageScroll: function (e) {
    let a = e.scrollTop / 60
    if (a >= 1) a = 1
    this.setData({
      navOpacity: a
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      totalPage: 0,
      commonList: []
    })
    this.getCarousel()
    this.getClassList()
    this.get2Day()
    this.getCommonList()
    this.getPeriodDate()
    setTimeout(() => {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 400)
  },
  onShareAppMessage: function (res) {
    request.getIntegral()
    const inviteCode = app.globalData.userInfo ? app.globalData.userInfo.inviteCode : ''
    return {
      title: '小菜娃',
      path: `/pages/index/index?inviteCode=${inviteCode}`
    }
  }
})
