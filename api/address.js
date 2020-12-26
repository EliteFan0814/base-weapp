import { fly } from '../utils/request'

const requestApi = {
  // 获取地址列表
  getAddressList() {
    return fly.get('/api/MemberAddress/All')
  },
  // 获取默认
  getDefault() {
    return fly.post('/api/MemberAddress/LoadDefualt')
  },
  // 添加地址
  add(data) {
    return fly.post('/api/MemberAddress/Add', data)
  },
  // 修改地址
  edit(data) {
    return fly.post('/api/MemberAddress/Modify', data)
  },
  // 删除地址
  delete(id) {
    return fly.post('/api/MemberAddress/Delete', id)
  },
  // 设置默认地址
  setDefault(id) {
    return fly.post('/api/MemberAddress/SetDefualt', id)
  }
}
export default requestApi
