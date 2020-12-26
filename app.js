//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: (res) => {
        // console.log('res', res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
        }
      }
    })
  },
  globalData: {
    isLogin: wx.getStorageSync('token') ? true : false,
    userInfo: null,
    capsuleToTop: wx.getSystemInfoSync()['statusBarHeight'] + 6
  },
  // input双向绑定
  setData(e, _this) {
    const name = e.currentTarget.dataset.name
    _this.setData({
      // e.detail.value为小程序原生 input 返回值 e.detail 为 vant 返回值
      [name]: typeof e.detail.value == 'undefined' ? e.detail : e.detail.value
    })
  },
  // 获取tap点击后传入的数据
  tapData(e) {
    return e.currentTarget.dataset
  },
  //失败提示
  toastFail(e) {
    wx.showToast({
      title: e,
      icon: 'none'
    })
  },
  //成功提示
  toastSuccess(e) {
    wx.showToast({
      title: e
    })
  },
  // 交互弹框
  showModal(title, content) {
    return new Promise((reslove, reject) => {
      wx.showModal({
        title,
        content,
        success(res) {
          if (res.confirm) {
            reslove(true)
          } else if (res.cancel) {
            reslove(false)
          }
        }
      })
    })
  }
})
