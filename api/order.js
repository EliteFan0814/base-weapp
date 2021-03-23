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
  buyCart(CartId, AddressId, SelectDate, selfPickUp) {
    return fly.post('/api/ProductOrder/CartSettled', { CartId, AddressId, SelectDate, selfPickUp })
  },
  // 结算立即购买
  buyNow(SkuId, Count, AddressId, SelectDate, SeckillSkuId, selfPickUp) {
    return fly.post('/api/ProductOrder/PayImmediately', {
      SkuId,
      Count,
      AddressId,
      SelectDate,
      SeckillSkuId,
      selfPickUp
    })
  },
  // 结算积分兑换
  buyExchange(AddressId, GoodsId, GoodsCount) {
    return fly.post('/api/integralOrder/CreateOrder', { AddressId, GoodsId, GoodsCount })
  },
  // 获取支付单
  getOrder(id) {
    return fly.post('/api/ProductOrder/GetPayOrder', id)
  },
  // 取消订单
  cancalOrder(id) {
    return fly.post('/api/ProductOrder/Cancel', id)
  },
  // 确认收货
  confirm(id) {
    return fly.post('/api/ProductOrder/Confirm', id)
  },
  // 详情
  details(orderId) {
    return fly.get('/api/ProductOrder/GetOne', { orderId })
  },
  // 获取时间段
  getTimes() {
    return fly.get('/api/DeliveryTime/GetTimes')
  },
  // 退款
  refund(orderId) {
    return fly.post('/api/ProductOrder/RefundOrder', orderId)
  },
  // 获取积分订单列表
  getExchangeOrderList(page, pageSize, status, memberId) {
    return fly.get('/api/integralOrder/OrderList', { page, pageSize, status, memberId })
  },
  // 积分订单确认收货
  confirmGetExchange(id) {
    return fly.post('/api/integralOrder/ConfirmReceipt', id)
  },
  // 积分订单详情
  exchangeOrderDetail(orderId) {
    return fly.get('/api/integralOrder/GetOneOrder', { orderId })
  },
  // 积分流水
  exchangeRecord(page, pageSize, type, isIncome) {
    return fly.get('/api/integralOrder/IntegralDetail', { page, pageSize, type })
  },
  // 获取自提地址
  getSelfGetInfo() {
    return fly.get('/api/SystemSettings/GetPickUpInfo')
  },

}
export default requestApi
