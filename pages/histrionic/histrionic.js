//index.js
//获取应用实例

const util = require('../../utils/util.js')
var model = require('../../model/model.js')
var appjs = require('../../app.js')

var show = false;
var item = {};

const app = getApp()
Page({
  data: {  
    price:2, 
    date: "2016-09-01",    
    array: [{
    message: 'foo',
  }, {
    message: 'bar'
  }], 
    staff:[ {firstName: 'Hulk', lastName: 'Hu'},{firstName: 'Hulk2', lastName: 'Hu2'},{firstName: 'Hulk3', lastName: 'Hu3'}],
    motto: 'Hello WX',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item: {
      show: show
    }
  },
  changetolog:function(){
    wx.navigateTo({
      url:'/pages/register/register'
    })//保留当前页面能返回前一个页面
  },

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
    wx.removeStorageSync('histryArr')    
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    h = h < 10 ? "0" + h : h;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;
    var date9 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
    var _this = this;
    wx.getStorage({
      key: 'Array',
      success: function (res) {
        var Array = res.data;
        _this.setData({
          Array: Array,
        })
      },
    }) 
    
    wx.request({
      url: appjs.url + 'orderList',
      method: "get",
      header: {
        'content-type': 'application/json'
      },
      data:
      {
        open_id: app.globalData.openid,
      },     
      success: function (res) {

        if (res.data.orderlist.length != 0){
          _this.setData({
            orderlist9: res.data.orderlist,
          })
          var neworderlist1 = []
          for (var i = 0; i < _this.data.orderlist9.length; i++) {
            // _this.data.orderlist[i].fcheckStatus = 1
            var date = new Date(_this.data.orderlist9[i].Fqsrq.time);
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var h = date.getHours();
            var mm = date.getMinutes();
            var ss = date.getSeconds();
            if (month >= 1 && month <= 9) {
              month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
            }
            mm = mm < 10 ? "0" + mm : mm;
            ss = ss < 10 ? "0" + ss : ss;
            var date8 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
            console.log(date8)
            _this.data.orderlist9[i].Fqsrq = date8
            console.log(_this.data.orderlist9[i])
            if (date8 > date9){
              _this.data.orderlist9[i].showrefund = 1
              neworderlist1.push(_this.data.orderlist9[i])
            }else{
              _this.data.orderlist9[i].showrefund = 2
              neworderlist1.push(_this.data.orderlist9[i])
            }
          }
          _this.setData({
            orderlist: neworderlist1,
          })
          console.log(_this.data.orderlist)
          wx.setStorage({
            key: 'orderlist',
            data: { 'orderlist': _this.data.orderlist },
          })
          var famount = _this.data.orderlist[0].famount;
          var fstatus = _this.data.orderlist[0].fstatus;
          // console.log("_this.data.orderlist.famount")
          // console.log(_this.data.orderlist[0].famount)
          // console.log(typeof (_this.data.orderlist[0].famount))
          // var num = famount;//定义一个变量num用来存放数字
          // var a = famount % 10;//num对10取余，可得到个位数
          // var b = famount / 10;//num除10得到十位数，由于b为整形，小数位会自动省略
          // console.log(a)
          // console.log(parseInt(b))
          // var famount = parseInt(a) * parseInt(b)
          _this.setData({
            famount: famount,
            fstatus: fstatus,
          })

          wx.showToast({
            title: '订单查询成功',
            icon: 'success',
            duration: 1500
          })
        }else{
          wx.showModal({
            content: '暂无相关订单！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            }
          });
          // wx.showToast({
          //   title: '暂无信息',
          //   icon: 'none',
          //   duration: 1500
          // })
        }
      }
    }) 
    if (app.globalData.userInfo) {
      _this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (_this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          _this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
          // debugger
  },
  onShow:function(){
    wx.removeStorageSync('histryArr')
    var _this = this
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    h = h < 10 ? "0" + h : h;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;
    var date9 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
    wx.request({
      url: appjs.url + 'orderList',
      method: "get",
      header: {
        'content-type': 'application/json'
      },
      data:
        {
          open_id: app.globalData.openid,
        },
      success: function (res) {
        if (res.data.orderlist.length != 0) {
          _this.setData({
            orderlist9: res.data.orderlist,
          })
          console.log(res.data.orderlist)
          var neworderlist1 = []
          for (var i = 0; i < _this.data.orderlist9.length; i++) {
            console.log(_this.data.orderlist9[i].Fqsrq.time)
            var date = new Date(_this.data.orderlist9[i].Fqsrq.time);
            console.log(date)
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var h = date.getHours();
            var mm = date.getMinutes();
            var ss = date.getSeconds();
            if (month >= 1 && month <= 9) {
              month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
            }
            h = h < 10 ? "0" + h : h;
            mm = mm < 10 ? "0" + mm : mm;
            ss = ss < 10 ? "0" + ss : ss;
            var date8 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
            console.log(date8)
            _this.data.orderlist9[i].Fqsrq = date8
            console.log(_this.data.orderlist9[i])
            if (date8 > date9) {
              _this.data.orderlist9[i].showrefund = 1
              neworderlist1.push(_this.data.orderlist9[i])
            } else {
              _this.data.orderlist9[i].showrefund = 2
              neworderlist1.push(_this.data.orderlist9[i])
            }
          }
          _this.setData({
            orderlist: neworderlist1,
          })
          console.log(_this.data.orderlist)
          wx.setStorage({
            key: 'orderlist',
            data: { 'orderlist': _this.data.orderlist },
          })
          var famount = _this.data.orderlist[0].famount;
          var fstatus = _this.data.orderlist[0].fstatus;
          // console.log("_this.data.orderlist.famount")
          // console.log(_this.data.orderlist[0].famount)
          // console.log(typeof (_this.data.orderlist[0].famount))
          // var num = famount;//定义一个变量num用来存放数字
          // var a = famount % 10;//num对10取余，可得到个位数
          // var b = famount / 10;//num除10得到十位数，由于b为整形，小数位会自动省略
          // console.log(a)
          // console.log(parseInt(b))
          // var famount = parseInt(a) * parseInt(b)
          _this.setData({
            famount: famount,
            fstatus: fstatus,
          })

          wx.showToast({
            title: '订单查询成功',
            icon: 'success',
            duration: 1500
          })
        } else {
          wx.showModal({
            content: '暂无相关订单！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            }
          });
        }
      }
    }) 
  },


  onPullDownRefresh: function () {
    wx.removeStorageSync('histryArr')
    var _this = this
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    h = h < 10 ? "0" + h : h;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;
    var date9 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
    wx.request({
      url: appjs.url + 'orderList',
      method: "get",
      header: {
        'content-type': 'application/json'
      },
      data:
        {
          open_id: app.globalData.openid,
        },
      success: function (res) {
        if (res.data.orderlist.length != 0) {
          _this.setData({
            orderlist: res.data.orderlist,
          })
          var neworderlist1 = []
          for (var i = 0; i < _this.data.orderlist.length; i++) {
            var date = new Date(_this.data.orderlist[i].Fqsrq.time);
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var h = date.getHours();
            var mm = date.getMinutes();
            var ss = date.getSeconds();
            if (month >= 1 && month <= 9) {
              month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
            }
            h = h < 10 ? "0" + h : h;
            mm = mm < 10 ? "0" + mm : mm;
            ss = ss < 10 ? "0" + ss : ss;
            var date8 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
            console.log(date8)
            _this.data.orderlist[i].Fqsrq = date8
            if (date8 > date9) {
              _this.data.orderlist[i].showrefund = 1
              neworderlist1.push(_this.data.orderlist[i])
            } else {
              _this.data.orderlist[i].showrefund = 2
              neworderlist1.push(_this.data.orderlist[i])
            }
          }
          _this.setData({
            orderlist: neworderlist1,
          })
          wx.setStorage({
            key: 'orderlist',
            data: { 'orderlist': _this.data.orderlist },
          })
          var famount = _this.data.orderlist[0].famount;
          var fstatus = _this.data.orderlist[0].fstatus;
          _this.setData({
            famount: famount,
            fstatus: fstatus,
          })

          wx.showToast({
            title: '订单查询成功',
            icon: 'success',
            duration: 1500
          })
        } else {
          wx.showModal({
            content: '暂无相关订单！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            }
          });

        }
      }
    }) 
        
        wx.stopPullDownRefresh()
     

  },
  getUserInfo: function(e) {
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
  nono: function () {}, 

  buybuy:function(e){
    var index = e.currentTarget.dataset.index;
    var histryArr = this.data.orderlist[index];
    var newtime = new Date(histryArr.Fqsrq);
    var newfqsrqdate = newtime.getTime()//发车时间
    var time = new Date().getTime()//当前时间
    var enddeltime = newfqsrqdate - 30 * 60 * 1000//最晚退票时间=发车时间-30min
    if (enddeltime < time) {
      histryArr.status = 0
    } else {//(enddeltime > time)
      histryArr.status = 5
    }

    wx.setStorage({
      key: 'histryArr',
      data: histryArr,
    }), 
    wx.navigateTo({
      url: '/pages/order/order'
    })//保留当前页面能返回前一个页面
  },

  // nnn:function(){
  //   var _this =this
  //   var uuu = []
  //   console.log(_this.data.orderlist)
  //   for (let i = 0; i < _this.data.orderlist.length; i++) {
  //     console.log(_this.data.orderlist[i].seatlist.length != 0)
  //     //   console.log(_this.data.orderlist[i].seatlist)
  //     if (_this.data.orderlist[i].seatlist.length != 0) {
  //       console.log(_this.data.orderlist[i].seatlist)
  //       for (let j = 0; j < _this.data.orderlist[i].seatlist.length; j++) {
  //         console.log(_this.data.orderlist[i].seatlist[j].fcheckStatus == 0)
  //         console.log('输出true跟false')
  //         if (_this.data.orderlist[i].seatlist[j].fcheckStatus == 0) {
  //           _this.data.orderlist[i].fcheckStatus = 0
  //           console.log(_this.data.orderlist[i])
  //           uuu.push(_this.data.orderlist[i])
  //           console.log(uuu)
  //           console.log("------------222222222------------------")
  //           console.log('=============_this.data.orderlist')
  //           break
  //         } else {
  //           _this.data.orderlist[i].fcheckStatus = 1
  //           uuu.push(_this.data.orderlist[i])
  //         }
  //       }//循环里 j
  //     } else {
  //       console.log('_this.data.orderlist[i]长度为0===========')
  //       _this.data.orderlist[i].fcheckStatus = 1
  //       console.log(_this.data.orderlist[i])
  //       uuu.push(_this.data.orderlist[i])
  //     }
  //     console.log('--------2--------------')
  //     _this.setData({
  //       orderlist: uuu,
  //     })
  //   }
 
  // },

  buydel:function(e){
    var that = this
    var index = e.currentTarget.dataset.index;
    var orderid = that.data.orderlist[index].id
    wx.showModal({ 
      title: '确认取消订单？', 
      content: '取消订单成功后，如需再次购买，请重新下单！', 
      success: function (res) { 
        if (res.confirm) { 
          wx.request({
            url: appjs.url + 'delorder?forderId=' + orderid,
            method: "get",
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.showToast({
                title: '取消成功！',
                icon: 'success',
                duration: 1500
              }) 
              var date = new Date();
              var seperator1 = "-";
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              var strDate = date.getDate();
              var h = date.getHours();
              var mm = date.getMinutes();
              var ss = date.getSeconds();
              if (month >= 1 && month <= 9) {
                month = "0" + month;
              }
              if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
              }
              h = h < 10 ? "0" + h : h;
              mm = mm < 10 ? "0" + mm : mm;
              ss = ss < 10 ? "0" + ss : ss;
              var date9 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
              wx.request({
                url: appjs.url + 'orderList',
                data:
                  {
                    open_id: app.globalData.openid,
                  },
                success: function (res) {
                  that.setData({
                    orderlist: res.data.orderlist,
                  })
                  var neworderlist1 = []
                  for (var i = 0; i < that.data.orderlist.length; i++) {
                    var date = new Date(that.data.orderlist[i].Fqsrq.time);
                    var seperator1 = "-";
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var strDate = date.getDate();
                    var h = date.getHours();
                    var mm = date.getMinutes();
                    var ss = date.getSeconds();
                    if (month >= 1 && month <= 9) {
                      month = "0" + month;
                    }
                    if (strDate >= 0 && strDate <= 9) {
                      strDate = "0" + strDate;
                    }
                    h = h < 10 ? "0" + h : h;
                    mm = mm < 10 ? "0" + mm : mm;
                    ss = ss < 10 ? "0" + ss : ss;
                    var date8 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
                    console.log(date8)
                    that.data.orderlist[i].Fqsrq = date8
                    if (date8 > date9) {
                      that.data.orderlist[i].showrefund = 1
                      neworderlist1.push(that.data.orderlist[i])
                    } else {
                      that.data.orderlist[i].showrefund = 2
                      neworderlist1.push(that.data.orderlist[i])
                    }
                  }
                  that.setData({
                    orderlist: neworderlist1,
                  })
               
                  wx.setStorage({
                    key: 'orderlist',
                    data: { 'orderlist': that.data.orderlist },
                  })
                  var famount = that.data.orderlist[0].famount;
                  var fstatus = that.data.orderlist[0].fstatus;
                  that.setData({
                    famount: famount,
                    fstatus: fstatus,
                  })
                }
              })
            }
          })
        } else if (res.cancel) { 
          wx.showToast({
            title: '已取消',
            icon: 'success',
            duration: 1500
          }) 
          } 
        } 
      })
  },
  alreadybuydel: function (e){
    var that = this
    var index = e.currentTarget.dataset.index;
    var orderid = that.data.orderlist[index].id
    wx.showModal({
      title: '确认取消订单？',
      content: '取消订单成功后，请至店内取回退款！',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: appjs.url + 'delpayorder?forderId=' + orderid,
            method: "get",
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
             if(res.data.code == 1){
              wx.showToast({
                title: '取消成功！',
                icon: 'success',
                duration: 1500
              })
               var date = new Date();
               var seperator1 = "-";
               var year = date.getFullYear();
               var month = date.getMonth() + 1;
               var strDate = date.getDate();
               var h = date.getHours();
               var mm = date.getMinutes();
               var ss = date.getSeconds();
               if (month >= 1 && month <= 9) {
                 month = "0" + month;
               }
               if (strDate >= 0 && strDate <= 9) {
                 strDate = "0" + strDate;
               }
               h = h < 10 ? "0" + h : h;
               mm = mm < 10 ? "0" + mm : mm;
               ss = ss < 10 ? "0" + ss : ss;
               var date9 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
              wx.request({
                url: appjs.url + 'orderList',
                data:
                  {
                    open_id: app.globalData.openid,
                  },
                success: function (res) {
                  var date = new Date();
                  var seperator1 = "-";
                  var year = date.getFullYear();
                  var month = date.getMonth() + 1;
                  var strDate = date.getDate();
                  var h = date.getHours();
                  var mm = date.getMinutes();
                  var ss = date.getSeconds();
                  if (month >= 1 && month <= 9) {
                    month = "0" + month;
                  }
                  if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                  }
                  h = h < 10 ? "0" + h : h;
                  mm = mm < 10 ? "0" + mm : mm;
                  ss = ss < 10 ? "0" + ss : ss;
                  var date9 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
                  wx.request({
                    url: appjs.url + 'orderList',
                    data:
                      {
                        open_id: app.globalData.openid,
                      },
                    success: function (res) {
                      if (res.data.orderlist.length !=0)
                      that.setData({
                        orderlist: res.data.orderlist,
                      })
                      var neworderlist1 = []
                      for (var i = 0; i < that.data.orderlist.length; i++) {
                        var date = new Date(that.data.orderlist[i].Fqsrq.time);
                        var seperator1 = "-";
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var strDate = date.getDate();
                        var h = date.getHours();
                        var mm = date.getMinutes();
                        var ss = date.getSeconds();
                        if (month >= 1 && month <= 9) {
                          month = "0" + month;
                        }
                        if (strDate >= 0 && strDate <= 9) {
                          strDate = "0" + strDate;
                        }
                        h = h < 10 ? "0" + h : h;
                        mm = mm < 10 ? "0" + mm : mm;
                        ss = ss < 10 ? "0" + ss : ss;
                        var date8 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
                        console.log(date8)
                        that.data.orderlist[i].Fqsrq = date8
                        if (date8 > date9) {
                          that.data.orderlist[i].showrefund = 1
                          neworderlist1.push(that.data.orderlist[i])
                        } else {
                          that.data.orderlist[i].showrefund = 2
                          neworderlist1.push(that.data.orderlist[i])
                        }
                      }
                      that.setData({
                        orderlist: neworderlist1,
                      })
                  wx.setStorage({
                    key: 'orderlist',
                    data: { 'orderlist': that.data.orderlist },
                  })
                  var famount = that.data.orderlist[0].famount;
                  var fstatus = that.data.orderlist[0].fstatus;
                  that.setData({
                    famount: famount,
                    fstatus: fstatus
                  })
                }//success
              })//re
             }  //su
            })
            }
            }//if
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  }
  ,

  refund:function(e){
    var that = this
    var index = e.currentTarget.dataset.index;
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    h = h < 10 ? "0" + h : h;
    mm = mm < 10 ? "0" + mm : mm;
    var date9 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm;
    var date = new Date(that.data.orderlist[index].Fqsrq.time);
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var h = date.getHours();
    var mm = date.getMinutes();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    h = h < 10 ? "0" + h : h;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;
    var date8 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
    console.log(date8)
    that.data.orderlist[i].Fqsrq = date8
    if (date8 > date9){
      // 车票   未使用过
      wx.showModal({
        title: '确认取消？',
        content: '取消申请提交成功后，请等待查看退款通知！',
        success: function (res) {
          if (res.confirm) {
            // 更改 已支付 ，后台确认再退款
            wx.request({
              url: appjs.url + 'delpayorder?forderId=' + that.data.orderlist[index].id,
              method: "get",
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                if (res.data.code == 1) {
                  wx.showToast({
                    title: '退款成功！',
                    icon: 'success',
                    duration: 1500
                  })
                  wx.request({
                    url: appjs.url + 'orderList',
                    data:
                      {
                        open_id: app.globalData.openid,
                      },
                    success: function (res) {
                      that.setData({
                        orderlist: res.data.orderlist,
                      })
                      var neworderlist1 = []
                      for (var i = 0; i < that.data.orderlist.length; i++) {
                        var date = new Date(that.data.orderlist[i].Fqsrq.time);
                        var seperator1 = "-";
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var strDate = date.getDate();
                        var h = date.getHours();
                        var mm = date.getMinutes();
                        var ss = date.getSeconds();
                        if (month >= 1 && month <= 9) {
                          month = "0" + month;
                        }
                        if (strDate >= 0 && strDate <= 9) {
                          strDate = "0" + strDate;
                        }
                        h = h < 10 ? "0" + h : h;
                        mm = mm < 10 ? "0" + mm : mm;
                        ss = ss < 10 ? "0" + ss : ss;
                        var date8 = year + seperator1 + month + seperator1 + strDate + " " + h + ":" + mm + ":" + ss;
                        console.log(date8)
                        that.data.orderlist[i].Fqsrq = date8
                        if (date8 > date9) {
                          that.data.orderlist[i].showrefund = 1
                          neworderlist1.push(that.data.orderlist[i])
                        } else {
                          that.data.orderlist[i].showrefund = 2
                          neworderlist1.push(that.data.orderlist[i])
                        }
                      }
                      that.setData({
                        orderlist: neworderlist1,
                      })
                      wx.setStorage({
                        key: 'orderlist',
                        data: { 'orderlist': that.data.orderlist },
                      })
                      var famount = that.data.orderlist[0].famount;
                      var fstatus = that.data.orderlist[0].fstatus;
                      that.setData({
                        famount: famount,
                        fstatus: fstatus,
                      })
                    }
                  })
                }
              }
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '取消订单？',
        content: '该订单不能取消！',
        success: function (res) {
          if (res.confirm) {
          }
        }
      }) 
    }
  }
})
