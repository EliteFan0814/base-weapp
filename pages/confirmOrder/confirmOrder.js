import request from '../../api/order'
import personal from '../../api/personal'
import wxPosition from '../../utils/authPosition'
import pay from '../../utils/pay'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    integral: 0,
    latitude: undefined,
    longitude: undefined,
    radio: 'WX',
    cartIdList: [],
    cartInfoList: [],
    address: {},
    addressId: undefined,
    addressStatus: false,
    activeId: undefined,
    getWay: 'autoGet',
    selfGetInfo: undefined,
    isGetPositionAuth: false,
    mainActiveIndex: 0,
    timeSelectList: [
      {
        text: '今天',
        children: [
          { text: '15:00', id: 1 },
          { text: '16:00', id: 2 },
          { text: '17:00', id: 3 }
        ]
      },
      {
        text: '明天',
        children: [
          { text: '15:00', id: 1 },
          { text: '16:00', id: 2 },
          { text: '17:00', id: 3 }
        ]
      }
    ],
    isSelectedTime: false,
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
    selectDateDay: undefined,
    selectDateTime: undefined,
    isPushing: false,
    buyNowProd: {},
    buyNowSpec: {},
    buyNowNum: 0
  },
  // 展示自提地址
  showAddress(e) {
    const { info } = app.tapData(e)
    const locationTemp = info.pickUpLatlng.split(',')
    const address = info.pickUpAddress
    if (this.data.isGetPositionAuth) {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success(res) {
          const latitude = Number(locationTemp[1])
          const longitude = Number(locationTemp[0])
          wx.openLocation({
            latitude,
            longitude,
            address,
            scale: 18
          })
        },
        fail(err) {
          console.log(err)
        }
      })
    } else {
      this.showAuthPosition()
    }
  },
  // 未授权定位则打开授权设置页面
  showAuthPosition() {
    wxPosition.isAuthPosition().then((res) => {
      if (res) {
        this.setData({ isGetPositionAuth: true })
      }
    })
  },
  getUserInfo() {
    personal
      .getUserInfo()
      .then((res) => {
        let { value } = res.value
        this.setData({
          integral: value.memberIntegral
        })
      })
      .catch((err) => {})
  },
  // 选择配送方式
  handleGetWay(e) {
    this.setData({
      getWay: e.detail
    })
  },
  // 获取自提地址
  getSelfGetInfo() {
    request
      .getSelfGetInfo()
      .then((res) => {
        this.setData({
          selfGetInfo: res.value
        })
      })
      .catch((err) => {})
  },
  // 选择 哪天
  handleClickNav(e) {
    this.setData({
      mainActiveIndex: e.detail.index,
      selectDateDay: this.data.timeSelectList[e.detail.index].id,
      isSelectedTime: false,
      selectDateTime: undefined
    })
  },
  // 选择 哪个时间段
  handleClickItem(e) {
    this.setData({
      activeId: e.detail.id,
      isSelectedTime: true,
      selectDateTime: e.detail.id,
      selectDate: this.data.selectDateDay + ' ' + e.detail.id,
      showTimeDialog: false
    })
  },
  //
  handleCloseDialog() {
    this.setData({
      showTimeDialog: false
    })
  },
  // 取消选择时间
  cancelDelectTime() {
    this.setData({
      showTimeDialog: false
    })
  },
  getTimes() {
    request
      .getTimes()
      .then((res) => {
        this.setData({
          timeSelectList: res.value,
          selectDateDay: res.value[0].id
        })
      })
      .catch((err) => {})
  },
  // 打开时间面板
  openSelectTime() {
    this.setData({
      showTimeDialog: true
    })
    this.getTimes()
  },
  // 确认订单
  payOrder() {
    if (this.data.getWay === 'autoGet' && !this.data.addressId) return app.toastFail('请选择收货地址！')
    if (this.data.getWay === 'autoGet' && this.data.type !== 'exchange' && !this.data.isSelectedTime)
      return app.toastFail('请选择配送时间段！')
    this.setData({
      isPushing: true
    })
    // 是否自提
    let selfPickUp = false
    if (this.data.getWay === 'selfGet') {
      selfPickUp = true
    }
    if (this.data.type === 'cart') {
      // 购物车购买
      request
        .buyCart(this.data.cartIdList, this.data.addressId || 0, this.data.selectDate, selfPickUp)
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
                wx.redirectTo({
                  url: '/pages/order/order'
                })
              }, 300)
            })
            .catch((err) => {
              app.toastFail('支付失败！')
              this.setData({
                isPushing: false
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/order/order?status=0'
                })
              }, 300)
            })
        })
        .catch((err) => {
          this.setData({
            isPushing: false
          })
        })
    } else if (this.data.type === 'buyNow') {
      // 立即购买
      request
        .buyNow(
          this.data.buyNowSpec.id,
          this.data.buyNowNum,
          this.data.addressId || 0,
          this.data.selectDate,
          this.data.buyNowSpec.seckillSkuId || '',
          selfPickUp
        )
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
                wx.redirectTo({
                  url: '/pages/order/order'
                })
              }, 300)
            })
            .catch((err) => {
              app.toastFail('支付失败！')
              this.setData({
                isPushing: false
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/order/order?status=0'
                })
              }, 300)
            })
        })
        .catch((err) => {
          this.setData({
            isPushing: false
          })
        })
    } else if (this.data.type === 'exchange') {
      if (this.data.total > this.data.integral) {
        this.setData({
          isPushing: false
        })
        return app.toastFail('积分不足！')
      } else {
        request
          .buyExchange(this.data.addressId, this.data.buyNowProd.id, this.data.buyNowNum)
          .then((res) => {
            app.toastSuccess('支付成功！')
            this.setData({
              isPushing: false
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/orderExchange/orderExchange'
              })
            }, 300)
          })
          .catch((err) => {
            // app.toastFail('支付失败！')
            this.setData({
              isPushing: false
            })
          })
      }
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
      total = this.data.buyNowSpec.specialPrice * this.data.buyNowNum
    } else if (this.data.type === 'exchange') {
      total = this.data.buyNowProd.integral * this.data.buyNowNum
    }
    this.setData({
      total: total.toFixed(2)
    })
  },
  // 获取默认地址
  getDefaultAddress() {
    request.getDefaultAddress().then((res) => {
      if (res.value.status) {
        this.setData({
          address: res.value,
          addressId: res.value.id,
          addressStatus: res.value.status
        })
      }
    })
  },
  // 打开选择地址
  openAddress() {
    let type = 'select'
    if (this.data.type === 'exchange') {
      type = 'exchangeSelect'
    }
    wx.navigateTo({
      url: `/pages/addressList/addressList?type=${type}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      type: options.type
    })
    const res = await wxPosition.asyncGetPosition()
    if (res) {
      this.setData({
        isGetPositionAuth: true
      })
    }
    // 立即购买 秒杀立即购买
    if (options.type === 'buyNow' || options.type === 'exchange') {
      let { prodInfo, specInfo, num } = options
      prodInfo = decodeURIComponent(prodInfo)
      specInfo = decodeURIComponent(specInfo)
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
    this.getTimes()
    this.getDefaultAddress()
    this.getUserInfo()
    this.getSelfGetInfo()
  }
})
