// pages/spread/spread.js
import request from '../../api/personal'
import index from '../../api/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request.spread().then((res) => {
      this.setData({ img: res.value })
    })
  },
  onShareAppMessage: function (res) {
    index.getIntegral()
    const inviteCode = app.globalData.userInfo ? app.globalData.userInfo.inviteCode : ''
    return {
      title: '小菜娃',
      path: `/pages/index/index?inviteCode=${inviteCode}`
    }
  }
})
