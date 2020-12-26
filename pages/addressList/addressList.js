import request from '../../api/address'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    defaultId: undefined
  },
  getAddressList() {
    request.getAddressList().then((res) => {
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
  changeDefault(e) {
    request
      .setDefault(e.detail)
      .then((res) => {
        this.setData({ defaultId: e.detail })
        app.toastSuccess('修改成功！')
      })
      .catch((err) => {
        app.toastFail('设置默认地址失败！')
      })
    console.log(e)
  },
  async deleteAddress(e) {
    const res = await app.showModal('删除', '确认删除该地址？')
    console.log(res)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getDefault()
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
