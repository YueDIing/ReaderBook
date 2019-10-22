/* console.log(`%c 
      ."\`".
  .-./ _=_ \\.-.
 {  (,(oYo),) }}
 {{ |   "   |} }
 { { \\(---)/  }}           神兽镇压
 {{  }'-=-'{ } }                代码无BUG
 { { }._:_.{  }}
 {{  } -:- { } }
 {_{ }\`===\`{  _}
((((/)     (\\))))
`, 'color: red;'); */
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    timestamp: new Date().getTime()
  },
  fillCharacter (number = 0, sum = 2, character = '0') {
    return number.toString().padStart(2, '0')
  },
  dateTostr (timestamp) {
    timestamp = (timestamp.toString().length === 10) ?  timestamp * 1000 : timestamp
    const t = new Date(timestamp);
    const y = t.getFullYear();
    const m = this.fillCharacter(t.getMonth() + 1);
    const d = this.fillCharacter(t.getDay());
    const h = this.fillCharacter(t.getHours());
    const i = this.fillCharacter(t.getMinutes());
    const s = this.fillCharacter(t.getSeconds());
    return {
      t,
      y,
      m,
      d,
      h,
      i,
      s,
      date: `${y}-${m}-${d}`,
      time: `${h}:${i}:${s}`,
      dateTime: `${y}-${m}-${d} ${h}:${i}:${s}`
    }
  }
})