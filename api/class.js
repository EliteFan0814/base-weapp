import { fly } from '../utils/request'

const requestApi = {
  // 获取分类列表
  getClassList() {
    return fly.get('/api/ProductType/List')
  },
  //获取单个分类列表
  getClassItemList(page, pageSize = 10, productTypeId) {
    return fly.get('/api/ProductInfo/memberList', { page, pageSize, productTypeId })
  }
}
export default requestApi
