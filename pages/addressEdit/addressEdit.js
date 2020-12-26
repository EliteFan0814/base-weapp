import request from '../../api/address'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    type: '',
    info: {}
  },
  openMap() {
    wx.chooseLocation({
      latitude,
      longitude,
      success: (res) => {
        console.log('res', res)
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    if (o.info) {
      console.log(o.info)
      this.setData({
        info: JSON.parse(o.info)
      })
    }
    this.setData({
      title: o.title,
      type: o.type
    })
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
