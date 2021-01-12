// pages/order/order.js
import personalRequest from '../../api/personal'
import request from '../../api/order'
import pay from '../../utils/pay'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      { title: '全部', name: 'all', value: 0 },
      { title: '待发货', name: 0, value: 0 },
      { title: '已发货', name: 10, value: 10 },
      { title: '确认收货', name: 30, value: 30 }
    ],
    page: 1,
    totalPage: 1,
    orderId: '',
    list: [],
    active: 'all',
    loading: false,
    phone:undefined
  },
  // 获取订单列表
  getExchangeOrderList(type) {
    request.getExchangeOrderList(this.data.page, 10, this.data.active === 'all' ? '' : this.data.active).then((res) => {
      this.data.totalPage = res.value.totalPage
      let tempCommon = this.data.list
      const resList = res.value.data
      if (type === 'down') {
        tempCommon.push(...resList)
        this.setData({
          list: tempCommon
        })
      } else {
        this.setData({
          list: resList
        })
      }
    })
  },
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getExchangeOrderList('down')
    }
  },
  handleChangeTab(e) {
    console.log(e)
    let { name } = e.detail
    this.setData({
      page: 1,
      list: [],
      active: name
    })
    this.getExchangeOrderList()
  },
  // 确认收货
  async confirm(e) {
    let { id } = e.currentTarget.dataset
    const res = await app.showModal('提示', '是否要确认收货？')
    if (res) {
      request.confirmGetExchange(id).then((res) => {
        app.toastSuccess('收货成功！')
        setTimeout(() => {
          this.getExchangeOrderList()
        }, 300)
      })
    }
  },
  openDetail(e) {
    wx.navigateTo({ url: `/pages/orderExchangeDetail/orderExchangeDetail?id=${e.currentTarget.dataset.id}` })
  },
  // 获取电话
  getPhone(){
    personalRequest.getPhone().then(res=>{
      this.setData({
        phone: res.value.value
      })
    })
  },
  //拨打电话
  makePhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getExchangeOrderList()
    this.getPhone()
  }
})
