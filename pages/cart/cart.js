import request from '../../api/cart'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: [],
    cartList: [],
    selAll: false,
    total: 0
  },
  getCartList() {
    request.getCartList().then((res) => {
      this.setData({
        cartList: res.value
      })
      this.computeTotal()
    })
  },
  // 处理选择
  handleSelect(event) {
    this.setData({
      selected: event.detail
    })
    console.log(this.data.selected)
    if (this.data.cartList.length !== this.data.selected.length) {
      this.setData({
        selAll: false
      })
    } else {
      this.setData({
        selAll: true
      })
    }
    this.computeTotal()
  },
  // 处理全选
  handleSelAll() {
    this.setData({
      selAll: !this.data.selAll
    })
    let allIndex = []
    if (this.data.selAll) {
      allIndex = this.data.cartList.map((item, index) => {
        return index + ''
      })
    } else {
      allIndex = []
    }
    this.setData({
      selected: allIndex
    })
    this.computeTotal()
  },
  // 购物数量
  handleCartNum(e) {
    const { info, index } = app.tapData(e)
    const temp = this.data.cartList
    request
      .cartAdd(info.id, e.detail)
      .then((res) => {
        temp[index].count = e.detail
        this.setData({
          cartList: temp
        })
        this.computeTotal()
      })
      .catch((err) => {})
  },
  // 计算总金额
  computeTotal() {
    const selectedItems = this.data.selected.map((item) => {
      return this.data.cartList[Number(item)]
    })
    // const total = selectedItems
    //   .reduce((a, b) => {
    //     const theA = (a.count || 0) * (a.specialPrice || 0)
    //     const theB = (b.count || 0) * (b.specialPrice || 0)
    //     console.log(333)
    //     console.log('a.count || 0', a.count || 0)
    //     return theA * theB
    //   }, 0)
    let total = 0
    selectedItems.map((item) => {
      total = total + item.count * item.specialPrice
    })
    this.setData({
      total: total.toFixed(2)
    })
  },
  cartDeleteByOne(e) {
    const { id } = app.tapData(e)
    request.cartDeleteByOne(id).then((res) => {
      console.log(res)
      this.getCartList()
    })
  },
  // 结算购物车订单
  confirmCartOrder() {
    const idList = this.data.selected.map((item) => {
      return this.data.cartList[item].id
    })
    const cartIdList = JSON.stringify(idList)
    wx.navigateTo({
      url: `/pages/confirmOrder/confirmOrder?type=cart&cartIdList=${cartIdList}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCartList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCartList()
  },

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
