import request from '../../api/address'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    type: '',
    info: {
      mobile: '',
      address: '',
      area: '',
      contact: '',
      longitude: '',
      latitude: '',
      addressLatlog: ''
    },
    rules: [
      { name: 'contact', message: '请输入联系人！' },
      { name: 'mobile', message: '请输入联系电话！' },
      { name: 'area', message: '请选择地区！' },
      { name: 'address', message: '请输入详细地址！' }
    ]
  },
  //
  inputChange(e) {
    app.setData(e, this)
  },
  // 打开地图选址
  openMap(e) {
    const { longitude, latitude } = app.tapData(e)
    wx.chooseLocation({
      latitude,
      longitude,
      success: (res) => {
        console.log('res', res)
        const locationSrc = '' + res.longitude + ',' + res.latitude
        this.setData({
          ['info.addressLatlog']: locationSrc,
          ['info.area']: res.address
        })
      }
    })
  },
  //
  confirm() {
    const res = this.validate(this.data.rules)
    if (res) {
      if (this.data.type === 'edit') {
        request
          .edit(this.data.info)
          .then((res) => {
            app.toastSuccess('修改成功！')
            this.changeParentData()
          })
          .catch((err) => {})
      } else {
        request
          .add(this.data.info)
          .then((res) => {
            app.toastSuccess('添加成功！')
            this.changeParentData()
          })
          .catch((err) => {})
      }
    }
  },
  changeParentData() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      const beforePage = pages[pages.length - 2]
      beforePage.changeData()
    }
  },
  // 验证
  validate(rules) {
    for (let i = 0; i < rules.length; i++) {
      if (!this.data.info[rules[i].name]) {
        app.toastFail(rules[i].message)
        return false
      }
    }
    return true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    if (o.type === 'edit') {
      const tempInfo = JSON.parse(o.info)
      const location = tempInfo.addressLatlog.split()
      tempInfo.longitude = location[0] // 经度
      tempInfo.latitude = location[1] // 纬度
      this.setData({
        info: tempInfo
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
