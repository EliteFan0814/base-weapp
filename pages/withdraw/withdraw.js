// pages/withdraw/withdraw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    balance: 689.34,
    withdrawMoney: null,
    showSelectWay: true,
    payWay: '支付宝',
    actions: [{
        name: '支付宝',
        value: 'aLi'
      },
      {
        name: '银行卡',
        value: 'bank'
      },
    ]
  },
  openPayList() {
    this.setData({
      show: true
    })
  },
  closePayList(e) {
    console.log(e)
    this.setData({
      show: false,
      payWay: e.detail.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})