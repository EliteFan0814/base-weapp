// pages/teamAccount/teamAccount.js
import request from '../../api/team'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    tabList: [
      {name: '佣金账单', value: '2'},
      {name: '提现记录', value: '3'},
    ],
    active: 0,
    scrollTop: 0,
    status: '2',
    page: 1,
    list: [],
    totalPage: 1,
    account: {},
    activeNames: '',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onShow(){
    this.setData({
      page: 1
    })
    this.getInfo()
    this.getData()
  },
  getInfo() {   //获取个人信息
    request.getInfo().then((res) => {
      if (res.success) {
        this.setData({
          account: res.value.account,
        })
        // 普通用户
      } else {
        app.toastFail(res.msg)
      }
    })
  },
  getData(type){
    
    if(this.data.status == 2){
      this.getAccountList(type);
    }else{
      this.getWithList(type);
    }
  },
  getAccountList(type){
    let {list, page} =  this.data
    request.getAccountList({
      page,
      rows: 10,
      way: 2
    }).then((res) => {
      const {data, totalPage} = res.value;
      if(type == 'down'){
        list.push(...data);
        this.setData({
          list,
          totalPage,
          loading: false
        })
      }else{
        this.setData({
          list: data, 
          totalPage,
          loading: false
        })
      }
    })
  },

  getWithList(type){  //提现记录
    let {list, page} =  this.data
    request.getWithList({
      page,
      rows: 10,
    }).then((res) => {
      const {data, totalPage} = res.value;
      if(type == 'down'){
        list.push(...data);
        this.setData({
          list,
          totalPage,
          loading: false
        })
      }else{
        this.setData({
          list: data, 
          totalPage,
          loading: false
        })
      }
    })
  },
  onChange(e) {
    this.setData({
      activeNames: e.detail,
    })
  },

  tabClick(e){
    let {index, value} = e.currentTarget.dataset;
    this.setData({
      scrollTop: 0,
      active: index,
      status: value,
      page: 1,
    })
    this.getData();
  },

  open(){
    wx.navigateTo({url: '/pages/withdraw/withdraw'})
  },

  loadMore() {
    if(this.data.loading) return;
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getData('down')
      this.setData({
        loading: true
      })
    }
  },
})