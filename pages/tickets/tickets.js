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
    date: "",  
    region: '',
    region2: '',  
    minutes:'',
    Array:[],    
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item: {
      show: show
    } 
  },

  onLoad: function () {
    wx.removeStorageSync('namelist')
    wx.removeStorageSync('phone')
    wx.removeStorageSync('cardid')
    var openid = app.globalData.openid
    var _this = this
    wx.getStorage({
      key: 'pageindex',
      success: function (res) {
        var getmintues = res.data.minutes;
        var startregion = res.data.city1;
        var endregion = res.data.city2;
        var getdate = res.data.date;
        _this.setData({
          date: getdate,
          region: startregion,
          region2: endregion,
          minutes: getmintues
        })
        _this.changetolog();
      },
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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

  onShow: function () {
    wx.removeStorageSync('namelist')
    wx.removeStorageSync('phone')
    wx.removeStorageSync('cardid')
    var _this = this;
    wx.getStorage({
      key: 'pageindex',
      success: function (res) {
        var getmintues = res.data.minutes;
        var startregion = res.data.city1;
        var endregion = res.data.city2;
        var getdate = res.data.date;
        _this.setData({
          date: getdate,
          region: startregion,
          region2: endregion,
          minutes: getmintues
        })
        _this.changetolog();
      },
    })
  },
 
  buybuy:function(){
    wx.navigateTo({
      url: '/pages/buy/buy'
    })//保留当前页面能返回前一个页面
  },

  buyit:function(e){
    var index = e.currentTarget.dataset.index;
    var Array = this.data.Array[index];
    wx.setStorage({
      key: 'Array',
      data: Array,
    }), 

    // console.log(this.data.Array[index].FBillNO)
    // console.log(e.currentTarget.dataset.fzws)
    // var getfFBillNO = this.data.Array[index].FBillNO;
    // var getfzws = e.currentTarget.dataset.fzws;//剩余车票
    // // console.log(e.currentTarget.dataset.FBillNO)
    // this.setData({
    //   getfzws: getfzws,
    //   getfFBillNO: getfFBillNO,
    // })
    // console.log('get')
    // console.log(this.data.getfFBillNO)
    // console.log(this.data.getfzws)
    // console.log('get')
    // wx:wx.setStorage({
    //   key: 'fzws',
    //   data: { 'fzws': this.data.getfzws, 'FBillNO': this.data.getfFBillNO },
    // }), 
    wx.navigateTo({
      url:'/pages/buy/buy'
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

// 日期选择
bindDateChange: function (e) {
  this.setData({
      date: e.detail.value
  })
  this.changetolog();
},
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onPullDownRefresh: function () {
    wx.removeStorageSync('namelist')
    wx.removeStorageSync('phone')
    wx.removeStorageSync('cardid')
    var _this = this;
    wx.getStorage({
      key: 'pageindex',
      success: function (res) {
        var getmintues = res.data.minutes;
        var startregion = res.data.city1;
        var endregion = res.data.city2;
        var getdate = res.data.date;
        _this.setData({
          date: getdate,
          region: startregion,
          region2: endregion,
          minutes: getmintues
        })
        _this.changetolog();
        wx.stopPullDownRefresh()
      },
    })
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
  nono: function (){},
  nextday:function(){
    var dt=this.data.date;
    // dt = dt.replace('-', '/');//js不认2011-11-10,只认2011/11/10
    var t1 = new Date(new Date(dt).getTime() + 1 * 24 * 60 * 60 * 1000);// 日期加上指定的天数
    var month;
    var day;
    if((t1.getMonth() + 1)<10)
    {
        month="0"+(t1.getMonth() + 1);
    }
    else
    {
        month=t1.getMonth() + 1;
    }
    if(t1.getDate()<10)
    {
        day="0"+t1.getDate();
    }
    else
    {
       day=t1.getDate(); 
    }
     var ttt=  t1.getFullYear() + "-" + month + "-" + day;
    this.setData({
      date: ttt
    })
    this.changetolog();
   
  },
  lastday:function(){
    var dt = this.data.date;
    var t1 = new Date(new Date(dt).getTime() - 1 * 24 * 60 * 60 * 1000);// 日期减去指定的天数
    var month;
    var day;
    if ((t1.getMonth() + 1) < 10) {
      month = "0" + (t1.getMonth() + 1);
    }
    else {
      month = t1.getMonth() + 1;
    }
    if (t1.getDate() < 10) {
      day = "0" + t1.getDate();
    }
    else {
      day = t1.getDate();
    }
    var ttt = (t1.getFullYear()).toString() + "-" + month.toString() + "-" + day.toString();
    this.setData({
      date: ttt
    })
    this.changetolog();
  },
   //首页，点击按钮查询车票，查询结果需要在tickets页面展示，所以应该的tickets页面加载这个方法，
  // 需要将当前页面表单的三个值传到tickets页面
  changetolog:function(){ 
    var _this = this;
      wx.request({
        url: appjs.url+'searchPaiGongDanList', //仅为示例，并非真实的接口地址
      method: "get",
      header: {
        "Content-Type": "json"
      },
      data: {  
        Fscdd: _this.data.region,
        Ffcdd: _this.data.region2,
        Fqsrq: _this.data.date,
        fopenid: app.globalData.openid,
        Fminutes: _this.data.minutes
      },      
      success: function (res){
        console.log(res.data.arr)
        var Array = res.data.arr;  
        for (var j = 0, lenJ = Array.length; j < lenJ; ++j) {
          if (Array[j].FSDate != ''){
            Array[j].FSDate = Array[j].FSDate.slice(10, 16)
            console.log(Array[j].FSDate)
          }
        }
        console.log(Array)
        _this.setData({
          Array: Array,
        })
        if (_this.data.Array.length == 0){
          wx.showModal({
            content: '暂无相关数据',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              }
            }
          });
        }
      }
    })
  },
})
