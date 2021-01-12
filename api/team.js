import { fly } from '../utils/request'

const requestApi = {
  // 提现列表
  getWithList(params) {
    return fly.get('/api/MemberAccount/List', params)
  },
  // 账户流水
  getAccountList(params) {
    return fly.get('/api/MemberAccount/AccountListDetail', params)
  },
  //申请提现
  applyWith(data) {
    return fly.post('/api/MemberAccount/Create', data)
  },
  // 提现手续费
  getOutFee(params) {
    return fly.get('/api/MemberAccount/GetOutFee', params)
  },
  // 提现账户
  getOutAccount(params) {
    return fly.get('/api/MemberAccount/GetOutAccount', params)
  },
  // 用户详情
  getInfo(params) {
    return fly.get('/api/Member/GetOne', params)
  },
}
export default requestApi
