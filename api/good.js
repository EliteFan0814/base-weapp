import { fly } from '../utils/request'

const requestApi = {
  // 获取商品详情
  getGoodInfo(productId) {
    return fly.get('/api/ProductInfo/GetOne', { productId })
  },
  // 获取商品规格
  getGoodSpec(productId) {
    return fly.get('/api/ProductInfo/GetProductBySku', { productId })
  },
  // 加入购物车
  addToCart(productId, count, skuId, seckillSkuId) {
    return fly.post('/api/Cart/Add', { productId, count, skuId, seckillSkuId })
  },
  // 购物车增加数量
  cartAdd(id, count) {
    return fly.post('/api/Cart/AddOrDeductProduct', { id, count })
  }
}
export default requestApi
