// pages/orderDetails/orderDetails.js
import personalRequest from '../../api/personal'
import orderRequest from '../../api/order'
import wxPosition from '../../utils/authPosition'

import pay from '../../utils/pay'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    info: {},
    phone: '',
    refundDialog: false,
    remark: '',
    selfGetInfo: undefined,
    isGetPositionAuth: false
  },
  // 展示自提地址
  async showAddress(e) {
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
  // 获取自提地址
  getSelfGetInfo() {
    orderRequest
      .getSelfGetInfo()
      .then((res) => {
        this.setData({
          selfGetInfo: res.value
        })
      })
      .catch((err) => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      id: options.id
    })
    const res = await wxPosition.asyncGetPosition()
    if (res) {
      this.setData({
        isGetPositionAuth: true
      })
    }
    this.getInfo()
    this.getPhone()
    this.getSelfGetInfo()
  },

  getInfo() {
    orderRequest.details(this.data.id).then((res) => {
      res.value.serviceDate = res.value.selectSend.split(' ')[0]
      this.setData({
        info: res.value
      })
    })
  },

  getPhone() {
    personalRequest.getPhone().then((res) => {
      this.setData({
        phone: res.value.value
      })
    })
  },

  makePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  pay(e) {
    let { id } = e.currentTarget.dataset
    this.setData({ isPushing: true })
    orderRequest.getOrder(JSON.stringify(id)).then((res) => {
      const payInfo = res.value.prepayObj
      pay
        .wxPay(payInfo)
        .then((res) => {
          app.toastSuccess('支付成功！')
          console.log(res)
          this.setData({
            isPushing: false
          })
        })
        .catch((err) => {
          app.toastFail('支付失败！')
          this.setData({
            isPushing: false
          })
        })
        .catch((err) => {
          app.toastFail('支付失败！')
          this.setData({
            isPushing: false
          })
        })
    })
  },

  // 确认收货
  confirm(e) {
    let { id } = e.currentTarget.dataset
    const self = this
    wx.showModal({
      title: '提示',
      content: '确定确认收货吗？',
      success: function (res) {
        if (res.confirm) {
          orderRequest.confirm(JSON.stringify(id)).then((res) => {
            app.toastSuccess('收货成功')
            self.getData()
          })
        }
      }
    })
  },

  cancelOrder(e) {
    let { id } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          orderRequest.cancalOrder(JSON.stringify(id)).then((res) => {
            app.toastSuccess('取消订单成功')
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          })
        }
      }
    })
  },

  // 申请退款
  refund(e) {
    let { id } = e.currentTarget.dataset
    this.setData({
      id,
      refundDialog: true
    })
  },
  inputChange(e) {
    app.setData(e, this)
  },
  refundCancel() {
    this.setData({
      refundDialog: false,
      remark: ''
    })
  },

  submit() {
    const { remark, id } = this.data
    if (!remark) {
      return app.toastFail('请输入退款原因')
    } else {
      orderRequest.refund({ remark, orderId: id }).then((res) => {
        if (res.success) {
          app.toastSuccess('申请成功')
          this.setData({ refundDialog: false })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        }
      })
    }
  }
})
