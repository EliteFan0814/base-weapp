import { fly } from '../utils/request'

const requestApi = {
  // 获取购物车信息
  getCartInfo(cartIds) {
    return fly.post('/api/Cart/GetCartProduct', cartIds)
  },
  // 获取默认地址
  getDefaultAddress() {
    return fly.post('/api/MemberAddress/LoadDefualt')
  },
  // 结算购物车
  buyCart(CartId, AddressId, SelectDate) {
    return fly.post('/api/ProductOrder/CartSettled', { CartId, AddressId, SelectDate })
  }
}
export default requestApi
