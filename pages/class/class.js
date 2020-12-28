import request from '../../api/class'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classList: [],
    activeId: undefined,
    classItemList: [],
    page: 1,
    pageSize: 10,
    totalPage: 0
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
        activeId: temp[0].id
      })
      this.getClassItemList()
    })
  },
  //
  getClassItemList(type) {
    request.getClassItemList(this.data.page, 10, this.data.activeId).then((res) => {
      this.data.totalPage = res.value.totalPage
      let tempCommon = this.data.classItemList
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
