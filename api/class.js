import { fly } from '../utils/request'

const requestApi = {
  // 获取分类列表
  getClassList() {
    return fly.get('/api/ProductType/List')
  },
  //获取单个分类列表
  getClassItemList(page, pageSize = 10) {
    return fly.get('/api/ProductInfo/List', { page, pageSize })
  }
}
export default requestApi
