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
    date: "2016-09-01",    
    array: [{
    message: 'foo',
  }, {
    message: 'bar'
  }], 
    staff1: [{ name: 'Hulk' }, { name: 'Hulk2' }, { name: 'Hulk3' }],
    staff: [],
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
  changetolog:function(){
    // wx.redirectTo({
    //   url:'/pages/register/register'
    // })关闭当前页面不能返回前一个页面
    wx.navigateTo({
      url:'/pages/passenger_detail/passenger_detail'
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
    this.getbususerlist();
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
  onShow:function(){
    this.getbususerlist()
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
  getlistinfo:function(e){
    var index = e.currentTarget.dataset.index;
    console.log('this.data.staff[index].id')
    console.log(this.data.staff[index].id)
    console.log(this.data.staff[index].realname)
    console.log(this.data.staff[index].ftype)
    console.log(this.data.staff[index].credno)
    // console.log(e.currentTarget.dataset.realname)
    // console.log('获取对应realname')
    console.log(e.currentTarget.dataset.id)
    // var getid = e.currentTarget.dataset.id;
    // var getname = e.currentTarget.dataset.realname;
    // var getftype = e.currentTarget.dataset.ftype;
    
    this.setData({
      getid: e.currentTarget.dataset.id,
      getname: e.currentTarget.dataset.realname,
      getftype: e.currentTarget.dataset.ftype,
      getcredno: e.currentTarget.dataset.credno,
    })
    console.log('getid')
    console.log(this.data.getid)
    console.log(this.data.getname)
    console.log(this.data.getcredno)
    console.log(this.data.getftype)
    console.log('getid')
    wx: wx.setStorage({
      key: 'peoplelist_detail',
      data: { 'id': this.data.getid, 'name': this.data.getname, 'credno': this.data.getcredno, 'ftype': this.data.getftype },
    })
    //  wx.showModal({
    //   title: '编辑',
    //   content: '这是一个模态弹窗',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('确认')

    //     } else if (res.cancel) {
    //       console.log('取消')
    //     }
    //   }
    // })
    console.log('跳转页面')
    wx.navigateTo({  
      url: '/pages/peoplelist_detail/peoplelist_detail'
    // url:'/pages/person/person?name='+this.data.synctable[index].name
    })
    console.log('跳转页面')
  },
  getbususerlist:function(){
    var _this = this;
    wx.request({
      url: appjs.url + 'busUser',
      method: "get",
      header: {
        'content-type': 'application/json'
      },
      data: {
        'open_id': app.globalData.openid,
      },
      success: function (res) {
        if (res.data.busUserList.length !=0){
          _this.setData({
            staff: res.data.busUserList,
          })
          console.log(res.data.code)
          console.log(_this.data.staff)
        }else {
          wx.showToast({
            title: '暂无数据！',
            icon: 'none',
            duration: 1500
          })
        }
        

        
               
      }
    })
  },
  deletebususer: function () {
    var _this = this;
    console.log(_this.data.getid)
    wx.request({
      url: appjs.url + 'busUser',
      method: "delete",
      header: {
        'content-type': 'application/json'
      },
      data: {
        'id': _this.data.getid,
      },
      success: function (res) {
     
        // console.log(res.data.code)
        // console.log(_this.data.staff)
        // if (res.data.code == 1) {
        //   wx.showToast({
        //     title: '查询旅客成功',
        //     icon: 'success',
        //     duration: 1500
        //   })
        // }
      }
    })
  },

})
