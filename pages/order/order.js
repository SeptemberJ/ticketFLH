//logs.js
const util = require('../../utils/util.js')
var appjs = require('../../app.js')
var QRCode = require('../../utils/code.js');
var md5 = require('../../utils/md5.js'); 
var _CryptoJS = require('../../utils/des.js');
console.log(_CryptoJS)

var qrcode;
const app = getApp()

Page({
  data: {
    status:'',
    seats:[],
    fstatus:'',
    namelist:{},
    totalprice:0,
    canDo: false,
    price:2,
    phone:'',
    cardid:'',
    ticketnum:1,
    showTopTips: false,
    accounts: ["小明", "小红", "小方"],
    accountIndex: [],
    date: "",
    items:[],
    loadingHidden: true,
    // datatable1:
    // [{ userEntryId: "1232" }, { userEntryId: "dsfa" }, { userEntryId: "14342" }]
  },
  onLoad: function () {
    var openid = app.globalData.openid
    var _this = this
    wx.getStorage({
      key: 'histryArr',
      success: function (res) {
        console.log(res)
        var Array = res.data;
        var newtime = new Date(Array.Fqsrq);
        var newfqsrqdate = newtime.getTime()//发车时间
        
        var time = new Date().getTime()//当前时间
        
        var enddeltime = newfqsrqdate - 30*60*1000//最晚退票时间=发车时间-30min
        
        var status1 = 5        
        if (enddeltime < time){
          var status = 0
        }else{
          var status = status1.toString()
        }
        
        _this.setData({
          Array: Array,  
          id: Array.id,
          site: Array.seatlist,
          status: status,
          status1: status1
        })
        console.log('========输出strobj=======')
        if (_this.data.site.length != 0){
          var strlist = []
          console.log(_this.data.site)
          for (var i = 0; i < _this.data.site.length; i++) {
            var obj ={}
            console.log(_this.data.site[i].id)
            var str11 = _this.data.site[i].id.toString() + ',' + _this.data.Array.forderNo
            
            console.log(str11)
            var str12 = _this.encryptByDES(str11);
            console.log(str12)
            strlist.push(str12);
            console.log(strlist)
            console.log(_this.data.site)
            console.log(_this.data.site[i].id)
            console.log('hehre-------------------------------')
            obj.strlist = str12
            obj.fcheckStatus = _this.data.site[i].fcheckStatus
            // obj.还应该有座位的id
            obj.id = _this.data.site[i].id
            obj.fseat = _this.data.site[i].fseat
            strlist.push(obj);
            console.log(strlist)
            console.log(strlist[0])
            _this.setData({
              str12: str12,
              seats: strlist
            })
          }
        }
        // omne--------------------
        if (_this.data.seats.length != 0){
          var newindex = []
          var obj = {}
          for (var i = 0; i < _this.data.seats.length; i++) {
            console.log(i)
            qrcode = new QRCode(i.toString(), {
              text: _this.data.seats[1].strlist,
              // text: _this.data.seats[i].strlist,
              width: 150,
              height: 150,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H,
            });
            //debugger
            // _this.data.seats[i][1] = i
             _this.data.seats[i].i =  i
            console.log('_this.data.seats----------')
            console.log(_this.data.seats)
            _this.setData({
              newindex: _this.data.seats,
            })
            // console.log('_this.data.newindex-----')            
            // console.log(_this.data.newindex)
            // console.log('_this.data.newindex-----')
            // console.log(_this.data.newindex[0].i)
          }
        }
        
        
        var famount = Array.famount;
        var fstatus = Array.fstatus;
        console.log(Array.fstatus)
        console.log('=================Array.fstatus==============')        
        var forderNo = Array.forderNo;

        // var num = famount;//定义一个变量num用来存放数字
        // var a = famount % 10;//num对10取余，可得到个位数
        // var b = famount / 10;//num除10得到十位数，由于b为整形，小数位会自动省略
        // console.log(a)
        // console.log(parseInt(b))
        // var famount = parseInt(a) * parseInt(b)
        console.log(famount)
        _this.setData({
          famount: famount,
          fstatus: fstatus,
          forderNo:forderNo,
        })  
        console.log("_this.data.fstatus===========") 
        console.log(_this.data.fstatus) 
        console.log(_this.data.fstatus)

        if (_this.data.fstatus == 1){
          var canDo = false;
             _this.setData({
            canDo: canDo,
          })
          console.log(_this.data.canDo)
        }else {
          var canDo = true;
          _this.setData({
            canDo: canDo,
          })
          console.log(_this.data.canDo)
        }
        console.log(_this.data.canDo)
        console.log("_this.data.canDo")  
        console.log(typeof (_this.data.status))
        console.log(_this.data.status)
      },
      
    }) 
  //--------------------------
    wx.getStorage({
      key: 'pageindex',
      success: function (res) {
        var getmintues = res.data.minutes;
        var startregion = res.data.city1;
        var endregion = res.data.city2;
        var date = res.data.date;
        _this.setData({
          date: date,
          city1: startregion,
          city2: endregion,
          minutes: getmintues
        })
      }
    })
    //获取storage内信息渲染到页面 
    wx.getStorage({
      key: 'fzws',
      success: function (res) {
        console.log('fzws-----------------')
        var fzws = res.data.fzws;
        var FBillNO = res.data.FBillNO;
        _this.setData({
          fzws: fzws,
          FBillNO: FBillNO,
        })
        // console.log(99996)
        // console.log(_this.data.fzws)
        // console.log(_this.data.FBillNO)
        // console.log(99996)
      },
      fail: (err)=>{
        console.log(err)
      }
    })  

    wx.getStorage({
      key: 'selectlist',
      success: function (res) {
        console.log('selectlist-------------')
        var items = res.data.items;
        _this.setData({
          items: items,
        })
        // console.log(99995)
        // console.log(_this.data.items)
        // console.log(99995)
      },
    }) 

    wx.getStorage({
      key: 'namelist',
      success: function (res) {
        var names = res.data.names;
        var ids = res.data.ids;
        var ticketnum = names.length;
        _this.setData({
          namelist: names,
          idlist : ids,
          ticketnum: ticketnum
        })
        var totalprice = _this.data.price * _this.data.ticketnum;
        _this.setData({
          totalprice: totalprice
        })
      }
    })

    wx.getStorage({
      key: 'phone',
      success: function (res) {
        var phone = res.data.phone;
        _this.setData({
          phone: phone,
        })
      }
    })

    wx.getStorage({
      key: 'cardid',
      success: function (res) {
        var cardid = res.data.cardid;
        _this.setData({
          cardid: cardid,
        })
      }
    })

    // wx.getStorage({
    //   key: 'ticketnum',
    //   success: function (res) {
    //     var ticketnum = res.data.ticketnum;
    //     _this.setData({
    //       ticketnum: ticketnum,
    //     })
    //     console.log(_this.data.ticketnum)
    //   }
    // })
 
    // qrcode = new QRCode('canvas', {
      
    //   text: "0",
    //   width: 150,
    //   height: 150,
    //   colorDark: "#000000",
    //   colorLight: "#ffffff",
    //   correctLevel: QRCode.CorrectLevel.H,
    // });
  },
  onShow:function(){
    var _this = this
    wx.getStorage({
      key: 'histryArr',
      success: function (res) {
        console.log('histryArr------------')
        console.log(res)
        var Array = res.data;
        var newtime = new Date(Array.Fqsrq);
        var newfqsrqdate = newtime.getTime()//发车时间
        var time = new Date().getTime()//当前时间
        var enddeltime = newfqsrqdate - 30*60*1000//最晚退票时间=发车时间-30min
        var status1 = 5
        if (enddeltime < time) {
          var status = 0
        } else {
          var status = status1.toString()
        }
        console.log('Array.Fqsrq==========')
        _this.setData({
          Array: Array,
          id: Array.id,
          site: Array.seatlist,
          status: status
        })
        console.log('========输出strobj=======')
        if (_this.data.site.length != 0) {
          var strlist = []
          for (var i = 0; i < _this.data.site.length; i++) {
            var obj = {}
            console.log(_this.data.site[i].id)
            // var str11 = _this.data.site[i].id.toString()
            var str11 = _this.data.site[i].id.toString() + ',' + _this.data.Array.forderNo
            console.log(str11)
            var str12 = _this.encryptByDES(str11);
            // console.log(str12)
            // strlist.push(str12);
            console.log('strlist==========================')
            console.log(strlist)
            console.log(_this.data.site)
            console.log('------------------------------------------')
            console.log(_this.data.site)
            console.log(_this.data.site[i])
            console.log(_this.data.site[i].id)
            obj.strlist = str12
            obj.fcheckStatus = _this.data.site[i].fcheckStatus
            // obj.还应该有座位的id
            obj.id = _this.data.site[i].id
            obj.fseat = _this.data.site[i].fseat
            strlist.push(obj);
            console.log(strlist)
            console.log(strlist[0])
            _this.setData({
              str12: str12,
              seats: strlist
            })
          }
        }
        if (_this.data.seats.length != 0) {
          console.log(_this.data.seats)
          var newindex = []
          var obj = {}
          for (var i = 0; i < _this.data.seats.length; i++) {
            console.log(i)
            qrcode = new QRCode(i.toString(), {
              text: _this.data.seats[i].strlist,
              width: 150,
              height: 150,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H,
            });
            _this.data.seats[i].i = i
            console.log(_this.data.seats)
            _this.setData({
              newindex: _this.data.seats,
            })
            console.log('_this.data.newindex-----')
            console.log(_this.data.newindex)
            console.log('_this.data.newindex-----')
            console.log(_this.data.newindex[0].i)
          }
        }
        // 
        // qrcode = new QRCode('canvas', {
        //   text: str1,
        //   width: 150,
        //   height: 150,
        //   colorDark: "#000000",
        //   colorLight: "#ffffff",
        //   correctLevel: QRCode.CorrectLevel.H,
        // });
        var famount = Array.famount;
        var fstatus = Array.fstatus;
        console.log(Array.fstatus)
        console.log('=================Array.fstatus==============')
        var forderNo = Array.forderNo;
        // var num = famount;//定义一个变量num用来存放数字
        // var a = famount % 10;//num对10取余，可得到个位数
        // var b = famount / 10;//num除10得到十位数，由于b为整形，小数位会自动省略
        // console.log(a)
        // console.log(parseInt(b))
        // var famount = parseInt(a) * parseInt(b)
        console.log(famount)
        _this.setData({
          famount: famount,
          fstatus: fstatus,
          forderNo: forderNo,
        })
        console.log("_this.data.fstatus===========")
        console.log(_this.data.fstatus)
        console.log(_this.data.fstatus)
        if (_this.data.fstatus == 1) {
          var canDo = false;
          _this.setData({
            canDo: canDo,
          })
          console.log(_this.data.canDo)
        } else {
          var canDo = true;
          _this.setData({
            canDo: canDo,
          })
          console.log(_this.data.canDo)
        }
        console.log(_this.data.canDo)
        console.log("_this.data.canDo")
        console.log(typeof (_this.data.status))
        console.log(_this.data.status)
      },
    }) 
  },
  delbuy:function(e){
    var index = e.currentTarget.dataset.index;
    var seatnum = this.data.newindex[index].fseat
    var seatId = this.data.newindex[index].id
    var id = this.data.Array.id
    var fseat = this.data.Array.fticketNum - 1
    var famount = this.data.Array.famount
    var price = this.data.Array.famount / this.data.Array.fticketNum
    var _this = this
    var newid = _this.data.id
    _this.setData({
      loadingHidden: false,
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
        console.log(res.data.orderlist)
        console.log(_this.data.newindex)
        for (var i = 0, lenI = res.data.orderlist.length; i < lenI; ++i) {
          if (newid == res.data.orderlist[i].id){
            console.log(res.data.orderlist[i])
            console.log('新的  order的数据')
            console.log(res.data.orderlist[i].seatlist)
            console.log('新的  order的座位')
            for (var j = 0, lenJ = res.data.orderlist[i].seatlist.length; j < lenJ; ++j) {
              // 循环 座位里边的状态
              console.log(res.data.orderlist[i].seatlist[j].fcheckStatus)
              console.log(_this.data.newindex[j].fcheckStatus)
              _this.data.newindex[j].fcheckStatus=res.data.orderlist[i].seatlist[j].fcheckStatus
              if (_this.data.newindex[index].fcheckStatus == 2 && _this.data.newindex[index].id == res.data.orderlist[i].seatlist[j].id){
                console.log('一样')
                _this.setData({
                  loadingHidden: true,
                })
                wx.showModal({
                  content: '车票不能取消！',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                });
              } else if (_this.data.newindex[index].fcheckStatus == 0 && _this.data.newindex[index].id == res.data.orderlist[i].seatlist[j].id){
                console.log('不一样')
                _this.setData({
                  loadingHidden: true,
                })
                wx.showModal({
                  title: '取消车票',
                  content: '确认取消这张车票！',
                  confirmText: "确认",
                  cancelText: "取消",
                  success: function (res) {
                    console.log(res);
                    if (res.confirm) {
                      _this.setData({
                        loadingHidden: false,
                      })
                      wx.request({
                        url: appjs.url + 'delpayorder?forderId=' + id + '&seatId=' + seatId + '&seatnum=' + fseat + '&total=' + famount * 100 + '&famount=' + price * 100,
                        method: "get",
                        header: {
                          //传输接收数据的头（！！！）
                          'content-type': 'application/json'
                        },
                        data:
                          {
                          },
                        success: function (res) {
                          console.log(res)
                          if (res.data.code == 1) {
                            _this.setData({
                              loadingHidden: true,
                            })
                            wx.showToast({
                              title: '取消成功',
                              icon: 'none',
                              duration: 2000
                            })
                            wx.switchTab({
                              url: '/pages/histrionic/histrionic'
                            })//保留当前页面能返回前一个页面

                          } else {
                            _this.setData({
                              loadingHidden: true,
                            })
                            wx.showToast({
                              title: '取消失败',
                              icon: 'none',
                              duration: 2000
                            })
                          }
                        }
                      })
                    }
                  }
                })
              }
              console.log('_this.data.newindex[j]')         
            }
            break
          }
        }
      }
    })
    
    // 点击取消 ，延时， 重新加载页面数据，获取当前车票的使用状态 ，判断时候可以取消
    // setTimeout(function () {
    // 要延时执行的代码
    //  console.log(11111)
    //   wx.showModal({
    //     title: '取消车票',
    //     content: '确认取消这张车票！',
    //     confirmText: "确认",
    //     cancelText: "取消",
    //     success: function (res) {
    //       if (res.confirm) {//重新加载数据       
    //       }
    //     }
    //   })
    // }, 3000) //延迟时间 
  },
  delbuy1222:function(e){
      var index = e.currentTarget.dataset.index;
      var seatnum = this.data.newindex[index].fseat
      var seatId = this.data.newindex[index].id
      var id = this.data.Array.id
      var fseat = this.data.Array.fticketNum - 1
      var famount = this.data.Array.famount
      var price = this.data.Array.famount / this.data.Array.fticketNum
      wx.showModal({
        title: '取消车票',
        content: '确认取消这张车票！',
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            wx.request({
              url: appjs.url + 'delpayorder?forderId=' + id + '&seatId=' + seatId + '&seatnum=' + fseat + '&total=' + famount * 100 + '&famount=' + price * 100,
              // url: appjs.url + 'delpayorder?forderId=' + id,
              method: "get",
              header: {
                //传输接收数据的头（！！！）
                'content-type': 'application/json'
              },
              data:
                {
                },
              success: function (res) {
                console.log(res)
                // that.setData({
                //   loadingHidden: true,
                // })
                if (res.data.code == 1) {
                  wx.showToast({
                    title: '取消成功',
                    icon: 'none',
                    duration: 1500
                  })
                  wx.switchTab({
                    url: '/pages/histrionic/histrionic'
                  })//保留当前页面能返回前一个页面

                } else {
                  wx.showToast({
                    title: '取消失败',
                    icon: 'none',
                    duration: 1500
                  })
                }
              }
            })
          }
        }
      });
  },

  encryptByDES: function(message) {
    var key = '90908080';
    //把私钥转换成16进制的字符串
    var keyHex = _CryptoJS.CryptoJS.enc.Utf8.parse(key);
    //模式为ECB padding为Pkcs7
    var encrypted = _CryptoJS.CryptoJS.DES.encrypt(message, keyHex, {
      mode: _CryptoJS.CryptoJS.mode.ECB,
      padding: _CryptoJS.CryptoJS.pad.Pkcs7
    });
    //加密出来是一个16进制的字符串
    var rruurr = encrypted.ciphertext.toString()
    console.log('========================================================')
    // console.log(rruurr)
    return rruurr
    // return encrypted.ciphertext.toString();
  },

  tapHandler: function () {
    qrcode.makeCode(this.data.Array.id);  //用元素对应的code更新二维码
  },


