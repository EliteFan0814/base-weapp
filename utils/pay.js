const pay = {
  wxPay(info) {
    console.log('info', info)
    wx.showLoading({
      title: '支付中',
      mask: true
    })
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: info.timeStamp,
        nonceStr: info.nonceStr,
        package: info.package,
        signType: info.signType,
        paySign: info.paySign,
        success(res) {
          wx.hideLoading()
          resolve(res)
        },
        fail(res) {
          console.log('微信fail', res)
          wx.hideLoading()
          reject(res)
        }
      })
    })
  }
}

export default pay
