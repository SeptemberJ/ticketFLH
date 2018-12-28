//logs.js
const util = require('../../utils/util.js')
var appjs = require('../../app.js')

const app = getApp()

Page({
  data: {
    loadingHidden:false,
    showTopTips: false,
    checkboxItems: [],
    checkboxstatus:[],
    staff:[],
    idlist1:[]
  },
  onLoad:function(){
    var _this = this;

    wx.getStorage({
      key: 'namelist',
      success: function (res) {
        var ids = res.data.ids;
        _this.setData({
          idlist1: ids,
        })
      }
    })
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
        var tempArray = res.data.busUserList;        
        // var tempArray = res.data.busUserList.slice(0);
        tempArray.map(function (item, idx) {
          //跟本地比一下，是否存在
          item.checked = false
        }) 
        _this.setData({
              checkboxItems: tempArray,
            })
        if (res.data.code == 1) {
          wx.showToast({
            title: '查询旅客成功',
            icon: 'success',
            duration: 1500
          })
        }  
    
        for (var i = 0, lenI = _this.data.idlist1.length; i < lenI; ++i) {
          for (var j = 0, lenJ = _this.data.checkboxItems.length; j < lenJ; ++j) {
            if (_this.data.idlist1[i] == _this.data.checkboxItems[j].id) {
              _this.data.checkboxItems[j].checked =true;
            }
          }
        }
        _this.setData({
          checkboxItems: _this.data.checkboxItems,
        })
       
      }
    }) 
    _this.setData({
      loadingHidden: true,
    })
  },
  onShow:function(){
    
    var _this = this;
    _this.setData({
      loadingHidden: false,
    })
    wx.getStorage({
      key: 'namelist',
      success: function (res) {
        var ids = res.data.ids;
        _this.setData({
          idlist1: ids,
        })
      }
    })
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
        var tempArray = res.data.busUserList;
        // var tempArray = res.data.busUserList.slice(0);
        tempArray.map(function (item, idx) {
          //跟本地比一下，是否存在
          item.checked = false
        })
        _this.setData({
          checkboxItems: tempArray,
        })
        if (res.data.code == 1) {
          wx.showToast({
            title: '查询旅客成功',
            icon: 'success',
            duration: 1500
          })
        }
        for (var i = 0, lenI = _this.data.idlist1.length; i < lenI; ++i) {
          for (var j = 0, lenJ = _this.data.checkboxItems.length; j < lenJ; ++j) {
            if (_this.data.idlist1[i] == _this.data.checkboxItems[j].id) {
              _this.data.checkboxItems[j].checked = true;
            }
          }
        }
        _this.setData({
          checkboxItems: _this.data.checkboxItems,
        })

        // 16
        for (var i = 0, lenI = tempArray.length; i < lenI; ++i) {
          for (var j = 0, lenJ = _this.data.checkboxstatus.length; j < lenJ; ++j) {
            if (tempArray[i].checked != _this.data.checkboxstatus[j].checked) {
              tempArray[i].checked = true;
              break;
            }
          }
        }
        // 16

      }
    })
    _this.setData({
      loadingHidden: true,
    })
  },

  checkboxChange2: function (e) {
    console.log(this.data.checkboxItems)
    debugger
    var namelist = [];
    var idlist = [];

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].id == values[j]) {
          // 审核没过的的不能选择
          if (checkboxItems[i].fstatus && checkboxItems[i].fstatus != 0) {
            checkboxItems[i].checked = true;
            namelist.push(checkboxItems[i].realname)
            idlist.push(checkboxItems[i].id)
            // break; 
          } else {
            console.log(checkboxItems[i].fstatus)
            console.log(checkboxItems[i].realname)
            console.log(checkboxItems)
            wx.showModal({
              content: '该人员还未通过审核，暂时不能添加!',
              showCancel: false,
              success: function (res) {
              }
            });
            return false
          }

        }
      }
    }
    wx.setStorage({
      key: 'namelist',
      data: { 'names': namelist, 'ids': idlist },
    })
    this.setData({
      checkboxItems: checkboxItems,
      namelist: namelist,
      idlist: idlist
    });
  },


  checkboxChange: function (e) {
    var namelist = [];
    var idlist = [];
    console.log(e.detail.value)
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].id == values[j]) {
          // 审核没过的的不能选择
          if (checkboxItems[i].fstatus && checkboxItems[i].fstatus != 0){
            checkboxItems[i].checked = true;
            namelist.push(checkboxItems[i].realname)
            idlist.push(checkboxItems[i].id)
            // break; 
          }else{
            e.detail.value.splice(j,1)
            wx.showModal({
              content: '该人员还未通过审核，暂时不能添加!',
              showCancel: false,
              success: function (res) {
              }
            });
            return false
          }    
        }
      }
    }

    wx.setStorage({
      key: 'namelist',
      data: { 'names': namelist, 'ids': idlist},
    })
      this.setData({
        checkboxItems: checkboxItems,
        namelist: namelist,
        idlist: idlist
    });
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
  addmore:function(){
      wx.navigateTo({
        url:'/pages/passenger_detail/passenger_detail'
    })//保留当前页面能返回前一个页面
  },
  submit:function(){
    var pages = getCurrentPages();
    if (pages.length > 1) {    
      var prePage = pages[pages.length - 2];  
        prePage.backAddress(this.data.checkboxItems)
    }
    wx.navigateBack() 

    wx: wx.setStorage({
      key: 'namelistnew',
      data: { 'items': this.data.checkboxItems},
  })
  },
});
