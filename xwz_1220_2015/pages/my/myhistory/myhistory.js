// pages/my/mycollect/mycollect.js
const app = getApp()
var util = require("../../../utils/util.js")

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    collect: [],
    publish_info: []
  },

  //组件生命周期函数（进入页面就会执行该函数)
  attached: function () {
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
          console.log("errorerrorerrorerrorerrorerror")
          console.log(product_info)
          product_info.span_time = util.time_now_publish(product_info.timestamp, timestamp)
          collect = collect.concat(product_info)
        }
        that.data.publish_info = publish_info
        that.setData({
          collect: collect
        })
      }
    });

  },
  /**
   * 组件的方法列表
   */

  methods: {
    //点击显示详情
    detail_info: function (e) {

      var collect = this.data.collect;
      var id = e.currentTarget.id;
      var id_pos = app.globalData.id_pos;
      var cur_id = id_pos[collect[id].id]
      var product_info = this.data.publish_info[cur_id];

      wx.setStorage({
        key: "product_info",
        data: product_info
      })

      var data_pos = {}
      data_pos['data'] = this.data.collect
      data_pos['pos'] = e.currentTarget.id
      app.globalData.data_pos = data_pos

      wx.navigateTo({ url: '../../details/details' })

    }


  }


})
