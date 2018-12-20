//logs.js
const util = require('../../utils/util.js')
var appjs = require('../../app.js')
var QRCode = require('../../utils/code.js');
var md5 = require('../../utils/md5.js');
var _CryptoJS = require('../../utils/des.js');

var qrcode;
const app = getApp()

Page({
  data: {
    namelist2: [],
    namelist1:[],
    fstatus:'',
    namelist:{},
    totalprice:2,
    canDo: false,
    price:'',
    phone:'',
    cardid:'',
    ticketnum:0,
    showTopTips: false,
    accounts: ["小明", "小红", "小方"],
    accountIndex: [],
    date: "",
    items:[],
    newforderNo:''
  },
  onLoad: function () {
    var openid = app.globalData.openid
    var _this = this
    wx.getStorage({
      key: 'namelist',
      success: function (res) {
        var names = res.data.names;
        var ids = res.data.ids;
        var ticketnum = names.length;
        _this.setData({
          namelist: names,
          idlist: ids,
          ticketnum: ticketnum,
        })
        var totalprice = _this.data.price * _this.data.ticketnum;
        _this.setData({
          totalprice: totalprice
        })
      }
    })

    wx.getStorage({
      key: 'Array',
      success: function (res) {
        var Array = res.data;
        _this.setData({
          Array: Array, 
          openid:openid, 
          price: Array.fjiage
        })
        if (Array.fzws_Surplus == 0){
          _this.setData({
            canDo: true
          })
        }
      },
    }) 
    _this.getcanDo(),

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
        var fzws = res.data.fzws;
        var FBillNO = res.data.FBillNO;
        _this.setData({
          fzws: fzws,
          FBillNO: FBillNO,
        })
      },
    })  

    // wx.getStorage({
    //   key: 'selectlist',
    //   success: function (res) {
    //     console.log(res)
    //     var items = res.data.items;
    //     _this.setData({
    //       items: items,
    //     })
    //     console.log(99995)
    //     console.log(_this.data.items)
    //     console.log(99995)
    //   },
    // }) 

   

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
      key: 'orderlist',
      success: function (res) {
        var orderlist = res.data.orderlist;
        _this.setData({
          orderlist: orderlist,
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
        } else {
          _this.setData({
            phone: res.data.userInfo.mobile,
            // name: res.data.userInfo.fname,
            cardid: res.data.userInfo.fscard,
          })
        }
      }

    }) 
  },

  getcanDo:function(){
    if (parseInt(this.data.totalprice) == 0){
      var canDo = false;
      this.setData({
        canDo: canDo,
      })
    }
    var totalprice = this.data.price * this.data.ticketnum;
    this.setData({
      totalprice: totalprice
    })
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
    if (this.data.ticketnum > parseInt(this.data.fzws) || this.data.ticketnum<1)    {
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
  backAddress:function(listData){
    this.setData({
      namelist1: listData
    })
    var listlist = [];
    var newitem = [];
    for (var i = 0, lenI = listData.length; i < lenI; ++i) {     
      if (listData[i].checked == true) {
        listlist.push(listData[i])
        var obj = {};
        obj.userEntryId = listData[i].id;
        newitem.push(obj);
        }
      }
    var ticketnum = listlist.length;
    this.setData({
      listlist: listlist,
      ticketnum: ticketnum,
      newitem: newitem,
    
    })
    var totalprice = this.data.price * this.data.ticketnum;
    this.setData({
      totalprice: totalprice,
    })
    wx: wx.setStorage({
        key: 'selectlist',
      data: { 'items': listData},
    })
  },

  changepage:function(){
    wx.navigateTo({
      url: '/pages/select_person/select_person'
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
  // bindDateChange: function (e) {
  //     this.setData({
  //         date: e.detail.value
  //     })
  // },
  
  bindCountryCodeChange: function(e){
      console.log('picker country code 发生选择改变，携带值为', e.detail.value);
      this.setData({
          countryCodeIndex: e.detail.value
      })
  },

  bindCountryChange: function(e) {
      console.log('picker country 发生选择改变，携带值为', e.detail.value);
      this.setData({
          countryIndex: e.detail.value
      })
  },
  // bindAccountChange: function(e) {
  //     console.log('picker account 发生选择改变，携带值为', e.detail.value);

  //     this.setData({
  //         accountIndex: e.detail.value
  //     })
  // },
  bindAgreeChange: function (e) {
      this.setData({
          isAgree: !!e.detail.value.length
      });
  },
  changetolog:function(){
    var thistime = new Date().getTime()
    console.log(new Date())//当前时间日期格式
    var date2 = new Date()//当前时间
    // console.log(thistime)//当前时间戳
    // console.log('thistime-----')    
    console.log(this.data.Array.FtzspDate)//停止售票时间
    var fff = this.data.Array.FtzspDate
    var t = Date.parse(fff);
    console.log(t)
    // if (!isNaN(t)) {
    // 计算结束时间 
    console.log(new Date(Date.parse(fff.replace(/-/g, "/"))))
    var date1 = new Date(Date.parse(fff.replace(/-/g, "/")))//停止售票时间
    console.log(date1 < date2)
    console.log(date1 > date2)
    // 提交验证
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.phone))) {
      wx.showModal({
        content: '您输入的手机号格式不正确',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    } else if (this.data.cardid == ''){
      wx.showModal({
        content: '请输入身份证号',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    } else if (this.data.ticketnum ==''){
      wx.showModal({
        content: '请选择乘车人员',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
    } 
    else if (this.data.namelist1.length == 0) {
      wx.showModal({
        content: '请选择出行人员',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
    } else if (date1 < date2){
      wx.showModal({
        content: '已停止售票',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
    }
    else{
      var totalprice=this.data.price*this.data.ticketnum;
      var _this = this;
      _this.setData({
        totalprice: totalprice
      })
      var newarrary = _this.data.items;
      var newitem = []; 
      var newlist = [];
      var idlist = _this.data.idlist;
      for (var i = 0, lenI = newarrary.length; i < lenI; ++i) {
        for (var j = 0, lenJ = idlist.length; j < lenJ; ++j){
          if (newarrary[i].id == idlist[j]){
            // newlist.push(newarrary[i]);
            // console.log(newlist)           
            var obj = {};
            obj.userEntryId = newarrary[i].id;
            newitem.push(obj);
            break;   
          }          
        }
        _this.setData({
          newlist: newlist
        })
      }     
        console.log(_this.data.Array)
        _this.data.datetime = _this.data.date + _this.data.Array.FSDate + ':00'
        console.log(_this.data.datetime)
        // _this.data.datetime = _this.data.Array.FSDate.slice(10, 16)
        // Array[j].FSDate = Array[j].FSDate.slice(10, 16)
        wx.request({
          url: appjs.url + 'order',
          method: "post",
          header: {
            'content-type': 'application/json'
          },
          data: {
            'fopenid': app.globalData.openid,
            'Ffcdd': _this.data.Array.Ffcdd,
            'Fqsrq': _this.data.datetime,
            'Fscdd': _this.data.Array.Fscdd,
            'famount': JSON.stringify(_this.data.totalprice),
            'fmobiel': _this.data.phone,
            'fpaigongdanNo': _this.data.Array.FBillNO,
            'fticketNum': _this.data.ticketnum,
            'fzws': _this.data.Array.fzws,
            'items': _this.data.newitem,
            'FgqsxDate': _this.data.Array.FgqsxDate,
            'FtzspDate': _this.data.Array.FtztpDate,
            'fid_z': _this.data.Array.fid_z
          },
          success: function (res) {
            _this.setData({
              // fstatus: 2,
              canDo: true,
            })
            if (res.data.code === 0) {
              _this.setData({
                newforderNo: res.data.orderno,
              })
              var newforderNo = res.data.orderno
              var newticketid = res.data.ordernoid
              var str1 = _this.encryptByDES(newticketid);
              var site = res.data.seatlist
              var strlist = []
              for (var i = 0; i < site.length; i++) {
                var str11 = site[i].id.toString()
                var str12 = _this.encryptByDES(str11);
                strlist.push(str12);
                _this.setData({
                  seats: strlist
                })
              }
              var newindex = []
              for (var i = 0; i < _this.data.seats.length; i++) {
                qrcode = new QRCode(i.toString(), {
                  text: _this.data.seats[i],
                  width: 150,
                  height: 150,
                  colorDark: "#000000",
                  colorLight: "#ffffff",
                  correctLevel: QRCode.CorrectLevel.H,
                });
                newindex.push(i)
                _this.setData({
                  newindex: newindex,
                })
              }
              // qrcode = new QRCode('canvas', {
              //   text: str1,
              //   width: 150,
              //   height: 150,
              //   colorDark: "#000000",
              //   colorLight: "#ffffff",
              //   correctLevel: QRCode.CorrectLevel.H,
              // });

              console.log(res.data.ordernoid)
              console.log(_this.data.openid)
              console.log(app.globalData.openid)
              console.log(_this.data.orderlist)
              console.log(_this.data.famount)
              console.log('起调微信支付接口之前')
              console.log(_this.data.totalprice)
              if (_this.data.famount != 0) {
                var strBody = '青客小程序订票';
                var strBody1 = strBody.toString()
                console.log(typeof (strBody1))
                console.log('起调微信支付接口=====')
                //微信支付
                // 这个接口 没调成功  ，所以 支付 那边没数据
                wx.request({
                  url: appjs.url + 'JsapiPay?total_fee=' + _this.data.totalprice * 100 + '&open_id=' + app.globalData.openid + '&body=' + '' + '&out_trade_no=' + newforderNo,
                  method: "post",
                  success: function (res) {
                    //微信支付
                    console.log(res)
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
                            console.log('加载该状态的方法666')
                          }
                        })
                        wx.showToast({
                          title: '支付成功!',
                          icon: 'success',
                          duration: 1000
                        })
                        // 成功清空
                        wx.removeStorageSync('namelist')
                        wx.removeStorageSync('phone')
                        wx.removeStorageSync('cardid')
                        console.log(11111111)
                        var canDo = true;
                        _this.setData({
                          fstatus: 2,
                          canDo: canDo
                        })
                        console.log(_this.data.canDo)
                        console.log(22222222)
                      },
                      'fail': (res) => {
                        wx.request({
                          url: appjs.url + 'JsapiPayResult3.do?oppenid=' + app.globalData.openid,
                          method: "get",
                          success: function (res) {
                            console.log('加载该状态的方法777')
                          }
                        })
                        wx.showToast({
                          title: '支付失败！',
                          icon: 'none',
                          duration: 1000
                        })
                        wx.switchTab({
                          url: '/pages/histrionic/histrionic'
                        })
                        // 失败清空
                        wx.removeStorageSync('namelist')
                        wx.removeStorageSync('phone')
                        wx.removeStorageSync('cardid')
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
              }//1009 改了下位置  下单成功直接加载支付

              wx.request({
                url: appjs.url + 'orderList',
                method: "get",
                data:
                  {
                    open_id: app.globalData.openid,
                  },
                success: function (res) {
                  var ststus1 = [];
                  var orderlist = res.data.orderlist;
                  for (var i = 0, lenI = orderlist.length; i < lenI; ++i) {
                    if (orderlist[i].fstatus == 1) {
                      ststus1.push(orderlist[i]);
                    }
                    _this.setData({
                      orderlist: ststus1[0],
                      fstatus: ststus1[0].fstatus
                    })
                  }
                  _this.setData({
                    forderNo: _this.data.orderlist.forderNo,
                    fticketNum: _this.data.orderlist.fticketNum,
                    famount: _this.data.orderlist.famount,
                    fstatus: _this.data.orderlist.fstatus,
                  })
                  var famount = _this.data.orderlist.famount;
                  var str1 = _this.encryptByDES(newticketid);
                  console.log("des加密数据================")
                  // console.log(_this.data.orderlist.id)
                  // var hash = md5.hexMD5(_this.data.orderlist.id);
                  // console.log(hash)
                  console.log("加密数据================")
                  qrcode = new QRCode('canvas', {
                    text: str1,
                    width: 150,
                    height: 150,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H,
                  });
                }
              })
            } else if (res.data.code === 4) {
              wx.showModal({
                content: '下单失败',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/histrionic/histrionic'
                    })
                  }
                }
              });
            } else if (res.data.code === 3) {
              wx.showModal({
                title: '下单失败',
                content: '订购票数大于剩余票数！',
                success: function (res) {
                  if (res.confirm) {
                    _this.setData({
                      canDo: false
                    })
                  } else if (res.cancel) {
                    _this.setData({
                      canDo: false
                    })
                  }
                }
              })
            } else if (res.data.code === 5) {
              wx.showModal({
                title: '下单失败',
                content: '没有用户信息！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    _this.setData({
                      canDo: false
                    })
                  } else if (res.cancel) {
                    _this.setData({
                      canDo: false
                    })
                  }
                }
              })
            } else if (res.data.code === 1) {
              wx.showModal({
                title: '下单失败',
                content: '请重新下单！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    _this.setData({
                      canDo: false
                    })
                  }
                }
              })
            }
          }
        })
    }




    // else
    // 提交成功跳转页面
    // wx.navigateTo({
    //   url:'/pages/histrionic/histrionic'
    // })//保留当前页面能返回前一个页面
  },
  encryptByDES: function (message) {
    var key = '90908080';
    //把私钥转换成16进制的字符串
    var keyHex = _CryptoJS.CryptoJS.enc.Utf8.parse(key);
    // debugger
    //模式为ECB padding为Pkcs7
    var encrypted = _CryptoJS.CryptoJS.DES.encrypt(message, keyHex, {
      mode: _CryptoJS.CryptoJS.mode.ECB,
      padding: _CryptoJS.CryptoJS.pad.Pkcs7
    });
    //加密出来是一个16进制的字符串
    // debugger
    var rruurr = encrypted.ciphertext.toString()
    return rruurr
    // return encrypted.ciphertext.toString();
  },

  changeto:function(){
      wx.navigateTo({
        url:'/pages/select_person/select_person'
    })//保留当前页面能返回前一个页面
  },
});
