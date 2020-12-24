// pages/personal/personal.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    orderList: [
      { img: '/static/img/personal/pending.png', name: '待付款', value: 0 },
      { img: '/static/img/personal/stocking.png', name: '备货中', value: 1 },
      { img: '/static/img/personal/sending.png', name: '配送中', value: 2 },
      { img: '/static/img/personal/end.png', name: '已完成', value: 3 }
    ],
    operateList: [
      { name: '收货地址管理', url: '', isServe: false },
      { name: '平台客服', url: '', isServe: true },
      { name: '留言反馈', url: '', isServe: false },
      { name: '平台公告', url: '', isServe: false },
      { name: '成为团长', url: '', isServe: false },
      { name: '设置', url: '', isServe: false }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
