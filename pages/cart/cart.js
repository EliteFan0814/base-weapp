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
  // 倒计时
  onTimeChange(e) {
    const { index } = app.tapData(e)
    const tempKey = `cartList[${index}].timeData`
    this.setData({
      [tempKey]: e.detail
    })
  },
  // 倒计时结束
  onTimeFinished(e) {
    const { index } = app.tapData(e)
    const tempKey = `cartList[${index}].endReduce`
    this.setData({
      [tempKey]: 0
    })
  },
  getCartList() {
    request.getCartList().then((res) => {
      res.value = res.value.map((item, index) => {
        if (item.seckillSkuId) {
          item.timeData = 0
        }
        return item
      })
      this.setData({
        cartList: res.value,
        selected: [],
        selAll: false,
        total: 0
      })
      this.computeTotal()
    })
  },
  // 处理选择
  handleSelect(event) {
    this.setData({
      selected: event.detail
    })
    const tempList = this.data.cartList
    let filterNumber = 0
    for (let i = 0; i < tempList.length; i++) {
      if (!tempList[i].seckillSkuId) {
        // 如果是普通商品直接＋1
        filterNumber++
      } else if (tempList[i].seckillSkuId && tempList[i].endReduce) {
        // 如果是秒杀商品且没过期才＋1
        filterNumber++
      }
    }
    if (filterNumber !== this.data.selected.length) {
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
      this.data.cartList.map((item, index) => {
        if (!item.seckillSkuId) {
          // 如果是普通商品直接返回 index
          allIndex.push(index + '')
        } else if (item.seckillSkuId && item.endReduce) {
          // 如果是秒杀商品且没过期才返回 index
          allIndex.push(index + '')
        }
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
    if (this.data.selected.length) {
      const selectedItems = this.data.selected.map((item) => {
        return this.data.cartList[Number(item)]
      })

      let total = 0
      selectedItems.map((item) => {
        total = total + item.count * item.specialPrice
      })
      this.setData({
        total: total.toFixed(2)
      })
    } else {
      this.setData({
        total: 0
      })
    }
  },
  async cartDeleteByOne(e) {
    const res = await app.showModal('删除商品', '是否删除当前商品？')
    if (res) {
      const { id } = app.tapData(e)
      request.cartDeleteByOne(id).then((res) => {
        this.getCartList()
      })
    }
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
