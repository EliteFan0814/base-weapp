import personalRequest from '../../api/personal'
import request from '../../api/order'
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
    remark: ''
  },

  getInfo() {
    request
      .exchangeOrderDetail(this.data.id)
      .then((res) => {
        this.setData({
          info: res.value
        })
      })
      .catch((err) => {})
  },

  // 确认收货
  async confirm(e) {
    let { id } = e.currentTarget.dataset
    const res = await app.showModal('提示', '是否要确认收货？')
    if (res) {
      request
        .confirmGetExchange(id)
        .then((res) => {
          app.toastSuccess('收货成功！')
          setTimeout(() => {
            this.getInfo()
          }, 300)
        })
        .catch((err) => {})
    }
  },
  // 获取电话
  getPhone() {
    personalRequest.getPhone().then((res) => {
      this.setData({
        phone: res.value.value
      })
    })
  },
  //拨打电话
  makePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getInfo()
    this.getPhone()
  }
})
