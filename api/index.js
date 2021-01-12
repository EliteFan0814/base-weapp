import { fly } from '../utils/request'

const requestApi = {
  // 获取轮播图
  getCarouseList() {
    return fly.get('/api/Carousel/All')
  },
  // 获取分类列表
  getClassList() {
    return fly.get('/api/ProductType/List')
  },
  // 获取期次
  getPeriodList() {
    return fly.get('/api/Seckill/GetAllPeriod')
  },
  // 今日抢购 明日预告
  getProdList(status) {
    return fly.get('/api/ProductInfo/GetRecommendProduct', { status })
  },
  // 限时秒杀
  getSeckillList() {
    return fly.get('/api/Seckill/GetSeckillProduct')
  },
  // 产品列表
  getCommonList(page, pageSize = 10) {
    return fly.get('/api/ProductInfo/MemberList', { page, pageSize })
  }
}
export default requestApi
