import request from '../../api/order'
import pay from '../../utils/pay'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    latitude: undefined,
    longitude: undefined,
    radio: 'WX',
    cartIdList: [],
    cartInfoList: [],
    address: {},
    addressId: undefined,
    total: 0,
    showTimeDialog: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      }
      return value
    },
    selectDate: undefined,
    isPushing: false,
    buyNowProd: {},
    buyNowSpec: {},
    buyNowNum: 0
  },
  //
  confirmSelectTime(e) {
    const date = new Date(e.detail)
    const YY = date.getFullYear() + '-'
    const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const temp = YY + MM + DD
    this.setData({
      selectDate: temp,
      showTimeDialog: false
    })
  },
  // 取消选择时间
  cancelDelectTime() {
    this.setData({
      showTimeDialog: false
    })
  },
  // 打开时间面板
  openSelectTime() {
    this.setData({
      showTimeDialog: true
    })
  },
  // 确认订单
  payOrder() {
    if (!this.data.addressId) return app.toastFail('请选择收货地址！')
    if (!this.data.selectDate) return app.toastFail('请选择配送时间！')
    this.setData({
      isPushing: true
    })
    if (this.data.type === 'cart') {
      request
        .buyCart(this.data.cartIdList, this.data.addressId, this.data.selectDate)
        .then((res) => {
          const payInfo = res.value.prepayObj
          pay
            .wxPay(payInfo)
            .then((res) => {
              app.toastSuccess('支付成功！')
              console.log(res)
              this.setData({
                isPushing: false
              })
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/order/order'
                })
              }, 300)
            })
            .catch((err) => {
              app.toastFail('支付失败！')
              this.setData({
                isPushing: false
              })
            })
        })
        .catch((err) => {
          app.toastFail('支付失败！')
          this.setData({
            isPushing: false
          })
        })
    } else if (this.data.type === 'buyNow') {
      request
        .buyNow(this.data.buyNowSpec.id, this.data.buyNowNum, this.data.addressId, this.data.selectDate)
        .then((res) => {
          const payInfo = res.value.prepayObj
          pay
            .wxPay(payInfo)
            .then((res) => {
              app.toastSuccess('支付成功！')
              console.log(res)
              this.setData({
                isPushing: false
              })
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/order/order'
                })
              }, 300)
            })
            .catch((err) => {
              app.toastFail('支付失败！')
              this.setData({
                isPushing: false
              })
            })
        })
        .catch((err) => {
          app.toastFail('支付失败！')
          this.setData({
            isPushing: false
          })
        })
    }
  },
  // 获取购物车信息
  getCartInfo() {
    request.getCartInfo(this.data.cartIdList).then((res) => {
      this.setData({
        cartInfoList: res.value
      })
      console.log(this.data.cartInfoList)
      this.computeTotal()
    })
  },
  // 计算总金额
  computeTotal() {
    let total = 0
    if (this.data.type === 'cart') {
      this.data.cartInfoList.map((item) => {
        total = total + item.totalPrice
      })
    } else if (this.data.type === 'buyNow') {
      console.log('计算总金额')
      total = this.data.buyNowSpec.specialPrice * this.data.buyNowNum
    }
    this.setData({
      total: total.toFixed(2)
    })
  },
  // 获取默认地址
  getDefaultAddress() {
    request.getDefaultAddress().then((res) => {
      this.setData({
        address: res.value,
        addressId: res.value.id
      })
    })
  },
  // 打开选择地址
  openAddress() {
    wx.navigateTo({
      url: '/pages/addressList/addressList?type=select'
    })
  },
  openMap() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        // 根据定位信息获取附近提货点
        // getPickupListByLocation(this.data.latitude, this.data.longitude)
        //   .then((res) => {
        //     this.setData({
        //       pickupList: res.data.list
        //     })
        //   })
        //   .catch((err) => {
        //     if (err.code === 0) {
        //       this.setData({
        //         pickupList: []
        //       })
        //     }
        //   })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    // 立即购买
    if (options.type === 'buyNow') {
      const { prodInfo, specInfo, num } = options
      const buyNowProd = JSON.parse(prodInfo)
      const buyNowSpec = JSON.parse(specInfo)
      this.setData({
        buyNowProd: buyNowProd,
        buyNowSpec: buyNowSpec,
        buyNowNum: num
      })
      this.computeTotal()
    } else if (options.type === 'cart') {
      // 购物车购买
      this.setData({
        cartIdList: JSON.parse(options.cartIdList)
      })
      this.getCartInfo()
    }
    this.getDefaultAddress()
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
