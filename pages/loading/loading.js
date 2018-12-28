// pages/loading/loading.js
var url = 'https://www.lzyts.com/ticketJK/'
const util = require('../../utils/util.js')
var appjs = require('../../app.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: res => {
        console.log(res)
        var code = res.code;
        //debugger
        wx.request({
          url: appjs.url + 'getOpen_id',
          method: "get",
          header: {
            //传输接收数据的头（！！！）
            // "Content-Type": "application/text"
            'content-type': 'application/json'
            // "Content-Type": "json"
            // 'content-type': 'application/x-www-form-urlencoded'
          },
          data:
            {
              code: res.code,
            },
          success: function (res) {
            var getopenid = res.data.openid;
            wx: wx.setStorage({
              key: 'getopenid',
              data: { 'getopenid': getopenid },
            })
            app.globalData.openid = getopenid
            //获取用户信息，根据返回信息中是否有手机号 判断用户是否是否已经绑定手机号
            wx.request({
              url: appjs.url + 'userInfo',
              method: "get",
              header: {
                'content-type': 'application/json'
              },
              data:
                {
                  open_id: getopenid,
                },
              success: function (res) {
                if (res.data.code == 0) {
                  wx.hideLoading()
                  wx.showModal({
                    content: '去绑定',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.redirectTo({
                          url: '/pages/register/register'
                        })//保留当前页面能返回前一个页面
                      }
                    }
                  })
                } else if (res.data.code == 2) {
                  wx.hideLoading()
                  wx.showModal({
                    content: 'openid未传',
                    showCancel: false,
                    success: function (res) {
                    }
                  })
                } else {
                  app.globalData.fstatus = res.data.userInfo.fstatus
                  if (res.data.userInfo.fdelete == 1) {
                    wx.redirectTo({
                      url: '/pages/cancellation/cancellation'
                    })
                    return false
                  }
                  if (res.data.userInfo.fstatus == 0) {
                    wx.hideLoading()
                    wx.showModal({
                      content: '您的账号还未通过审核',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          wx.redirectTo({
                            url: '/pages/register/register'
                          })
                        }
                      }
                    })
                    return false
                  } else {
                    wx.switchTab({
                      url: '/pages/index/index'
                    })
                  }
                  wx.request({
                    url: url + 'selectorderlog?fopenid=' + app.globalData.openid,
                    method: "get",
                    header: {
                      //传输接收数据的头（！！！）
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      if (res.data.orderloglist.length == 0) {
                        console.log('===res----------')
                        wx.showToast({
                          title: '没有历史记录！',
                          icon: 'none',
                          duration: 1500
                        })
                        // 判断是否重复  ，  如果重复的话 从列表中删去
                      } else {
                        console.log(res.data.orderloglist)
                        wx: wx.setStorage({
                          key: 'orderloglist',
                          data: { 'orderloglist': res.data.orderloglist[0] },
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})