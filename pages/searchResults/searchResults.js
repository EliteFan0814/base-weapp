import {
  classSecondList
} from '../../api/class'
Page({
  data: {
    page: 1,
    rows: 5,
    totalPage: 0,
    sort: 'def_desc',
    keywords: '',
    secondList: [],
    sortList: [{
        name: '综合',
        isSortUp: true,
        value: 'def_esc',
        downValue: 'def_desc'
      },
      {
        name: '销量',
        isSortUp: true,
        value: 'xiao_esc',
        downValue: 'xiao_desc'
      },
      {
        name: '价格',
        isSortUp: true,
        value: 'price_esc',
        downValue: 'price_desc'
      },
    ],
    selectIndex: 0,
    showNoList: false
  },
  // load初始化
  onLoad(options) {
    // wx.setNavigationBarTitle({
    //   title: options.className //页面标题为路由参数
    // })
    this.setData({
      keywords: options.value
    })
    this.getSecondClassList(false)
  },
  togoodsdetail(e) {
    wx.navigateTo({
      url: `/pages/goodsDetails/goodsDetails?goodsId=${e.currentTarget.dataset.id}`,
    })
  },
  // 更改查询关键字
  changeKeywords(e) {
    this.setData({
      keywords: e.detail
    })
  },
  // 点击搜索
  searchNewGood() {
    this.clearKeywords
    this.getSecondClassList(false)
  },
  // 清除查询关键字,清除所有数据
  clearKeywords() {
    this.setData({
      keywords: ''
    })
    this.clearAllInfo()
  },
  // 搜索时清空
  clearAllInfo() {
    this.setData({
      page: 1,
      secondList: [],
      selectIndex: 0
    })
  },
  // 获取二级分类列表
  getSecondClassList(isInfinity) {
    classSecondList({
      page: this.data.page,
      rows: this.data.rows,
      sort: this.data.sort,
      keywords: this.data.keywords
    }).then(res => {
      //判断是否展示数据为空时的图片
      if (res.data.list.length) {
        this.setData({
          showNoList: false
        })
      } else {
        this.setData({
          showNoList: true
        })
      }
      // 如果滑动到底部触发无限加载
      if (isInfinity) {
        this.setData({
          secondList: [...this.data.secondList, ...res.data.list]
        })
      } else { // 否则为第一次加载
        this.setData({
          secondList: res.data.list,
        })
      }
      this.setData({
        // sortScreen: res.data.sort_screen,
        totalPage: res.data.page_total,
      })
    })
  },
  // 处理排序按钮正序倒序选择
  sortSelect(e) {
    this.setData({
      secondList: []
    })
    wx.pageScrollTo({
      scrollTop: 0
    })

    const nowSelectIndex = e.currentTarget.dataset.index
    const flag = `sortList[${nowSelectIndex}].isSortUp`
    this.data.page = 1
    // 如果点击的是同一个分类，则触发切换顺序
    if (nowSelectIndex == this.data.selectIndex) {
      this.setData({
        [flag]: !this.data.sortList[nowSelectIndex].isSortUp
      })
    }
    // 标记当前选中项
    this.setData({
      selectIndex: nowSelectIndex,
    })
    // 根据所做出的选择更改 sort 排序查询关键字
    if (this.data.sortList[this.data.selectIndex].isSortUp) {
      this.setData({
        sort: this.data.sortList[this.data.selectIndex].value
      })
    } else {
      this.setData({
        sort: this.data.sortList[this.data.selectIndex].downValue
      })
    }
    this.getSecondClassList(false)
  },

  // 触底触发无限加载
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getSecondClassList(true)
    }
  },
})