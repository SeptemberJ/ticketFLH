// var url = 'http://205.168.1.103:8082/'
var url = 'https://www.lzyts.com/ticketJK/'

module.exports = {
  url: url
}

//app.js
App({
  onLaunch: function () {
    var _this = this;
    // _this.globalData.loadingHidden = false
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res)
    //     var code = res.code;
    //     //debugger
    //     wx.request({
    //       url: url + 'getOpen_id',
    //       method: "get",
    //       header: {
    //         //传输接收数据的头（！！！）
    //         // "Content-Type": "application/text"
    //         'content-type': 'application/json'
    //         // "Content-Type": "json"
    //         // 'content-type': 'application/x-www-form-urlencoded'
    //       },
    //       data: 
    //         {
    //           code: res.code,
    //         },
    //       success: function (res) {
    //         var getopenid = res.data.openid;
    //         wx: wx.setStorage({
    //           key: 'getopenid',
    //           data: { 'getopenid': getopenid},
    //         })
    //         _this.globalData.openid = getopenid
    //         //获取用户信息，根据返回信息中是否有手机号 判断用户是否是否已经绑定手机号
    //         wx.request({
    //           url: url + 'userInfo',
    //           method: "get",
    //           header: {
    //             'content-type': 'application/json'
    //           },
    //           data:
    //           {
    //             open_id: _this.globalData.openid,
    //           },
    //           success: function (res){
    //             if (res.data.code == 0) {
    //                 wx.showModal({
    //                 content: '去绑定',
    //                 showCancel: false,
    //                 success: function (res) {
    //                   if (res.confirm) {
    //                     wx.redirectTo({
    //                       url: '/pages/register/register'
    //                     })//保留当前页面能返回前一个页面
    //                   }
    //                 }
    //               })
    //             }else{
    //               _this.globalData.fstatus = res.data.userInfo.fstatus
    //               if (res.data.userInfo.fdelete == 1) {
    //                 wx.redirectTo({
    //                   url: '/pages/cancellation/cancellation'
    //                 })
    //                 return false
    //               }
    //               if (res.data.userInfo.fstatus == 0){
    //                 wx.showModal({
    //                   content: '您的账号还未通过审核',
    //                   showCancel: false,
    //                   success: function (res) {
    //                     if (res.confirm) {
    //                       wx.redirectTo({
    //                         url: '/pages/register/register'
    //                       })
    //                     }
    //                   }
    //                 })
    //                 return false
    //               }
    //               wx.request({
    //               url: url + 'selectorderlog?fopenid=' + _this.globalData.openid,
    //               method: "get",
    //               header: {
    //                 //传输接收数据的头（！！！）
    //                 'content-type': 'application/json'
    //               },
    //               success: function (res) {
    //                 if (res.data.orderloglist.length == 0) {
    //                   console.log('===res----------')
    //                   wx.showToast({
    //                     title: '没有历史记录！',
    //                     icon: 'none',
    //                     duration: 1500
    //                   })
    //                   // 判断是否重复  ，  如果重复的话 从列表中删去
    //                 } else {
    //                   console.log(res.data.orderloglist)
    //                   wx: wx.setStorage({
    //                     key: 'orderloglist',
    //                     data: { 'orderloglist': res.data.orderloglist[0] },
    //                   })
    //                 }
    //               }
    //             })
    //             }
    //           }
    //         }) 
    //       }
    //     })
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }      
    // })

    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        //登录态过期
        wx.login() //重新登录
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
              _this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  
  globalData: {
    userInfo: null,
    openid: null,
    fstatus: null
    // avatarUrl:[]
  }
})