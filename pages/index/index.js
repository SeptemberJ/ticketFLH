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
    orderloglistp:{},
    selecttype:0,
    loadingHidden: false,
    inputShowed: false,
    inputVal: "",
    accounts: ["微信号", "QQ", "Email"],
    accountIndex: 0,
    accountIndex0:0,
    ordertype:0,
    xingqi:'',
    openid:'',
    minutes:'',
    startcity:'',
    endcity:'',
    index: 0,
    multiIndex: [0, 0, 0],
    date: '',
    date1: '',    
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item: {
      show: show
    } 
  },
  // 出发地选择器

  bindAccountChange0: function (e) {
    this.setData({
      accountIndex0: e.detail.value,
      // startcity: this.data.orderloglistFscdd[accountIndex0]
    })
  },
  changeselect:function(){
    if (this.data.selecttype == 0){
      this.setData({
        selecttype: 1,
      })
    }else{
      this.setData({
        selecttype: 0,
      })
    }
  },

    // mudi地选择器
  bindAccountChange: function (e) {
    this.setData({
      accountIndex: e.detail.value,
      // endcity: this.data.orderloglistFfcdd[accountIndex]
    })
  },
  // here
  // change:function(){
  //   var Fscddcity1: _this.data.orderloglistFscdd[_this.data.accountIndex0],
  //   var Ffcddcity2: _this.data.orderloglistFfcdd[_this.data.accountIndex]
  //   _this.data.orderloglistFscdd[_this.data.accountIndex0] = Ffcddcity2
  //   _this.data.orderloglistFfcdd[_this.data.accountIndex] = Fscddcity1
  //   // this.setData({
  //   //   startcity: Fscddcity1,
  //   //   endcity: Ffcddcity2
  //   // });
  //   // var startcity1 = this.data.endcity;
  //   // var endcity1 = this.data.startcity;
  //   // this.setData({
  //   //   startcity: startcity1,
  //   //   endcity: endcity1
  //   // });

  // },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function() {
    console.log('form发生了reset事件')
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

    var _this = this
    if (wx.getStorageSync('orderloglist')) {
      wx.getStorage({
        key: 'orderloglist',
        success: function (res) {
          console.log(9888888)
          console.log(res.data.orderloglist)
          _this.setData({
            orderloglistp: res.data.orderloglist,
          })
          console.log(666666)

        }
      })
      console.log(4444444)
      console.log(_this.data.orderloglistp)
      console.log(4444444)
    }
   
    // 查找目的地
    wx.request({
      url: appjs.url + 'selectgroupFfcdd',
      method: "get",
      success: function (res) {
        var newendorderlist = []
        for (var i = 0, lenI = res.data.orderloglist.length; i < lenI; ++i) {
          newendorderlist.push(res.data.orderloglist[i].Ffcdd)
        }
        _this.setData({
          orderloglistFfcdd: newendorderlist
        })
        console.log('hhhhhhhshshhs =  ')
        console.log(_this.data.orderloglistp)
        console.log(res.data.orderloglist)
        if (_this.data.orderloglistp != {}){
          for (var j = 0, lenJ = res.data.orderloglist.length; j < lenJ; ++j) {
            console.log(res.data.orderloglist[j].Ffcdd == _this.data.orderloglistp.Ffcdd)
            if (_this.data.orderloglistp.Ffcdd == res.data.orderloglist[j].Ffcdd) {
              console.log(999888777666)
              _this.setData({
                accountIndex: j
              })
              break
            }
          }
          console.log(888)
          console.log(_this.data.orderloglistp)
          // console.log(_this.data.orderloglistFfcdd)
          console.log(888)
        }
       
      }
    })

    wx.request({
      url: appjs.url + 'selectgroupFscdd',
      method: "get",
      success: function (res) {
        var newstartorderlist = []
        for (var i = 0, lenI = res.data.orderloglist.length; i < lenI; ++i) {
          newstartorderlist.push(res.data.orderloglist[i].Fscdd)
        }
        _this.setData({
          orderloglistFscdd: newstartorderlist
        })
        if (_this.data.orderloglistp !={}){
          for (var j = 0, lenJ = res.data.orderloglist.length; j < lenJ; ++j) {
            if (_this.data.orderloglistp.Fscdd == res.data.orderloglist[j].Fscdd) {
              _this.setData({
                accountIndex0: j
              })
            }
          }
          console.log(888)
          console.log(_this.data.orderloglistFscdd)
          console.log(_this.data.accountIndex0)
          console.log(888)
        } 
      }
    })
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var date = year + seperator1 + month + seperator1 + strDate;
    _this.setData({
        date: date,
        date1: date,
        datestart: date
      })
    var s = _this.data.date;
    _this.setData({
      xingqi: "星期 " + "天一二三四五六 ".charAt(new Date(s).getDay())
      
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
    _this.setData({
      loadingHidden: true,
    })
    wx.request({
      url: appjs.url + 'selectccxz',
      method: "get",
      header: {
        'content-type': 'application/json'
      },
      data:
        {
        },
      success: function (res) {
        console.log(res.data.ccxzlist[0].Fccxz)
        _this.setData({
          ccxzlist: res.data.ccxzlist[0].Fccxz,
        })
      }
    }) 
  },
  onShow:function () {
    var _this = this
    wx.request({
      url: appjs.url + 'selectccxz',
      method: "get",
      header: {
        'content-type': 'application/json'
      },
      data:
        {
        },
      success: function (res) {
        console.log(res.data.ccxzlist[0].Fccxz)
        _this.setData({
          ccxzlist: res.data.ccxzlist[0].Fccxz,
        })
      }
    })
  },
  // 历史记录的点击事件
  clickitem: function (e) {
    var _this = this
    var index = e.currentTarget.dataset.index;
    var chufa = _this.data.orderloglist[index].Fscdd
    var mudi = _this.data.orderloglist[index].Ffcdd
    for (var i = 0, lenI = _this.data.orderloglistFfcdd.length; i < lenI; ++i) {
      if (_this.data.orderloglistFfcdd[i] == mudi){
        console.log(i)
        _this.setData({
          accountIndex: i,
        })
        for (var j = 0, lenJ = _this.data.orderloglistFscdd.length; j < lenJ; ++j) {
          if (_this.data.orderloglistFscdd[j] == chufa) {
            _this.setData({
              accountIndex0: j,
            })
          break
        }else{
          console.log('luxianbucunzai')
        }
      }
        break
      }else{
        console.log('luxianbucunzai')        
      }
    }
    // _this.setData({
    //   startcity: _this.data.orderloglist[index].Fscdd,//出发
    //   endcity: _this.data.orderloglist[index].Ffcdd//目的地
    // })
  },

  // clickitem:function(e){
  //   var _this = this
  //   var index = e.currentTarget.dataset.index;
  //   _this.setData({
  //     startcity: _this.data.orderloglist[index].Fscdd,
  //     endcity: _this.data.orderloglist[index].Ffcdd
  //   })
  // },

  delthistory: function () {
    var _this = this
    _this.setData({
      loadingHidden: false,
    })
    wx.showModal({
      title: '删除历史',
      content: '点击确定，会删除历史查询记录！',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: appjs.url + 'delorderlog?fopenid=' + app.globalData.openid,
            method: "get",
            header: {
              //传输接收数据的头（！！！）
              'content-type': 'application/json'
            },
            success: function (res) {
              _this.setData({
                orderloglist: [],
                ordertype: 0
              })
              wx.showToast({
                title: '已删除!',
                icon: 'none',
                duration: 1500
              })
            }
          })
          _this.setData({
            loadingHidden: true,
          })
        } else {
          _this.setData({
            loadingHidden: true,
          })
        }
      }
    });
  },
  delthistory1:function(){
    wx.request({
      url: appjs.url + 'delorderlog?fopenid=' + app.globalData.openid,
      method: "get",
      header: {
        //传输接收数据的头（！！！）
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.result == 1){
          _this.setData({
            orderloglist: [],
            ordertype: 0
          })
          wx.showToast({
            title: '已删除!',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
},
  gethistory:function(){
    var _this = this
    wx.request({
      url: appjs.url + 'selectorderlog?fopenid=' + app.globalData.openid,
      method: "get",
      header: {
        //传输接收数据的头（！！！）
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.orderloglist.length == 0){
          wx.showToast({
            title: '没有历史记录！',
            icon: 'none',
            duration: 1500
          })
          // 判断是否重复  ，  如果重复的话 从列表中删去
        }else{
          _this.setData({
            orderloglist: res.data.orderloglist,
            ordertype:1
          })
        }

      }
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getstorage:function() {
    wx.getStorage({
      key: 'pageid2',
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true,400);  
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false,400);
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
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
    var s = this.data.date;
    this.setData({
      xingqi: "星期 " + "天一二三四五六 ".charAt(new Date(s).getDay())
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindRegionChange2: function (e) {
    this.setData({
      region2: e.detail.value
    })
  },
  inputstartcity: function (e) {   //获取input输入的值
    var that = this;
    that.setData({
      startcity: e.detail.value
    })
  },
  inputendcity: function (e) {   //获取input输入的值
    var that = this;
    that.setData({
      endcity: e.detail.value
    })
  },
  inputminutes: function (e) {   //获取input输入的值
    var that = this;
    that.setData({
      minutes: e.detail.value
    })
  },
  changetolog: function (e) {
    var _this = this;
    // this.setData({
    //   loadingHidden: true,
    // })
    // var city1 = this.data.startcity; 
    // if(city1==''){
    //   wx.showToast({
    //     title: '请输出发的城市',
    //     icon: 'none',
    //     duration: 1500
    //   })
    // }else{
    // var city2 = this.data.endcity;    //获取input初始值  
    // if(city2==''){
    //   wx.showToast({
    //     icon: 'none',
    //     title: '请输入目的城市',
    //     duration: 1500
    //   })
    // }else{ 
    if (_this.data.selecttype ==0){
      _this.setData({
        loadingHidden: false,
        city1: _this.data.orderloglistFscdd[_this.data.accountIndex0],
        city2: _this.data.orderloglistFfcdd[_this.data.accountIndex]
      })
      wx: wx.setStorage({
        key: 'pageindex',
        // data: { 'date': this.data.date, 'city1': this.data.startcity, 'city2': this.data.endcity, 'minutes': this.data.minutes},
        data: {
          'date': _this.data.date,
          'city1': _this.data.orderloglistFscdd[_this.data.accountIndex0], 'city2': _this.data.orderloglistFfcdd[_this.data.accountIndex],
          'minutes': _this.data.minutes
        },
      })

      wx: wx.setStorage({
        key: 'orderloglist',
        data: {
          'orderloglist': {
            'date': _this.data.date,
            'Fscdd': _this.data.orderloglistFscdd[_this.data.accountIndex0], 'Ffcdd': _this.data.orderloglistFfcdd[_this.data.accountIndex],
            'minutes': _this.data.minutes
          } },
      })

      wx.request({
        url: appjs.url + 'searchPaiGongDanList', //仅为示例，并非真实的接口地址
        method: "get",
        header: {
          "Content-Type": "json"
        },
        data: {
          Fscdd: _this.data.orderloglistFscdd[_this.data.accountIndex0],
          Ffcdd: _this.data.orderloglistFfcdd[_this.data.accountIndex],
          // Fscdd: city1,
          // Ffcdd: city2,
          Fqsrq: _this.data.date,
          fopenid: app.globalData.openid,
          Fminutes: _this.data.minutes
        },
        success: function (res) {
















          var Array = res.data.arr;
          _this.setData({
            Array: Array,
          })
          _this.setData({
            loadingHidden: true,
          })
          if (_this.data.Array.length == 0) {
            wx.showToast({
              title: '暂无数据',
              icon: 'none',
              duration: 1500
            })
          } else if (_this.data.Array.length != 0) {
            wx.navigateTo({
              url: '/pages/tickets/tickets'
            })//保留当前页面能返回前一个页面
            _this.setData({
              loadingHidden: true,
            })
          }
          _this.gethistory()
        }
      })

    }else{
      _this.setData({
        loadingHidden: false,
        city1: _this.data.orderloglistFfcdd[_this.data.accountIndex],
        city2: _this.data.orderloglistFscdd[_this.data.accountIndex0]
      })
      wx: wx.setStorage({
        key: 'pageindex',
        data: {
          'date': _this.data.date,
          'city1': _this.data.orderloglistFfcdd[_this.data.accountIndex], 'city2': _this.data.orderloglistFscdd[_this.data.accountIndex0],
          'minutes': _this.data.minutes
        },
      })
      wx: wx.setStorage({
        key: 'orderloglist',
        data: {
          'orderloglist': {
            'date': _this.data.date,
            'Fscdd': _this.data.orderloglistFscdd[_this.data.accountIndex], 'Ffcdd': _this.data.orderloglistFfcdd[_this.data.accountIndex0],
            'minutes': _this.data.minutes
          }
        },
      })
      wx.request({
        url: appjs.url + 'searchPaiGongDanList', //仅为示例，并非真实的接口地址
        method: "get",
        header: {
          "Content-Type": "json"
        },
        data: {
          Fscdd: _this.data.orderloglistFfcdd[_this.data.accountIndex],
          Ffcdd: _this.data.orderloglistFscdd[_this.data.accountIndex0],
          // Fscdd: city1,
          // Ffcdd: city2,
          Fqsrq: _this.data.date,
          fopenid: app.globalData.openid,
          Fminutes: _this.data.minutes
        },
        success: function (res) {
          var Array = res.data.arr;
          _this.setData({
            Array: Array,
          })
          _this.setData({
            loadingHidden: true,
          })
          if (_this.data.Array.length == 0) {
            wx.showToast({
              title: '暂无数据',
              icon: 'none',
              duration: 1500
            })
          } else if (_this.data.Array.length != 0) {
            wx.navigateTo({
              url: '/pages/tickets/tickets'
            })//保留当前页面能返回前一个页面
            _this.setData({
              loadingHidden: true,
            })
          }
          _this.gethistory()
        }
      })
    }  
    // }
    // }
  },






 //下面是之前picker
  //  changetolog:function(){
  //   //  console.log('this.data.date')
  //   //  console.log(this.data.date)
  //    var stringdata = { 'date': this.data.date, 'region': this.data.region, 'region2': this.data.region2 }
  //    wx: wx.setStorage({
  //      key: 'pageid2',
  //     //  data: [{ 'date': this.data.date }, { 'region': this.data.region }, { 'region2': this.data.region2 }],
  //      data: { 'date': this.data.date, 'region': this.data.region, 'region2': this.data.region2 },
  //      success: function (res) { },
  //      fail: function (res) { },
  //      complete: function (res) { },
  //    }),
  //   // wx.redirectTo({
  //   //   url:'/pages/register/register'
  //   // })关闭当前页面不能返回前一个页面
  //   wx.navigateTo({
  //     url:'/pages/tickets/tickets'
  //   })//保留当前页面能返回前一个页面
  // },

  //首页，点击按钮查询车票，查询结果需要在tickets页面展示，所以应该的tickets页面加载这个方法，
  // 需要将当前页面表单的三个值传到tickets页面
  // changetolog:function(){ 
  //     console.log(111)
  //     console.log(this.data.date)
  //     console.log(222)
  //     console.log(this.data.region)
  //     console.log(333)
  //     console.log(this.data.region2)
  //     console.log(444)
  //     // window.localStorage.setItem("outdata",data.date);
  //     // window.localStorage.setItem("startregion",data.region);
  //     // window.localStorage.setItem("endregion",data.region2)     
  //     wx.request({
  //     url: url+'/searchPaiGongDanList', //仅为示例，并非真实的接口地址
  //     method: "get",
  //     header: {
  //       //传输接收数据的头（！！！）
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     data: {
  //       Fscdd:'data.region',
  //       empty:'data.region2',
  //       Fminutes:'data.date'
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //       if (res.data.code==200){ 
  //         wx.showToast({
  //           title: '查询成功',
  //           icon: 'success',
  //           duration: 1500
  //         })
  //       }else{
  //         wx.showToast({
  //           title: '查询失败',
  //           icon: 'success',
  //           duration: 1500
  //         })
  //       }
  //     }
  //   })
  // },


  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  }

})
  

