// baseComponents/base-header.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '标题'
    },
    navOpacity: {
      type: Number,
      value: 1
    },
    showLeft: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    navOpacity: 0,
    canBack: true
  },
  ready: function () {
    this.getPages()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleBack() {
      if (this.data.showLeft) {
        if (this.data.canBack) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.switchTab({ url: '/pages/index/index' })
        }
      }
    },
    getPages() {
      const pages = getCurrentPages()
      console.log('pages.length', pages.length)
      if (pages.length <= 1) {
        this.setData({
          canBack: false
        })
      } else {
        this.setData({
          canBack: true
        })
      }
    }
  }
})
