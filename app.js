import authConfig from './utils/authConfig'
App({
  onLaunch: function (options) {
    console.log('options', options)
    wx.setStorageSync('token', '')
    authConfig.setSceneInfo(options)
    // 登录
    // wx.login({
    //   success: (res) => {
    //   }
    // })
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
    selectedClassIndex: 0,
    capsuleToTop: wx.getSystemInfoSync()['statusBarHeight'] + 6,
    upImgUrl: 'https://xcw.fxcloud.net/api/Files/UploadFiles?isPublic=true'
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
  },
  // 小程序上传图片
  wxUpImg(number = 1) {
    const that = this
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: number,
        success(res) {
          const tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url: that.globalData.upImgUrl,
            filePath: tempFilePaths[0],
            name: 'files',
            formData: {
              user: 'test'
            },
            success(res) {
              const data = JSON.parse(res.data)
              resolve(data)
            },
            fail(err) {
              reject(err)
            }
          })
        }
      })
    })
  }
})
