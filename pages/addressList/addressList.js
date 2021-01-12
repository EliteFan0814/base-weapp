import request from '../../api/address'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    defaultId: undefined,
    type: undefined
  },
  getAddressList() {
    request.getAddressList().then((res) => {
      res.value.map((item) => {
        if (item.isDefault) {
          this.setData({
            defaultId: item.id
          })
        }
      })
      this.setData({
        addressList: res.value
      })
    })
  },
  getDefault() {
    request.getDefault().then((res) => {
      res.value.id.map((item) => {
        if (item.isDefault) {
          this.setData({
            defaultId: item.id
          })
        }
      })
      this.setData({
        defaultId: res.value.id
      })
    })
  },
  changeAddress(e) {
    const { type, info } = app.tapData(e)
    const infoStr = JSON.stringify(info)
    let url = ''
    if (type === 'add') {
      url = `/pages/addressEdit/addressEdit?title=${'新增地址'}&type=${'add'}`
    } else {
      url = `/pages/addressEdit/addressEdit?title=${'修改地址'}&type=${'edit'}&info=${infoStr}`
    }
    wx.navigateTo({ url })
  },
  // 修改默认地址
  changeDefault(e) {
    request
      .setDefault(e.detail)
      .then((res) => {
        this.setData({ defaultId: e.detail })
        app.toastSuccess('设置成功！')
      })
      .catch((err) => {
        app.toastFail('设置默认地址失败！')
      })
  },
  // 删除地址
  async deleteAddress(e) {
    const res = await app.showModal('删除', '确认删除该地址？')
    const { id } = app.tapData(e)
    if (res) {
      request
        .delete(id)
        .then((res) => {
          app.toastSuccess('删除成功！')
          this.getAddressList()
        })
        .catch((err) => {
          app.toastFail('删除失败！')
        })
    }
  },
  changeData() {
    this.getAddressList()
  },
  // 选择地址
  selectAddress(e) {
    const { info } = app.tapData(e)
    if (['select', 'exchangeSelect'].includes(this.data.type)) {
      // 如果是 普通选择且当前地址不支持配送 则直接弹出错误信息
      if (this.data.type === 'select' && !info.status) {
        return app.toastFail('所选地址暂不支持配货，请更换配送地址！')
      }
      const pages = getCurrentPages()
      const beforePage = pages[pages.length - 2]
      beforePage.setData({
        address: info,
        addressId: info.id
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      return false
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    this.getAddressList()
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
