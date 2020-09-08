// pages/my/mycomment/mycomment.js
const app = getApp()
var util = require("../../../utils/util.js")
var request = require("../../../utils/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mycomment:[],
    select: false,
    tihuoWay: '默认排序',
    ready:false
  },
  bindShow() {
    this.setData({
      select: !this.data.select
    },
      console.log(!this.data.select)
    )
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      tihuoWay: name,
      select: false
    },
      console.log(name)
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "我的回复",
    })
  },
  //显示详情
  detail_info: function (e) {
    var mycomment = this.data.mycomment
    var product_info = mycomment[e.currentTarget.id];
    // wx.setStorage({
    //   key: "product_info",
    //   data: product_info
    // })
    app.globalData.product_info = product_info

    var data_pos = {}
    data_pos['data'] = this.data.collect
    data_pos['pos'] = e.currentTarget.id
    app.globalData.data_pos = data_pos

    wx.navigateTo({ url: '../../details/details' })

  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.onshow()
    var that = this
    var data = {openid:app.globalData.openid}
    request.request('https://www.xianwuzu.cn:443/wx_Code/mycomment', 'GET', data).then(function (res) {
      var mycomment = []

      for (var i = res.length - 1; i >= 0; i--) {
          res[i].time = util.formatDate(res[i].timestamp)
          if (res[i].price == -1)
            res[i].price = '可商议'

          mycomment = mycomment.concat(res[i])
      }
      wx.setStorage({
        key: "mycomment",
        data: mycomment
      })

      that.setData({
        mycomment: mycomment,
        ready: true
      })

    })

  },


onshow:function(){
  var data = { openid: app.globalData.openid }
  var id_pos = app.globalData.id_pos
  var that = this
  var mycomment = []
  wx.getStorage({
    key: "publish_info",
    success: function (res) {
      console.log("ddddddddddddd")
      var publish_info = res.data
      //请求评论过的帖子id
      request.request('https://www.xianwuzu.cn:443/wx_Code/mycomment', 'GET', data).then(function (res) {
        var timestamp = parseInt(Date.parse(new Date()) / 1000);
        for (var i = res.length - 1; i >= 0; i--) {
          var pos = id_pos[res[i]]
          var comment = publish_info[pos]
          if (comment != undefined)
          {
            comment.time = util.time_now_publish(comment.timestamp, timestamp)
            if (comment.price == -1)
              comment.price = '可商议'

            mycomment = mycomment.concat(comment)
          }

        }
        that.setData({
          mycomment: mycomment
        })
        wx.setStorage({
          key: "mycomment",
          data: mycomment
        })

      })
    }
  });

},


  all_sell_buy: function (e) {
    if (e.detail.index == 0) {
      this.get_buy_sell("全部", "mycomment")
    }
    else if (e.detail.index == 1) {
      this.get_buy_sell("出售", "mycomment")
    }
    else {
      this.get_buy_sell("求购", "mycomment")
    }
  },

  get_buy_sell: function (buy_sell, key) {
    var that = this
    if (buy_sell == '全部') {
      wx.getStorage({
        key: key,
        success: function (res) {
          that.setData({
            mycomment: res.data
          })
        }
      });
    }
    else {
      wx.getStorage({
        key: key,
        success: function (res) {
          var data = []
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].buy_sell == buy_sell)
              data.push(res.data[i])
          }
          that.setData({
            mycomment: data
          })
        }
      });
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})