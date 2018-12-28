//logs.js
const util = require('../../utils/util.js')
var model = require('../../model/model.js')
var appjs = require('../../app.js')

const app = getApp()

Page({
  data: {
    openid:'',
    name: '',
    phone: '',
    mobile:'',
    cardid: '',
    fdepartment: '',
    files: [],
    showTopTips: false,    
    date: "2016-09-01",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickname: '',
    avatarUrl: ''
  },
  onLoad: function () {
    // if (app.globalData.userInfo != null) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          if (res.userInfo){
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true,
              nickname: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl
            })
          }else{
           
          } 
        }
      })
    // } 
    var files = [];
    if (app.globalData.userInfo){
      files.push(app.globalData.userInfo.avatarUrl);
      this.setData({
        userInfo: app.globalData.userInfo,
        files: files,
        nickname: app.globalData.userInfo.nickName,
        // name: app.globalData.userInfo.fname,
        avatarUrl: app.globalData.userInfo.avatarUrl
      })
    }
    var _this = this;
    wx.request({
      url: appjs.url + 'userInfo',
      method: "get",
      header: {
        'content-type': 'application/json'
      },
      data:
        {
          open_id: app.globalData.openid,
        },
      success: function (res) {
        var rescode = res.data.code
        if(res.data.code==0){       
            _this.setData({
              rescode: rescode,
            })
        } else if (res.data.code == 1){
          _this.setData({
            rescode: rescode,
            phone: res.data.userInfo.mobile,
            name: res.data.userInfo.fname,
            cardid: res.data.userInfo.fscard,
            fdepartment: res.data.userInfo.fdepartment
          })
        }
      }
    }) 
  },
  onShow:function(){
    var _this = this;
    wx.request({
      url: appjs.url + 'userInfo',
      method: "get",
      header: {
        'content-type': 'application/json'
      },
      data:
        {
          open_id: app.globalData.openid,
        },
      success: function (res) {
        var rescode = res.data.code
        if (res.data.code == 0) {
          _this.setData({
            rescode: rescode,
          })
        } else if (res.data.code == 1){
          _this.setData({
            rescode: rescode,
            phone: res.data.userInfo.mobile,
            name: res.data.userInfo.fname,
            cardid: res.data.userInfo.fscard,
          })
        }
      }
    }) 
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      nickname: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl
    })
  },

  getstorage: function () {
    wx.getStorage({
      key: 'pageid2',
      success: function (res) {
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  name: function (e) {   //获取input昵称输入的值
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  phone: function (e) {   //获取input手机号输入的值
    var that = this;
    that.setData({
      phone: e.detail.value
    })
    // if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value))) {
    //   wx.showModal({
    //     content: '您输入的手机号格式不正确',
    //     showCancel: false,
    //     success: function (res) {
    //       if (res.confirm) {
    //       }
    //     }
    //   });
    // } else {
    //   wx.request({
    //     url: appjs.url + 'userInsert?nickname=' + that.data.name + '&head_img=' + that.data.avatarUrl + '&open_id=' + app.globalData.openid + '&mobile=' + e.detail.value,
    //     method: "get",
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     success: function (res) {
    //       console.log(res)
    //       if (res.data.code == 1) {
    //         wx.showToast({
    //           title: '绑定信息成功',
    //           icon: 'success',
    //           duration: 2000
    //         })
    //       }
    //       wx.switchTab({
    //         url: '/pages/index/index'
    //       })
    //     }
    //   })
    // } 
  },
  cardid: function (e) {   //获取input证件号输入的值
    var that = this;
    that.setData({
      cardid: e.detail.value
    })
  },
  fdepartment: function (e) {   //获取input昵称输入的值
    var that = this;
    that.setData({
      fdepartment: e.detail.value
    })
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

  //提交绑定的方法
  submit:function(){
    if (this.data.name == '') {
      wx.showModal({
        content: '请输入姓名',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    }else{
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.phone))) {
      wx.showModal({
        content: '您输入的手机号格式不正确',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    } else if (this.data.cardid == '') {
      wx.showModal({
        content: '请输入证件号',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      } else if (this.data.fdepartment == '') {
        wx.showModal({
          content: '请输入部门',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        });
      } else if (this.data.nickname == ''){
        wx.showModal({
          content: '请点击授权',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        });
      }else{
        console.log('this.data.phone')
        console.log(this.data.phone)
        console.log(this.data.nickname)
        console.log(this.data.avatarUrl)
        console.log(app.globalData.openid)
        console.log(this.data.name)
        console.log(this.data.cardid)
        console.log('this.data.phone')
        wx.request({
          url: appjs.url + 'userInsert?nickname=' + encodeURI(this.data.nickname) + '&head_img=' + this.data.avatarUrl + '&open_id=' + app.globalData.openid + '&fname=' + encodeURI(this.data.name) + '&fcard=' + this.data.cardid + '&mobile=' + this.data.phone + '&fdepartment=' + encodeURI(this.data.fdepartment) ,
          method: "get",
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
          console.log(res)
          if(res.data.code == 1){
            wx.showToast({
                title: '绑定信息成功',
                icon: 'success',
                duration: 2000
              })
            if (res.data.fstatus != 0) {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            
          } else if (res.data.code == 2) {
            wx.showToast({
              title: 'insert openid null',
              icon: 'none',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '绑定信息失败',
              icon: 'none',
              duration: 2000
            })
          }
          
          }
        }) 
      } 
    }  
  },
  
});
