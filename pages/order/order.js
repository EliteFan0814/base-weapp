// pages/order/order.js
import personalRequest from '../../api/personal'
import orderRequest from '../../api/order'
import pay from '../../utils/pay'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,

    tabList: [
      { title: '全部', name: 'all', value: 0 },
      { title: '待付款', name: 0, value: 0 },
      { title: '备货中', name: 10, value: 10 },
      { title: '配送中', name: 20, value: 20 },
      { title: '自提', name: 35, value: 35 },
      { title: '已完成', name: 30, value: 30 }
    ],
    page: 1,
    totalPage: 1,
    orderId: '',
    list: [],
    status: 'all',
    active: '0',
    remark: '',
    refundDialog: false,
    scrollTop: 0,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { status } = options
    status = status == undefined ? 'all' : status
    let active = 0
    if (status == 'all') {
    } else if (status == 10) {
      active = 2
    } else if (status == 20) {
      active = 3
    } else if (status == 30) {
      active = 4
    } else {
      active = 1
    }
    this.setData({ active: active, status })
    this.getPhone()
  },
  onShow() {
    this.setData({ page: 1 })
    this.getData()
  },
  getData(type) {
    const { page, orderId, status, list } = this.data
    personalRequest.orderList(page, 10, status == 'all' ? '' : status, orderId).then((res) => {
      const { data, totalPage } = res.value
      if (data.length) {
        data.forEach((item) => {
          item.isOpen = false
          item.length = item.orderDetails.length
          item.firstChild = [item.orderDetails[0]]
          item.serviceDate = item.selectSend
        })
      }
      if (type == 'down') {
        list.push(...data)
        this.setData({
          list,
          totalPage,
          loading: false
        })
      } else {
        this.setData({
          list: data,
          totalPage,
          loading: false
        })
      }
    })
  },

  onChange(e) {
    let { index } = e.detail
    this.setData({
      status: this.data.tabList[index]['name'],
      page: 1,
      active: index,
      scrollTop: 0
    })
    this.getData()
  },
  openClick(e) {
    const { item, index } = e.currentTarget.dataset
    if (item.orderDetails.length == 0) return
    const { list } = this.properties
    list[index]['isOpen'] = !list[index]['isOpen']
    this.setData({
      list
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
  cancelOrder(e) {
    let { id } = e.currentTarget.dataset
    const self = this
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          orderRequest.cancalOrder(JSON.stringify(id)).then((res) => {
            app.toastSuccess('取消订单成功')
            self.getData()
          })
        }
      }
    })
  },

  // 确认收货
  confirm(e) {
    let { id } = e.currentTarget.dataset
    const self = this
    wx.showModal({
      title: '提示',
      content: '是否要确认收货？',
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

  open(e) {
    wx.navigateTo({ url: `/pages/orderDetails/orderDetails?id=${e.currentTarget.dataset.id}` })
  },

  // 申请退款
  refund(e) {
    let { id } = e.currentTarget.dataset
    this.setData({
      orderId: id,
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
    const { remark, orderId } = this.data
    if (!remark) {
      return app.toastFail('请输入退款原因')
    } else {
      orderRequest.refund({ remark, orderId }).then((res) => {
        if (res.success) {
          app.toastSuccess('申请成功')
          this.setData({ refundDialog: false })
          this.getData()
        }
      })
    }
  },

  loadMore() {
    if (this.data.loading) return
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getData('down')
      this.setData({
        loading: true
      })
    }
  }
})
