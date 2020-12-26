import { fly } from '../utils/request'

const requestApi = {
  // 获取个人信息
  getUserInfo() {
    return fly.get('/api/Member/GetOne')
  },
  // 绑定微信信息
  bindWx(NickName,AvatarUrl) {
    return fly.post('/api/Member/BindWxInfo',{NickName,AvatarUrl})
  },
  // 更新头像
  changeAvatar() {
    return fly.post('/api/Member/UpdateHeader')
  },
  // 绑定手机
  bindPhone(EncryptedData, Iv) {
    return fly.post('/api/Member/BindMobile', { EncryptedData, Iv })
  }
}
export default requestApi
