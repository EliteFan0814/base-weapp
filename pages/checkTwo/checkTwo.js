// pages/leaveMessage/leaveMessage.js
import request from '../../api/personal'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    trueName: '',
    mobile: '',
    cardId: '',
    cardIdFront: '',
    cardIdBack: '',
  },
  onLoad(options){
    this.setData({
      cardIdFront: options.id_front,
      cardIdBack: options.id_back,
    })
  },
  change(e){
    app.setData(e, this)
  },
  submit(){
    let {trueName, mobile, cardId, cardIdFront, cardIdBack} = this.data;
    if(!trueName){
      return app.toastFail('请输入姓名')
    }
    if(!mobile){
      return app.toastFail('请输入联系电话')
    }
    if(!cardId){
      return app.toastFail('请输入身份证号')
    }
    request.applyTeam(trueName, mobile, cardId, cardIdFront, cardIdBack).then(res=>{
      if(res.success){
        this.setData({
          trueName: '',
          mobile: '',
          cardId: '',
        })
        app.toastSuccess('申请成功');
        setTimeout(()=>{
          wx.navigateTo({url: '/pages/personal.personal'})
        }, 1000)
      }
    })
  }

})
