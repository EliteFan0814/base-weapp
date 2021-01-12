// pages/leaveMessage/leaveMessage.js
import request from '../../api/personal'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    contact: '',
    phone: '',
    content: '',
    autosize: {
      maxHeight: 200,
      minHeight: 50
    }
  },
  change(e){
    app.setData(e, this)
  },
  submit(){
    let {contact, phone, content} = this.data;
    if(!contact){
      return app.toastFail('请输入姓名')
    }
    if(!phone){
      return app.toastFail('请输入联系方式')
    }
    if(!content){
      return app.toastFail('请输入意见建议')
    }
    request.leaveMsg(contact, phone, content).then(res=>{
      if(res.success){
        this.setData({
          contact: '',
          phone: '',
          content: '',
        })
        app.toastSuccess('留言成功');
      }
    })
  }

})
