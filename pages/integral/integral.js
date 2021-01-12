import request from '../../api/integral'
import good from '../../api/good'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    classList: [],
    activeId: undefined,
    classItemList: [],
    page: 1,
    pageSize: 10,
    totalPage: 0,
    selectedClassIndex: 0,
    showDialog: false,
    selectedNumber: 1,
    goodInfo: {},
    goodSpec: {},
    selectedSpec: {},
    selectedId: undefined
  },
  openSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  // 倒计时
  onTimeChange(e) {
    const { index } = app.tapData(e)
    const tempKey = `classItemList[${index}].timeData`
    this.setData({
      [tempKey]: e.detail
    })
  },
  // 倒计时结束
  onTimeFinished(e) {
    const { index } = app.tapData(e)
    const tempKey = `classItemList[${index}].seckillInfo.seckillEndReduce`
    this.setData({
      [tempKey]: 0
    })
  },
  //
  handleClose(e) {
    const { info } = app.tapData(e)
    this.setData({
      showDialog: !this.data.showDialog
    })
    if (this.data.showDialog) {
      good
        .getGoodSpec(info.id)
        .then((res) => {
          this.setData({
            goodInfo: info,
            goodSpec: res.value,
            selectedSpec: res.value[0],
            selectedId: res.value[0].id
          })
        })
        .catch((err) => {})
    }
  },
  // 处理选择规格
  handleSelect(e) {
    const { info } = app.tapData(e)
    this.setData({
      selectedId: info.id,
      selectedSpec: info
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
    good
      .addToCart(info.productId, num, info.id, info.seckillSkuId || '')
      .then((res) => {
        app.toastSuccess('添加成功！')
        this.setData({
          showDialog: false
        })
      })
      .catch((err) => {})
  },
  // 立即购买
  handleBuy(e) {
    const { prod, spec, num } = app.tapData(e)
    const prodInfo = encodeURIComponent(JSON.stringify(prod))
    const specInfo = encodeURIComponent(JSON.stringify(spec))
    wx.navigateTo({
      // url: `/pages/confirmOrder/confirmOrder?type=buyNow&prodId=${info.productId}&specId=${info.id}&num=${num}`
      url: `/pages/confirmOrder/confirmOrder?type=buyNow&prodInfo=${prodInfo}&specInfo=${specInfo}&num=${num}`
    })
  },
  // 获取分类
  getClassList() {
    request.getClassList().then((res) => {
      const temp = res.value.map((item) => {
        item.text = item.name
        return item
      })
      this.setData({
        classList: temp,
        activeId: temp[this.data.selectedClassIndex].id
      })
      this.getClassItemList()
    })
  },
  // 查看兑换商品详情
  exchangeGoods(e) {
    const { id } = app.tapData(e)
    wx.navigateTo({ url: '/pages/integralGoodDetail/integralGoodDetail?type=exchange&id=' + id })
  },
  // 获取分类列表
  getClassItemList(type) {
    request.goodsList(this.data.page, 10, this.data.activeId).then((res) => {
      this.data.totalPage = res.value.totalPage
      let tempCommon = this.data.classItemList
      // res.value.data = res.value.data.map((item, index) => {
      //   if (item.isSeckill) {
      //     item.timeData = 0
      //   }
      //   return item
      // })
      const resList = res.value.data
      if (type === 'down') {
        tempCommon.push(...resList)
        this.setData({
          classItemList: tempCommon
        })
      } else {
        this.setData({
          classItemList: resList
        })
      }
    })
  },
  // 处理点击分类
  handleClickNav(e) {
    const id = this.data.classList[e.detail.index].id
    this.setData({
      activeId: id
    })
    this.setData({
      page: 1,
      totalPage: 0,
      classItemList: []
    })
    this.getClassItemList()
  },
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getCommonList('down')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectedClassIndex: app.globalData.selectedClassIndex || 0
    })
    console.log('selectedClassIndex', this.data.selectedClassIndex)
    this.getClassList()
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
