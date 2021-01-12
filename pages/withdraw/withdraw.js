const app = getApp()
import request from '../../api/team'


Page({
  data: {
    wayList: [{
      text: '请选择',
      value: '',
    },{
      text: '微信',
      value: 'WX',
    },{
      text: '支付宝',
      value: 'ALI',
    },{
      text: '银行卡',
      value: 'BANK',
    }],
    way: '',
    money: null,
    trueName: '',
    cardId: '',
    bankAccount: '',
    outQrCode: '',
    // minCash: 0,
    amount: {},
    lists: [],
    info: [],
    cash_shouxu: '',
    shouxu: 0,
  },

  onLoad: function () {
    this.getInfo()
    this.getOutFee()
  },
  onShow() {
    this.getData()
  },
  getOutFee(){
    request.getOutFee().then((res) => {
      this.setData({
        cash_shouxu: res.value
      })
    })
  },
  getInfo() {   //获取个人信息
    request.getInfo().then((res) => {
      if (res.success) {
        this.setData({
          info: res.value.value,
          amount: res.value.account,
          // minCash: res.value.param.cash_min,
        })
        // 普通用户
      } else {
        app.toastFail(res.msg)
      }
    })
  },
  getData() { //获取提现账户列表
    request.getOutAccount({way: this.data.way}).then((res) => {
      if (res.value != null) {
        let {trueName, cardId, outQrCode, bankAccount} = res.value
        this.setData({
          trueName,
          cardId,
          outQrCode,
          bankAccount
        })
      }else{
        this.setData({
          trueName: '',
          cardId: '',
          outQrCode: '',
          bankAccount: '',
        })
      }
    })
  },

  upImg(e){
    app.wxUpImg().then(res=>{
      console.log(res);
      this.setData({
        outQrCode: res.value.hostPath[0],
      })
    })
  },

  onChange(e) {
    this.setData({
      way: e.detail,
    })
    this.getData()
  },
  // 文本框赋值
  setInputVal(e) {
    app.setData(e, this);
    const {name} = e.currentTarget.dataset;
    if(name == "money"){
      const {money, cash_shouxu} = this.data;
      let shouxu = money * cash_shouxu / 100;
      this.setData({shouxu})
    }
  },
  submit() {
    const {way, money, trueName, cardId,outQrCode,bankAccount ,amount} = this.data;
    const _money = Number(money)
    const _amount = Number(amount.leaderAccount)
    // 判断余额相关
    if(!way){
      return app.toastFail('请选择提现方式');
    }
    if (_money) {
      // if (_money < _minCash) {
      //   return app.toastFail('最低提现金额' + this.data.minCash + '元')
      // }
      if (_money > _amount) {
        return app.toastFail('提现金额超出余额')
      }
    } else {
      return app.toastFail('请输入提现金额')
    }
    let item = {
      way, money, trueName, cardId,outQrCode, bankAccount
    }
    console.log((way == 'ALI' || way == 'WX') && !outQrCode);
    if(!trueName){
      return app.toastFail('请输入真实姓名');
    }else if(!cardId){
      return app.toastFail('请输入提现账号');
    }else if ((way == 'ALI' || way == 'WX') && !outQrCode) {
      return app.toastFail('请上传收款码');
    } else if(way == 'BANK' && !bankAccount){
      return app.toastFail('请输入开户行');
    }
    // if(way != 'BANK'){
    //   delete item.outQrCode;
    // }else if(way == 'ALI' || way == 'WX'){
    //   delete item.bankAccount
    // }
    request.applyWith(item).then((res) => {
      if (res.success) {
        app.toastSuccess('申请成功')
        this.setData({
          money: '',
          shouxu: 0,
          way: '',
          ['amount.leaderAccount']: amount.leaderAccount - money,
          trueName: '',
          cardId: '',
          bankAccount: '',
          outQrCode: '',
        })
      } else {
        app.toastFail(res.msg)
      }
    })
  },
})