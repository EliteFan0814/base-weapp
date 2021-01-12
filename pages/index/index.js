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
    classList: [],
    classPages: 0,
    time: 30 * 60 * 60 * 1000,
    timeData: {},
    userInfo: {},
    todayProd: [],
    tomorrowProd: [],
    seckillProd: [],
    commonList: [],
    page: 1,
    pageSize: 10,
    totalPage: 0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    capsuleToTop: app.globalData.capsuleToTop
  },
  // 打开相应分类
  openClass(e) {
    console.log(e)
    wx.switchTab({
      url: '/pages/class/class'
    })
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
  // 限时秒杀
  getSeckillList() {
    request.getSeckillList().then((res) => {
      this.setData({
        seckillProd: res.value
      }).catch((err) => {})
    })
  },
  // 全部秒杀
  openAllSecKill() {
    wx.navigateTo({
      url: '/pages/seckill/seckill'
    })
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
      res.value = res.value
      const filterArr = this.sliceArray(res.value, 10)
      this.setData({
        classList: filterArr,
        classPages: filterArr.length
      })
    })
  },
  //
  openClass(e) {
    const data = app.tapData(e)
    console.log(data)
  },
  // 获取期次列表
  getPeriodList() {
    request
      .getPeriodList()
      .then((res) => {})
      .catch((err) => {})
  },
  // 获取 今日抢购
  getProdList() {
    request
      .getProdList(0)
      .then((res) => {
        this.setData({
          todayProd: res.value
        })
      })
      .catch((err) => {})
  },
  // 获取  明日预告
  getProdList() {
    request
      .getProdList(1)
      .then((res) => {
        this.setData({
          tomorrowProd: res.value
        })
      })
      .catch((err) => {})
  },
  // 获取   限时秒杀
  getProdList() {
    request
      .getProdList(2)
      .then((res) => {
        this.setData({
          seckillProd: res.value
        })
      })
      .catch((err) => {})
  },
  // 购买普通商品
  buyGood(e) {
    const { id } = app.tapData(e)
    wx.navigateTo({ url: '/pages/goodDetail/goodDetail?id=' + id })
  },
  //分类分页处理
  sliceArray(targetArray, number) {
    const page = Math.ceil(targetArray.length / number)
    const returnArr = []
    for (let i = 0; i < page; i++) {
      returnArr[i] = targetArray.slice(i * number, (i + 1) * number)
    }
    return returnArr
  },
  // 打开商品详情
  openDetail(e) {
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail'
    })
  },
  onTimeChange(e) {
    this.setData({
      timeData: e.detail
    })
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
    this.getSeckillList()
    this.getCommonList()
  },
  onPageScroll: function (e) {
    let a = e.scrollTop / 60
    if (a >= 1) a = 1
    this.setData({
      navOpacity: a
    })
  }
})
