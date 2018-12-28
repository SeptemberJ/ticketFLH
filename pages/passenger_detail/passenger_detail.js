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
      busUserList:'',
      date: "2018-07-18",    
      array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }], 
    radiovalue:'',
    radioItems: [
      {name: '成人', value: '0'},
      {name: '儿童', value: '1'}
    ],
    name:'',
    phone:'',
    cardid:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item: {
      show: show
    }  
  },
  name: function (e) {   //获取input输入的值
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  phone: function (e) {   //获取input输入的值
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  cardid: function (e) {   //获取input输入的值
    var that = this;
    that.setData({
      cardid: e.detail.value
    })
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function() {
    console.log('form发生了reset事件')
  },
  //保存
  changetolog:function(){
    // var regLowerCase = new RegExp("^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$");
    if (this.data.name == '') {
      wx.showModal({
        content: '请输入真实姓名',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      // wx.showToast({
      //   title: '请输入真实姓名',        
      //   duration: 1500
      // })
    }
    // else if(this.data.phone==''){
    //   wx.showToast({
    //     title: '您输入的手机号格式不正确',
    //     duration: 1500
    //   })
    // } 
    else if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.phone))){
      wx.showModal({
        content: '您输入的手机号格式不正确',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      // wx.showToast({
      //   title: '您输入的手机号格式不正确',
      //   duration: 1500
      // })
    }
    // else if (regLowerCase.test(this.data.phone)) {
    //   wx.showToast({
    //     title: '您输入的手机号格式不正确',
    //     duration: 1500
    //   })
    // }
    else if (this.data.cardid==''){
      wx.showModal({
        content: '请输入证件号',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      // wx.showToast({
      //   title: '请输入身份证号码',
      //   duration: 1500
      // })
    }else{
      var _this = this;
      console.log(_this.data.name)
      console.log(_this.data.phone)
      console.log(_this.data.cardid)
      console.log(_this.data.radiovalue)
      console.log(88899999006666)
      var temp = [];
      var datatable= {
        fopenid: app.globalData.openid,
        realname: _this.data.name,
        credno: _this.data.cardid,
        ftype: _this.data.radiovalue
      }
      
      temp.push(datatable)
      console.log(datatable)
      console.log(temp)
      wx.request({
        url: appjs.url + 'busUser', 
        method: "post",
        header: {
           'content-type': 'application/json'
        },
        data: { 'fopenid': app.globalData.openid, 'items': temp },
        success: function (res) {
          console.log(res.data.code)
          console.log(res.data.code == 0)
          console.log(res.data.code == '0')
          if (res.data.code==0){
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1500
            })
            wx.navigateBack();
            // wx.navigateTo({
            //   url: '/pages/peoplelist/peoplelist'
            // })
          } else {
            wx.showToast({
              title: '添加失败',
              icon: 'success',
              duration: 1500
            })
          }
        }
      })
      //保留当前页面能返回前一个页面
    }
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
  radioChange: function (e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value);
      var radioItems = this.data.radioItems;
      console.log(e.detail.value)
      console.log(876778)
      console.log(this.data.radioItems)
      console.log(radioItems)
      for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == e.detail.value;
      }
      this.setData({
        radioItems: radioItems,
        radiovalue: e.detail.value
      });
      console.log(this.data.radiovalue)
    },
})
