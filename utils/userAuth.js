import { flyForToken } from './request'
import authConfig from './authConfig'

const app = getApp()
let token = wx.getStorageSync('token')
// 获取微信code
function getWxCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
        } else {
          console.log('获取微信code失败' + res.errMsg)
          reject
        }
      }
    })
  })
}
// 用code换取token和其他信息
async function code2Token() {
  try {
    const code = await getWxCode()
    const temp = {}
    // 写入code
    temp[authConfig.codeName] = code
    // 如果需要推广，写入推广码
    if (authConfig.haveInvite) {
      temp[authConfig.inviteCodeName] = authConfig.inviteCode
    }
    const res = await flyForToken.get(authConfig.loginUrl, temp)
    authConfig.clearSceneInfo()
    const tokenRes = res.data
    return {
      token: tokenRes.value.token,
      userInfo: tokenRes.value.user || undefined
    }
    // return tokenRes.value.token
  } catch (err) {
    console.log('用code换取token出错', err)
  }
}
// 换取token和个人信息并存入本地localStorage
async function setTokenSync() {
  try {
    if (!token) {
      const res = await code2Token()
      token = res.token
      wx.setStorageSync('token', res.token)
      app.globalData.userInfo = res.userInfo
    }
    app.globalData.isLogin = true
    return token
  } catch (err) {
    console.log('没有token', err)
    app.globalData.isLogin = false
  }
}
// 暂时删除获取的token值用来做判断（此处并未真正删除localStorage中的token）
function clearHaveToken() {
  token = ''
}

export default {
  setTokenSync,
  clearHaveToken
}
