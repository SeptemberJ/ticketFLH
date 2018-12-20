//index.js
//获取应用实例
const util = require('../../utils/util.js')
var model = require('../../model/model.js')

var show = false;
var item = {};

const app = getApp()
Page({
  data: {   
    date: "2016-09-01",    
    array: [{
    message: 'foo',
  }, {
    message: 'bar'
  }], 
    staff:[ {firstName: 'Hulk', lastName: 'Hu'},{firstName: 'Hulk2', lastName: 'Hu2'},{firstName: 'Hulk3', lastName: 'Hu3'}],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item: {
      show: show
    }
  
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function() {
    console.log('form发生了reset事件')
  },
  // changetolog:function(){
  //   // wx.redirectTo({
  //   //   url:'/pages/register/register'
  //   // })关闭当前页面不能返回前一个页面
  //   wx.navigateTo({
  //     url:'/pages/register/register'
  //   })//保留当前页面能返回前一个页面
  // },
  showTopTips: function(){
    var that = this;
    this.setData({
        showTopTips: true
    });
    setTimeout(function(){
        that.setData({
            showTopTips: false
        });
    }, 3000);
},
bindDateChange: function (e) {
  this.setData({
      date: e.detail.value
  })
},
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
 
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },
  onReachBottom: function (){
  },
  nono: function (){},
  wx: wx.getStorage({
    key: 'index',
    success: function (res) {console.log(res) },
    fail: function (res) { },
    complete: function (res) { },
  }), 
})
