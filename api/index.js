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
  get2Day(status) {
    return fly.get('/api/ProductInfo/GetRecommendProduct', { status })
  },
  // 限时秒杀
  getSeckillList(timeSpan) {
    return fly.get('/api/Seckill/GetSeckillProduct', { timeSpan })
  },
  // 普通产品列表
  getCommonList(page, pageSize = 10, searchKey = '') {
    return fly.get('/api/ProductInfo/MemberList', { page, pageSize, searchKey })
  },
  // 获取秒杀期次
  getPeriodDate() {
    return fly.get('/api/Seckill/GetPeriodDate')
  },
  // 推广获取积分
  getIntegral() {
    return fly.post('/api/integralOrder/Share')
  }
}
export default requestApi
