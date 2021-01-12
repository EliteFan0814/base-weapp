import request from '../../api/integral'
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
    isSeckill: false,
    isSeckillBegin: false,
    // isSeckillOver:false,// 秒杀是否结束
    seckillInfo: {},
    timeData: {},
    goodInfo: {},
    goodSpec: [],
    selectedId: undefined,
    selectedNumber: 1,
    selectedSpec: {},
    activeTab: 'detail',
    goodContent: '',
    buyRecord: []
  },
  //
  getBuyRecord() {
    request.getBuyRecord(this.data.id).then((res) => {
      this.setData({
        buyRecord: res.value
      })
    })
  },
  //
  handleChangeTab(e) {
    console.log(e)
  },
  getGoodInfo() {
    request.goodDetail(this.data.id).then((res) => {
      const temp = res.value.content ? res.value.content.replace(/\<img/gi, '<img class="rich-img" ') : ''
      this.setData({
        goodInfo: res.value,
        goodContent: temp,
        swiperList: res.value.picsArray,
        // isSeckill: res.value.isSeckill,
        // isSeckillBegin: res.value.isSeckill && res.value.seckillInfo.seckillBeginReduce === 0,
        // seckillInfo: res.value.seckillInfo || {},
        // goodSpec: res.value.skus,
        // selectedSpec: res.value.skus[0],
        // selectedId: res.value.skus[0].id
      })
    })
  },
  // 处理倒计时
  onTimeChange(e) {
    this.setData({
      timeData: e.detail
    })
  },
  // 倒计时结束
  onTimeFinished(e) {
    //如果已经开始
    if (this.data.isSeckillBegin) {
      this.setData({
        ['seckillInfo.seckillBeginReduce']: 0,
        ['seckillInfo.seckillEndReduce']: 0
      })
    } else {
      // 如果还没开始，则设置开始
      this.setData({
        isSeckillBegin: true
      })
    }
    const { index } = app.tapData(e)
    const tempKey = `cartList[${index}].endReduce`
    this.setData({
      [tempKey]: 0
    })
  },
  // getGoodSpec() {
  //   request.getGoodSpec(this.data.id).then((res) => {
  //     this.setData({
  //       goodSpec: res.value,
  //       selectedSpec: res.value[0],
  //       selectedId: res.value[0].id
  //     })
  //   })
  // },
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
      url: `/pages/confirmOrder/confirmOrder?type=exchange&prodInfo=${prodInfo}&specInfo=${specInfo}&num=${num}`
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
    // this.getGoodSpec()
    // this.getBuyRecord()
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