//车票数量最小为1  所以这个方法暂时没用
  getcanDo:function(){
    console.log(this.data.fstatus)
    if (parseInt(this.data.fstatus) == 1){
      var canDo = true;
      this.setData({
        canDo: canDo,
      })
      console.log(canDo)
      console.log(this.data.canDo)
    }
    console.log(canDo)
    console.log(this.data.canDo)
    console.log("this.data.canDo")
   
  },




  phone: function (e) {//获取input输入的手机号值
    var that = this;
    that.setData({
      phone: e.detail.value
    })
    wx.setStorage({
      key: 'phone',
      data: { 'phone': that.data.phone },
    })
  },
  cardid: function (e) {//获取input输入身份证号的值
    var that = this;
    that.setData({
      cardid: e.detail.value
    })
    wx.setStorage({
      key: 'cardid',
      data: { 'cardid': that.data.cardid},
    })
  },
  ticketnum: function (e) {
    var that = this;
    that.setData({
      ticketnum: e.detail.value
    })
    wx.setStorage({
      key: 'ticketnum',
      data: { 'ticketnum': that.data.ticketnum },
    })
    if (this.data.ticketnum > parseInt(this.data.fzws) || this.data.ticketnum<1){
      wx.showModal({
        content: '您输入的购买车票的数量不在合法范围内',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
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

  // 减一
  minus:function(){
    var count = this.data.ticketnum;
    count = parseInt(count) - 1;
     this.setData({
       ticketnum: count
    })
     wx.setStorage({
       key: 'ticketnum',
       data: { 'ticketnum': this.data.ticketnum },
     })
    // if (count > 7 || count < 1) {
    //   wx.showModal({
    //     content: '您输入的车票数量不在合法范围内',
    //     showCancel: false,
    //     success: function (res) {
    //       if (res.confirm) {
    //       }
    //     }
    //   });
    // }
    if(count < 1 ){
       wx.showModal({
        content: '购买车票数不能小于1',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
       count = parseInt(count) + 1;
       this.setData({
         ticketnum: count
       })
    } else if (count > parseInt(this.data.fzws)) {
      // 获取剩余车票数量并做判断
      wx.showModal({
        content: '购买车票数不能大于剩余车票数',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    }  
    var totalprice = this.data.price * this.data.ticketnum;
    this.setData({
      totalprice: totalprice
    })
  },
  // 加一
  add: function () {
    var count = this.data.ticketnum;
    count = parseInt(count) + 1;
    this.setData({
      ticketnum: count
    })
    
    wx.setStorage({
      key: 'ticketnum',
      data: { 'ticketnum': this.data.ticketnum },
    })
    // 获取剩余车票数量、并判断输入的车票数量是否大于剩余的车票数量
    // if (count > 7 || count < 1) {
    //     wx.showModal({
    //       content: '您输入的车票数量不在合法范围',
    //       showCancel: false,
    //       success: function (res) {
    //         if (res.confirm) {
    //         }
    //       }
    //     });
    // }
    if (count > parseInt(this.data.fzws)) {
        wx.showModal({
          content: '购买车票数不能大于剩余车票数量',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        });
        count = parseInt(count) - 1;
        this.setData({
          ticketnum: count
        })
    } else if(count < 1) {
      wx.showModal({
        content: '购买车票数不能小于1',
        showCancel: false,
        success: function (res){
          if (res.confirm) {
          }
        }
      });
    }
    var totalprice = this.data.price * this.data.ticketnum;
    this.setData({
      totalprice: totalprice
    })
  },
  changeto:function(){
      wx.navigateTo({
        url:'/pages/select_person/select_person'
    })//保留当前页面能返回前一个页面
  },

  toPay:function(){
    var _this = this;
    if (_this.data.famount != 0) {
      var strBody = '青客小程序订票'          
      //微信支付
      wx.request({
        url: appjs.url + 'JsapiPay?total_fee=' + _this.data.famount * 100 + '&open_id=' + app.globalData.openid + '&body=' + '' + '&out_trade_no=' + _this.data.forderNo,
        method: "post",
        success: (res) => {
          //微信支付
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': (res) => {
              wx.request({
                url: appjs.url + 'JsapiPayResult3.do?oppenid=' + app.globalData.openid,
                method: "get",
                success: function (res) {
                  _this.setData({
                    fstatus: 2,
                    canDo: true
                  })
                  console.log('success')
                  console.log(_this.data.canDo)
                }
              })
              // console.log(1111111111111)
              // _this.setData({
              //   fstatus: 2,
              // })
              // console.log(2222222222)
              wx.showToast({
                title: '支付成功!',
                icon: 'success',
                duration: 1000
              })
              //支付成功后 需要生成二维码
              _this.tapHandler();
            },
            'fail': (res) => {
              _this.setData({
                canDo: false,
              })
              wx.request({
                url: appjs.url + 'JsapiPayResult3.do?oppenid=' + app.globalData.openid,
                method: "get",
                success: function (res) {
                  console.log('fail')
                  console.log(_this.data.canDo)                  
                }
              })
            },
            'complete': function (res) {
              _this.setData({
                canDo: true,
              })
              wx.request({
                url: appjs.url + 'JsapiPayResult3.do?oppenid=' + app.globalData.openid,
                method: "get",
                success: function (res) {
                  console.log('rescomplete')
                  console.log(_this.data.canDo)
                }
              })
             }
          })
        },
      })
    }
  }
});
