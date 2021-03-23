import request from '../../api/personal'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    orderList: [
      { img: '/static/img/personal/pending.png', name: '待付款', value: 0, num: 0 },
      { img: '/static/img/personal/stocking.png', name: '备货中', value: 10, num: 0 },
      { img: '/static/img/personal/sending.png', name: '配送中', value: 20, num: 0 },
      { img: '/static/img/personal/end.png', name: '已完成', value: 30, num: 0 }
    ],
    operateList: [
      { name: '积分商城', url: '/pages/integral/integral', isServe: false, haveValue: true },
      { name: '积分订单', url: '/pages/orderExchange/orderExchange', isServe: false, haveValue: false },
      { name: '积分流水', url: '/pages/exchangeRecord/exchangeRecord', isServe: false, haveValue: false },
      { name: '收货地址管理', url: '/pages/addressList/addressList', isServe: false },
      { name: '平台客服', url: '', isServe: true },
      { name: '留言反馈', url: '/pages/leaveMessage/leaveMessage', isServe: false },
      { name: '平台公告', url: '/pages/noticeList/noticeList', isServe: false }
      // { name: '成为团长', url: '/pages/check/check', isServe: false }
      // { name: '设置', url: '/pages/addressList/addressList', isServe: false }
    ],
    spread: {
      name: '我要推广',
      url: '/pages/spread/spread',
      isServe: false
    },
    userInfo: {
      wxHeader: '',
      wxName: '',
      isLeader: ''
    },
    isLeader: undefined,
    isSign: undefined,
    account: {},
    navOpacity: 0,
    teamStatus: '',
    integral: 0,
    signDays: 0,
    infoAuth: app.globalData.infoAuth,
    mobileAuth: app.globalData.mobileAuth,
    showAuth: false,
    setByPage: undefined
  },
  // 处理签到
  handleSign() {
    if (this.data.isSign) {
      return app.toastFail('今日已签到！')
    } else {
      request
        .handleSign()
        .then((res) => {
          this.setData({
            isSign: true
          })
          this.getSignDays()
        })
        .catch((err) => {})
    }
  },
  getRedNum() {
    request.getRedNum().then((res) => {
      console.log(res)
      this.setData({
        ['orderList[0].num']: res.value.unPay.unPayCount,
        ['orderList[1].num']: res.value.delivering.deliveringCount,
        ['orderList[2].num']: res.value.unTakeStock.unTakeStockCount
      })
    })
  },
  //
  getUserInfo() {
    request
      .getUserInfo()
      .then((res) => {
        let { value, account } = res.value
        this.setData({
          userInfo: value,
          isSign: value.isSign,
          integral: value.memberIntegral,
          account: account,
          isLeader: value.isLeader,
          infoAuth: value.infoAuth,
          mobileAuth: value.mobileAuth
        })
        if (!this.data.setByPage) {
          if (!(this.data.infoAuth && this.data.mobileAuth)) {
            this.setData({
              showAuth: true
            })
          }
        }
      })
      .catch((err) => {})
  },
  // 点击获取微信昵称头像并更新到后台
  getWxUserInfoByPage: function (e) {
    let user = e.detail.userInfo
    console.log(e.detail.userInfo)
    if (!this.data.infoAuth) {
      request
        .bindWx(user.nickName, user.avatarUrl)
        .then((res) => {
          app.globalData.infoAuth = true
          this.setData({
            infoAuth: true,
            setByPage: true
          })
          this.getUserInfo()
        })
        .catch((err) => {})
    } else {
    }
  },
  // 点击获取微信昵称头像并更新到后台
  getWxUserInfo: function (e) {
    let user = e.detail.userInfo
    console.log(e.detail.userInfo)
    if (!this.data.infoAuth) {
      request
        .bindWx(user.nickName, user.avatarUrl)
        .then((res) => {
          app.globalData.infoAuth = true
          this.setData({
            infoAuth: true,
            setByPage: false
          })
          this.getUserInfo()
        })
        .catch((err) => {})
    } else {
    }
  },
  alertInfo() {
    app.toastFail('请先授权头像昵称')
  },
  // 获取并绑定手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg.indexOf('ok') > -1) {
      request
        .bindPhone(e.detail.encryptedData, e.detail.iv)
        .then((res) => {
          app.toastSuccess('绑定成功')
          this.setData({
            mobileAuth: true,
            showAuth: false
          })
          this.getUserInfo()
        })
        .catch((err) => {})
    } else {
      app.toastFail('拒绝绑定手机，可能影响小程序正常使用')
    }
  },
  closeDialog() {
    this.setData({
      showAuth: false
    })
  },
  // 获取签到天数
  getSignDays() {
    request
      .getSignDays()
      .then((res) => {
        this.setData({
          signDays: res.value
        })
        this.getUserInfo()
      })
      .catch((err) => {})
  },
  applyStatus() {
    request.applyStatus().then((res) => {
      this.setData({
        teamStatus: res.value
      })
    })
  },
  // 点击获取微信昵称头像并更新到后台
  // getWxUserInfo: function (e) {
  //   let user = e.detail.userInfo
  //   console.log(e.detail.userInfo)
  //   if (!this.data.userInfo.wxName) {
  //     request
  //       .bindWx(user.nickName, user.avatarUrl)
  //       .then((res) => {
  //         console.log(res)
  //         this.getUserInfo()
  //       })
  //       .catch((err) => {})
  //   } else {
  //     this.setData({
  //       hasUserInfo: true
  //     })
  //   }
  // },
  // 获取并绑定手机号
  // getPhoneNumber(e) {
  //   if (e.detail.errMsg.indexOf('ok') > -1) {
  //     request
  //       .bindPhone(e.detail.encryptedData, e.detail.iv)
  //       .then((res) => {
  //         app.toastSuccess('绑定成功')
  //         this.getUserInfo()
  //       })
  //       .catch((err) => {})
  //   } else {
  //     app.toastFail('拒绝绑定手机，可能影响小程序正常使用')
  //   }
  // },
  openTeam() {
    let url = `/pages/myTeam/myTeam`
    if (this.data.teamStatus === 0) return app.toastFail('正在审核中！')
    if (!this.data.userInfo.isLeader) {
      url = `/pages/check/check`
    }
    wx.navigateTo({ url })
  },
  openOrder(e) {
    wx.navigateTo({ url: `/pages/order/order?status=${e.currentTarget.dataset.status}` })
  },
  openAccount() {
    let url = `/pages/teamAccount/teamAccount`
    if (this.data.teamStatus === 0) return app.toastFail('正在审核中！')
    if (!this.data.userInfo.isLeader) {
      url = `/pages/check/check`
    }
    wx.navigateTo({ url })
  },
  // 打开操作板
  openOperate(e) {
    const { info } = app.tapData(e)
    // if (info.name == '成为团长') {
    //   if (this.data.userInfo.isLeader) {
    //     return app.toastFail('当前已是团长')
    //   } else if (this.data.teamStatus === 0) {
    //     return app.toastFail('正在审核中')
    //   }
    // }
    if (!info.isServe) {
      wx.navigateTo({
        url: info.url
      })
    }
  },
  // 申请成为团长
  openApply() {
    wx.navigateTo({
      url: '/pages/check/check'
    })
  },
  onPageScroll: function (e) {
    let a = e.scrollTop / 60
    if (a >= 1) a = 1
    this.setData({
      navOpacity: a
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.applyStatus()
    this.getUserInfo()
    this.getSignDays()
    this.getRedNum()
  }
})
