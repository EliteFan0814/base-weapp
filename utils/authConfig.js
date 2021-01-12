export default {
  loginUrl: '/api/Wx/GetAuth', // 换取code的路径
  codeName: 'jscode', // 配置code的字段名
  haveInvite: true, // 是否有推广注册的功能
  inviteCodeName: 'inviteCode', //推广关系码字段名
  inviteCode: null, //推广关系码
  sceneInfo: null, // 存储启动小程序时的场景信息

  // 获取场景信息
  setSceneInfo(info) {
    // 有推荐注册的功能
    if (this.haveInvite) {
      // this.inviteCode = info.query[this.inviteCodeName] || ''
      this.sceneInfo = info
      // 如果是通过分享打开则可以直接从query中获取推广码
      if (info.query[this.inviteCodeName]) {
        this.inviteCode = info.query[this.inviteCodeName]
      } else if (info.query.scene) {
        // 如果是通过扫描二维码
        this.inviteCode = info.query.scene
      }
    }
  },
  // 清除场景信息
  clearSceneInfo() {
    this.sceneInfo = null
    this.inviteCode = null
  }
}
