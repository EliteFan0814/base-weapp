const app = getApp()
import {
  hotKeywordsList
} from '../../api/class'
Page({
  data: {
    value: '',
    historyList: [],
    hotList: [],
  },

  onLoad: function (option) {
    wx.getStorage({
      key: 'searchVal',
      success: (res) => {
        this.setData({
          historyList: res.data,
        })
      },
    })
    this.getHotList()
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    })
  },
  onSearch(e) {
    if (this.data.value) {
      this.storage()
      this.open(this.data.value)
    } else {
      app.toastFail('请输入你要搜索的物品')
    }
  },

  // 获取热门搜索
  getHotList() {
    hotKeywordsList().then(res => {
      const hotKeywords = res.data.info.value_str
      if (hotKeywords.length) {
        this.setData({
          hotList: res.data.info.value_str
        })
      }
    })
  },
  // 储存
  storage() {
    let list = this.data.historyList || []
    // 如果之前没搜过就存入localstorage
    if (this.isContrast(list)) {
      list.unshift(this.data.value)
      list = this.isOverstep(list)
      this.setData({
        historyList: list,
      })
      wx.setStorage({
        key: 'searchVal',
        data: this.data.historyList,
      })
    }
  },

  // 判断是否搜索过当前关键字
  isContrast(list) {
    if (list.indexOf(this.data.value) == -1) {
      return true
    } else {
      return false
    }
  },

  // 判断搜索历史超出10个了
  isOverstep(list) {
    if (list.length < 10) {
      return list
    } else {
      list.splice(list.length - 1, 1)
      return list
    }
  },

  cloes() {
    this.setData({
      historyList: [],
    })
    wx.setStorage({
      key: 'searchVal',
      data: [],
    })
  },

  clickItem(e) {
    let val = e.currentTarget.dataset.item
    this.open(val)
  },

  open(val) {
    wx.navigateTo({
      url: `/pages/searchResults/searchResults?value=${val}`,
    })
  },
})