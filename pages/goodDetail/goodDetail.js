import request from '../../api/good'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    swiperList: 5,
    showDialog: false,
    id: undefined,
    swiperList: [],
    goodInfo: {},
    goodSpec: [],
    selectedId: undefined,
    selectedNumber: 1,
    selectedSpec: {}
  },
  getGoodInfo() {
    request.getGoodInfo(this.data.id).then((res) => {
      this.setData({
        goodInfo: res.value,
        swiperList: res.value.picsArray
      })
    })
  },
  getGoodSpec() {
    request.getGoodSpec(this.data.id).then((res) => {
      this.setData({
        goodSpec: res.value,
        selectedSpec: res.value[0],
        selectedId: res.value[0].id
      })
    })
  },
  // 购物数量
  handleBuyNum(e) {
    this.setData({
      selectedNumber: e.detail
    })
  },
  // 加入购物车
  handleCart(e) {
    const { info, num } = app.tapData(e)
    request
      .addToCart(info.productId, num, info.id)
      .then((res) => {
        app.toastSuccess('加入购物车成功！')
      })
      .catch((err) => {})
  },
  // 立即购买
  handleBuy(e) {
    const { prod, spec, num } = app.tapData(e)
    const prodInfo = JSON.stringify(prod)
    const specInfo = JSON.stringify(spec)
    wx.navigateTo({
      // url: `/pages/confirmOrder/confirmOrder?type=buyNow&prodId=${info.productId}&specId=${info.id}&num=${num}`
      url: `/pages/confirmOrder/confirmOrder?type=buyNow&prodInfo=${prodInfo}&specInfo=${specInfo}&num=${num}`
    })
  },
  //
  handleSelect(e) {
    const { info } = app.tapData(e)
    this.setData({
      selectedId: info.id,
      selectedSpec: info
    })
  },
  //
  openCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  openIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  handleClose() {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id: options.id })
    this.getGoodInfo()
    this.getGoodSpec()
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
