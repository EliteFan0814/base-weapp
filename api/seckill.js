import { fly } from '../utils/request'

const requestApi = {
  // 获取秒杀时刻表
  getPeriodList() {
    return fly.get('/api/Seckill/GetAllPeriod')
  },
  // 获取秒杀列表
  getPeriodGoodsList(page, pageSize, timeSpan) {
    return fly.get('/api/Seckill/SeckillList', { page, pageSize, timeSpan })
  }
}
export default requestApi
