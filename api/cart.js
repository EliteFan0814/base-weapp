import { fly } from '../utils/request'

const requestApi = {
  // 获取购物车列表
  getCartList() {
    return fly.get('/api/Cart/List')
  },
  // 购物车数量
  cartAdd(id, count) {
    return fly.post('/api/Cart/AddOrDeductProduct', { id, count })
  },
  // 单个删除购物车
  cartDeleteByOne(id) {
    return fly.post('/api/Cart/Delete', id)
  }
}
export default requestApi
