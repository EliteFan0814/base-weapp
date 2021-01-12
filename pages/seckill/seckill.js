import request from '../../api/seckill'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    time: 30 * 60 * 60 * 1000,
    timeData: {},
    periodList: [],
    periodGoodsList: [],
    page: 1,
    pageSize: 10,
    totalPage: 0,
    timeSpan: '',
    activeIndex: 0,
    defaultPeriod: ''
  },
  getPeriodList() {
    request
      .getPeriodList()
      .then((res) => {
        let tempIndex = 0
        res.value.map((item, index) => {
          if (item.period === this.data.defaultPeriod) {
            tempIndex = index
          }
        })
        this.setData({
          periodList: res.value,
          timeSpan: res.value[tempIndex].period,
          activeIndex: tempIndex
        })
        this.getPeriodGoodsList()
      })
      .catch((err) => {})
  },
  handleChange(e) {
    const { index } = app.tapData(e)
    this.setData({
      activeIndex: index,
      timeSpan: this.data.periodList[index].period,
      page: 1,
      periodGoodsList: []
    })
    this.getPeriodGoodsList()
  },
  getPeriodGoodsList(type) {
    request.getPeriodGoodsList(this.data.page, 10, this.data.timeSpan).then((res) => {
      this.data.totalPage = res.value.totalPage
      let tempCommon = this.data.periodGoodsList
      const resList = res.value.data
      if (type === 'down') {
        tempCommon.push(...resList)
        this.setData({
          periodGoodsList: tempCommon
        })
      } else {
        this.setData({
          periodGoodsList: resList
        })
      }
    })
  },
  // 购买秒杀商品
  openSecKill(e) {
    const { id } = app.tapData(e)
    wx.navigateTo({
      url: `/pages/goodDetail/goodDetail?type=seckill&id=${id}`
    })
  },
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getPeriodGoodsList('down')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      defaultPeriod: options.period
    })
    console.log(this.data.defaultPeriod)
    this.getPeriodList()
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
  onShareAppMessage: function () {},
  onTimeChange(e) {
    this.setData({
      timeData: e.detail
    })
  }
})
