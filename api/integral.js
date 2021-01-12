import { fly } from '../utils/request'

const requestApi = {
  // 获取分类列表
  getClassList() {
    return fly.get('/api/IntegralGoods/TypeList')
  },
  // 商品列表
  goodsList(page, pageSize, typeId) {
    return fly.get('/api/IntegralGoods/GoodsList', { page, pageSize, typeId })
  },
  // 商品详情
  goodDetail(goodsId) {
    return fly.get('/api/IntegralGoods/GetOneGoods', { goodsId })
  },
  // 购买
  buyGood(data) {
    return fly.post('/api/integralOrder/CreateOrder', data)
  }
}
export default requestApi
