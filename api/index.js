import { fly } from '../utils/request'

const requestApi = {
  // 获取轮播图
  getCarouseList() {
    return fly.get('/api/Carousel/All')
  },
  // 获取分类列表
  getClassList() {
    return fly.get('/api/ProductType/List')
  }
}
export default requestApi
