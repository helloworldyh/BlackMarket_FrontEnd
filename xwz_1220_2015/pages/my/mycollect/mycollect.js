// pages/my/mycollect/mycollect.js
const app = getApp()
var util = require("../../../utils/util.js")
var request = require("../../../utils/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    publish_info: [],
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
      title: "我的收藏",
    })
  },
  //点击显示详情
  detail_info: function (e) {
    if (this.endTime - this.startTime < 350)
      {
      var collect = this.data.collect;
      var id = e.currentTarget.id;
      var product_info = this.data.collect[id];
      app.globalData.product_info = product_info
      // wx.setStorage({
      //   key: "product_info",
      //   data: product_info
      // })
      var data_pos = {}
      data_pos['data'] = this.data.collect
      data_pos['pos'] = e.currentTarget.id
      app.globalData.data_pos = data_pos

      wx.navigateTo({ url: '../../details/details' })
     
      }

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
    var data = { openid: app.globalData.openid }
    request.request('https://www.xianwuzu.cn:443/wx_Code/mycollect', 'GET', data).then(function (res) {
      var collect = []

      for (var i = res.length - 1; i >= 0; i--) {
        res[i].span_time = util.formatDate(res[i].timestamp)
        if (res[i].price == -1)
          res[i].price = '可商议'

        collect = collect.concat(res[i])
      }
      wx.setStorage({
        key: "collect",
        data: collect
      })

      that.setData({
        collect: collect,
        ready: true
      })
    })

  },
  onshow: function () {
    var collect = []
    var star_ids = app.globalData.star_ids //'收藏的id'
    console.log(star_ids)
    var id_pos = app.globalData.id_pos
    var that = this
    wx.getStorage({
      key: "publish_info",
      success: function (res) {
        var publish_info = res.data
        var length = star_ids.length
        //倒序，这样最新收藏的就在最上面
        var timestamp = parseInt(Date.parse(new Date()) / 1000);

        for (var i = length - 1; i >= 0; i--) {
          var pos = id_pos[star_ids[i]]
          var product_info = publish_info[pos]
          if (product_info != undefined) {
            product_info.span_time = util.time_now_publish(product_info.timestamp, timestamp)
            if (product_info.price == -1)
              product_info.price = '可商议'
            collect = collect.concat(product_info)
          }

        }
        that.data.publish_info = publish_info
        that.setData({
          collect: collect
        })
        wx.setStorage({
          key: "collect",
          data: collect
        })
      }
    });

  },




  all_sell_buy: function (e) {
    if (e.detail.index == 0) {
      this.get_buy_sell("全部", "collect")
    }
    else if (e.detail.index == 1) {
      this.get_buy_sell("出售", "collect")
    }
    else {
      this.get_buy_sell("求购", "collect")
    }
  },

  get_buy_sell: function (buy_sell, key) {
    var that = this
    if (buy_sell == '全部') {
      wx.getStorage({
        key: key,
        success: function (res) {
          that.setData({
            collect: res.data
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
            collect: data
          })
        }
      });
    }
  },

  //点击时间，判断长按
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  cancel_star:function(e)
  {
    var that = this

    var itemList = ['取消收藏']
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (res.tapIndex == 0) {
          var id = e.currentTarget.id
          var collect = that.data.collect
          var cur_id = app.globalData.id_pos[collect[id].id]


          var data = {
            star_id: collect[id].id,
            star: 0,
            openid: app.globalData.openid
          };
          request.request('https://www.xianwuzu.cn:443/wx_Code/collect', 'GET', data).then(function(){

            var p = app.globalData.star_ids.indexOf(collect[id].id)
            app.globalData.star_ids.splice(p,1)
            that.update_star(-1, cur_id)
            collect.splice(id, 1)
            that.setData({ collect, collect })
          })
        }


      }
    })





  },

  update_star: function (star, cur_id) {


    wx.getStorage({
      key: "publish_info",
      success: function (res) {
        var publish_info = res.data
          publish_info[cur_id].star_ids += star
          wx.setStorage({
            key: "publish_info",
            data: publish_info
          })
      }
    });
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