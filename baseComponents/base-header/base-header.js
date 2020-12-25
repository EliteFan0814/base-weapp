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
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    navOpacity: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleBack() {
      if(this.data.showLeft){
        wx.navigateBack({
          delta: 1
        })
      }
    }
  }
})
