// baseComponents/base-btn/base-btn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navOpacity: {
      type: Number,
      value: 0
    }
  },
  // 向外暴露css class 类，方便父组件接管自定义组件样式
  externalClasses: ['search-style'],
  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap() {
      this.triggerEvent('handleTap')
    }
  }
})
