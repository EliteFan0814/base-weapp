const app = getApp()
Page({
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    navOpacity: 0
  },
  onPageScroll: function (e) {
    let a = e.scrollTop / 60
    if (a >= 1) a = 1
    this.setData({
      navOpacity: a
    })
  }
})
