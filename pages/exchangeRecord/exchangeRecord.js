import request from '../../api/order'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    list: [],
    page: 1,
    totalPage: 0,
    active: 'all'
  },
  getRecordList(type) {
    request.exchangeRecord(this.data.page, 10, this.data.active === 'all' ? '' : this.data.active).then((res) => {
      res.exValue.IntegralDetailStatusStr.unshift({
        name: '全部',
        value: 'all'
      })
      this.setData({
        tabList: res.exValue.IntegralDetailStatusStr
      })
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
      this.getRecordList('down')
    }
  },
  // 处理点击 tab
  handleChangeTab(e) {
    console.log(e)
    this.setData({
      active: e.detail.name,
      page: 1,
      totalPage: 0,
      list: []
    })
    this.getRecordList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecordList()
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
