// 判断数据类型
const checkType = function (yourData, dataType) {
  const type = Object.prototype.toString.call(yourData).slice(8, -1)
  return type === dataType
}
const getElementWH = function (name) {
  return new Promise((resolve, reject) => {
    let query = wx.createSelectorQuery()
    let result = {}
    query.select(name).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      result = {
        height: res[0].height,
        width: res[0].width
      }
      resolve(result)
    })
  })
}
export default { checkType, getElementWH }
