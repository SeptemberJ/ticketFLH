//logs.js
const util = require('../../utils/util.js')
var model = require('../../model/model.js')
var appjs = require('../../app.js')

const app = getApp()

Page({
  data: {
    openid: '',
    id:'',
    credno:'',
    name: '',
    phone: '',
    cardid: '',
    showTopTips: false,
    radioItems: [
      { name: '成人', value: '0',check:false},
      { name: '儿童', value: '1'}
    ],
  },
  onLoad: function () {
    var _this = this;
      wx.getStorage({
      key: 'peoplelist_detail',
      success: function (res) {
        console.log(res)
        var id = res.data.id;
        var name = res.data.name;
        var credno = res.data.credno;
        var ftype = res.data.ftype;
        _this.setData({
          id: id,
          name: name,
          credno: credno,
          radiovalue: ftype
        })
        for (var i = 0, len = _this.data.radioItems.length; i < len; ++i) {
         
          if (_this.data.radioItems[i].value == _this.data.radiovalue){
         
            _this.data.radioItems[i].checked = true;
          }else{
            _this.data.radioItems[i].checked = false;
          }       
          console.log(_this.data.radioItems)
        }
        _this.setData({
          radioItems: _this.data.radioItems,
        })

      }
    })



    
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    console.log(e.detail.value)
    console.log(876778)
    console.log(this.data.radioItems)
    console.log(radioItems)
    console.log("radioItems=====")
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      radiovalue: e.detail.value
    });
    console.log(this.data.radioItems)
    console.log(this.data.radiovalue)
  },
 
  name: function (e) {   //获取input昵称输入的值
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },


  credno: function (e) {   //获取input证件号输入的值
    var that = this;
    that.setData({
      credno: e.detail.value
    })
  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
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
  updata:function(){
    if (this.data.name == '') {
      wx.showModal({
        content: '请输入真实姓名',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    }
    else if (this.data.credno == '') {
      wx.showModal({
        content: '请输入证件号',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    } else {
      var _this = this;
      console.log(_this.data.name)
      console.log(_this.data.credno)
      console.log(_this.data.radiovalue)
      console.log(88899999006666)
  
      // var datatable = {
      //   fopenid: app.globalData.openid,
      //   realname: _this.data.name,
      //   credno: _this.data.cardid,
      //   ftype: _this.data.radiovalue
      // }
  
      wx.request({
        url: appjs.url + 'busUser?id=' + _this.data.id + '&realname=' + _this.data.name + '&credno=' + _this.data.credno + '&ftype=' + _this.data.radiovalue,
        method: "put",
        header: {
          'content-type': 'application/json'
        },
        data: { 
          // id: _this.data.id,
          // realname: _this.data.name,
          // credno: _this.data.credno,
          // ftype: _this.data.radiovalue,
          },
        success: function (res) {
          if (res.code == 2) {
            wx.showToast({
              title: '数据异常',
              icon: 'success',
              duration: 1500
            })
          }
        }
      })
      wx.navigateTo({
        url: '/pages/peoplelist/peoplelist'
      })//保留当前页面能返回前一个页面
    }
  },
  deletedata: function () {
    var _this = this;
    console.log('_this.data.id')
    console.log(_this.data.id)
    console.log(typeof _this.data.id)
    wx.showModal({
      title: '删除',
      content: '确认删除该成员！',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.request({
            url: appjs.url + 'busUser?id=' + _this.data.id,
            method: "delete",
            header: {
              'content-type': 'application/json'
            },
            data:
              {
                // id: _this.data.id
              },
            success: function (res) {
              if(res.data.code == 1){
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1500
                })
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 1500
                })
              }
             
            }
          })
          wx.navigateTo({
            url: '/pages/peoplelist/peoplelist'
          })//保留当前页面能返回前一个页面
        } else {


        }
      }
    });


   
  },
});
  