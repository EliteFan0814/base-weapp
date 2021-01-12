import { fly } from '../utils/request'

const requestApi = {
  // 获取个人信息
  getUserInfo() {
    return fly.get('/api/Member/GetOne')
  },
  // 签到
  handleSign() {
    return fly.post('/api/integralOrder/MemberSign')
  },
  // 获取签到天数
  getSignDays() {
    return fly.get('/api/integralOrder/SignDays')
  },
  // 绑定微信信息
  bindWx(NickName, AvatarUrl) {
    return fly.post('/api/Member/BindWxInfo', { NickName, AvatarUrl })
  },
  // 更新头像
  changeAvatar() {
    return fly.post('/api/Member/UpdateHeader')
  },
  // 绑定手机
  bindPhone(EncryptedData, Iv) {
    return fly.post('/api/Member/BindMobile', { EncryptedData, Iv })
  },
  // 公告列表
  noticeList(page, pageSize) {
    return fly.get('/api/Article/List', { page, pageSize })
  },
  // 公告详情
  noticeInfo(id) {
    return fly.get('/api/Article/GetOne', { id })
  },
  // 我的团队
  teamList(page, pageSize) {
    return fly.get('/api/Member/MyGroup', { page, pageSize })
  },
  // 订单列表
  orderList(page, pageSize, status, orderId) {
    return fly.get('/api/ProductOrder/List', { page, pageSize, status, orderId })
  },

  // 联系平台电话
  getPhone() {
    return fly.get('/api/SystemSettings/GetServicePhone')
  },

  // 留言
  leaveMsg(Contact, Phone, Content) {
    return fly.post('/api/Suggestion/Create', { Contact, Phone, Content })
  },
  // 团长申请
  applyTeam(trueName, mobile, cardId, cardIdFront, cardIdBack) {
    return fly.post('/api/MemberGroupApply/ApplyToLeader', { trueName, mobile, cardId, cardIdFront, cardIdBack })
  },
  // 团长申请状态
  applyStatus() {
    return fly.get('/api/MemberGroupApply/GetApplyStatus', {})
  },
  // 推广
  spread() {
    return fly.get('/api/Wx/QrInfo', {})
  }
}
export default requestApi
