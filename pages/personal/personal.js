import request from '../../api/personal'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    orderList: [
      { img: '/static/img/personal/pending.png', name: '待付款', value: 0 },
      { img: '/static/img/personal/stocking.png', name: '备货中', value: 1 },
      { img: '/static/img/personal/sending.png', name: '配送中', value: 2 },
      { img: '/static/img/personal/end.png', name: '已完成', value: 3 }
    ],
    operateList: [
      { name: '收货地址管理', url: '/pages/addressList/addressList', isServe: false },
      { name: '平台客服', url: '', isServe: true },
      { name: '留言反馈', url: '/pages/leaveMessage/leaveMessage', isServe: false },
      { name: '平台公告', url: '/pages/noticeList/noticeList', isServe: false },
      { name: '成为团长', url: '/pages/check/check', isServe: false }
      // { name: '设置', url: '/pages/addressList/addressList', isServe: false }
    ],
    userInfo: {
      wxHeader: '',
      wxName: ''
    },
    account: {},
    navOpacity: 0
  },
  getUserInfo() {
    request
      .getUserInfo()
      .then((res) => {
        this.setData({
          userInfo: res.value.value,
          account: res.value.account
        })
      })
      .catch((err) => {})
  },
  // 点击获取微信昵称头像并更新到后台
  getWxUserInfo: function (e) {
    let user = e.detail.userInfo
    console.log(e.detail.userInfo)
    if (!this.data.userInfo.wxName) {
      request
        .bindWx(user.nickName, user.avatarUrl)
        .then((res) => {
          console.log(res)
          this.getUserInfo()
          // if (res.code == 1) {
          //   app.globalData.userInfo = user
          //   this.setData({
          //     hasUserInfo: true
          //   })
          //   this.getInfo()
          // } else {
          //   this.toastFail(res.msg)
          // }
        })
        .catch((err) => {})
    } else {
      this.setData({
        hasUserInfo: true
      })
    }
  },
  // 获取并绑定手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg.indexOf('ok') > -1) {
      request
        .bindPhone(e.detail.encryptedData, e.detail.iv)
        .then((res) => {
          app.toastSuccess('绑定成功')
          this.getUserInfo()
        })
        .catch((err) => {})
    } else {
      app.toastFail('拒绝绑定手机，可能影响小程序正常使用')
    }
  },
  openTeam() {
    wx.navigateTo({ url: '/pages/myTeam/myTeam' })
  },
  // 打开操作板
  openOperate(e) {
    const { info } = app.tapData(e)
    if (!info.isServe){
      wx.navigateTo({
        url: info.url
      })

    }
  },
  onPageScroll: function (e) {
    let a = e.scrollTop / 60
    if (a >= 1) a = 1
    this.setData({
      navOpacity: a
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
