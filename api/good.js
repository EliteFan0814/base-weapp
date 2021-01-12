import { fly } from '../utils/request'

const requestApi = {
  // 统一获取商品详情，不分普通和秒杀
  getGoodInfoAll(productID) {
    return fly.get('/api/ProductInfo/getProduct', { productID })
  },
  // 获取商品详情
  getGoodInfo(productId) {
    return fly.get('/api/ProductInfo/GetOne', { productId })
  },
  // 获取秒杀商品详情
  getGoodInfoSeckill(seckillId) {
    return fly.get('/api/Seckill/GetSeckillInfo', { seckillId })
  },
  // 获取商品规格
  getGoodSpec(productId) {
    return fly.get('/api/ProductInfo/GetSkuByProduct', { productId })
  },
  // 加入购物车
  addToCart(productId, count, skuId, seckillSkuId) {
    return fly.post('/api/Cart/Add', { productId, count, skuId, seckillSkuId })
  },
  // 购物车增加数量
  cartAdd(id, count) {
    return fly.post('/api/Cart/AddOrDeductProduct', { id, count })
  },

  // 获取购买记录
  getBuyRecord(productId) {
    return fly.get('/api/ProductInfo/ProductBuyRecord', { productId })
  }
}
export default requestApi
