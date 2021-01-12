// pages/noticeList/noticeList.js
import request from '../../api/personal'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    totalPage: 1,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  getData(type){
    const {page, list} = this.data;
    request.noticeList(
      page, 10
      ).then(res=>{
      const {data, totalPage} = res.value;
      if(type == 'down'){
        list.push(...data);
        this.setData({
          list,
          totalPage
        })
      }else{
        this.setData({
          list: data, 
          totalPage
        })
      }
    })
  },

  open(e){
    const {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/notice/notice?id=${id}`
    })
  }

})