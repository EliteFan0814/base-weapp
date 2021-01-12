// pages/check/check.js
import request from '../../api/personal'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardList: [
      {
        name: 'cardIdFront',
        text: '身份证正面照',
        value: '/static/img/check/card-front.png',
        isupdate: false
      },
      {
        name: 'cardIdBack',
        text: '身份证背面照',
        value: '/static/img/check/card-end.png',
        isupdate: false
      }
    ],
    trueName: '',
    mobile: '',
    cardId: '',
    cardIdFront: '',
    cardIdBack: '',
  },

  upImg(e){
    let {imgIndex, imgKey} = e.currentTarget.dataset
    app.wxUpImg().then(res=>{
      console.log(res);
      let {cardList} = this.data;
      console.log(res);
      cardList[imgIndex]['value'] = res.value.hostPath[0]
      this.setData({
        cardList,
        [imgKey]: res.value.pathList[0]
      })
    })
  },
  change(e){
    app.setData(e, this)
  },
  submit(){
    let {trueName, mobile, cardId, cardIdFront, cardIdBack} = this.data;
    if(!cardIdFront){
      return app.toastFail('请上传身份证正面照')
    }
    if(!cardIdBack){
      return app.toastFail('请上传身份证背面照')
    }
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
          wx.switchTab({url: '/pages/personal/personal'})
        }, 1000)
      }
    })
    // wx.navigateTo({
    //   url: `/pages/checkTwo/checkTwo?cardIdFront=${cardIdFront}&cardIdBack=${cardIdBack}`
    // })
  }
})
