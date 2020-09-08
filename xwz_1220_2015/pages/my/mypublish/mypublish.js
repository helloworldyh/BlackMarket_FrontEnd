// pages/my/mycomment/mycomment.js
const app = getApp()
var util = require("../../../utils/util.js")
var request = require("../../../utils/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mypublish_info: [],
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
      title: "我的发布",
    })
  },
  //显示详情
  detail_info: function (e) {
    if (this.endTime - this.startTime < 350)
    {
      var mypublish_info = this.data.mypublish_info
      var product_info = mypublish_info[e.currentTarget.id];
      app.globalData.product_info = product_info
      var data_pos = {}
      data_pos['data'] = mypublish_info
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
    var data = { openid: app.globalData.openid }
    var that = this
    request.request('https://www.xianwuzu.cn:443/wx_Code/mypublish', 'GET', data).then(function (res) {
      console.log(res)
      var mypublish_info = res
      for (var i = 0; i < mypublish_info.length; i++) {
        mypublish_info[i].time = util.formatDate(mypublish_info[i].timestamp)
        if (mypublish_info[i].price == -1)
          mypublish_info[i].price = '可商议'
      }
      that.setData({ mypublish_info: mypublish_info, ready:true})
      wx.setStorage({
        key: "mypublish_info",
        data: mypublish_info
      })
    })

  },


  all_sell_buy:function(e)
  {
    if(e.detail.index==0)
    {
      this.get_buy_sell("全部","mypublish_info")
    }
    else if(e.detail.index==1)
    {
      this.get_buy_sell("出售", "mypublish_info")
    }
    else
    {
      this.get_buy_sell("求购", "mypublish_info")
    }
  },

  get_buy_sell:function(buy_sell,key)
  {
    var that = this
    if(buy_sell=='全部')
    {
      wx.getStorage({
        key: key,
        success: function (res) {
          that.setData({
            mypublish_info: res.data
          })
        }
      });
    }
    else{
      wx.getStorage({
        key: key,
        success: function (res) {
          var data = []
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].buy_sell == buy_sell)
              data.push(res.data[i])
          }
          that.setData({
            mypublish_info: data
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

  del_sta:function(e)
  {
    var that = this

    var id = e.currentTarget.id
    var itemList = ['删除', "重新发布"]
    if(that.data.mypublish_info[id].state==0)
    var itemList = ['删除', "已完成"]


    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if(res.tapIndex==0)
        {
          that.delete_product(id)
        }
        else
        {
          var content = "重新发布?"
          var title = '已重新发布'
          var state = 0

          if(itemList[res.tapIndex]=='已完成')
          {
            content = "已完成交易?"
            title = "已完成"
            state = 2
          }
          that.republish(id, content, title, state)


        }
      }})


  },

  delete_product: function (id) {
    var that = this
    wx.showModal({
      content: "确定删除吗",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          var mypublish_info = that.data.mypublish_info
          var product_id = mypublish_info[id].id

          var star_ids = app.globalData.star_ids
          var data = { product_id: product_id }

          app.get_publishinfo()
          var p = star_ids.indexOf(product_id)
          if ( p> -1)
            star_ids.splice(p,1)
          app.globalData.star_ids = star_ids
          app.globalData.is_star = -1
          wx.showToast({
            title: '成功删除',
            duration: 1000
          });
          mypublish_info.splice(id, 1)
          that.setData({ mypublish_info: mypublish_info })

          request.request('https://www.xianwuzu.cn:443/wx_Code/delete_product', 'GET', data).then(function (res) {
          })
          wx.getStorage({
            key: "publish_info",
            success: function (res) {
              var publish_info = res.data
              delete publish_info[app.globalData.id_pos[product_id]]
              wx.setStorage({
                key: "publish_info",
                data: publish_info
              })
            }
          });




        }
      }
    })
  },

  republish: function (id,content,title,state) {

    var that = this
    wx.showModal({
      content: content,
      showCancel: true,
      success: function (res) {
        var mypublish_info = that.data.mypublish_info
        var product_id = mypublish_info[id].id

        var data = { product_id: product_id, state: state }
        if (res.confirm) {          
          request.request('https://www.xianwuzu.cn:443/wx_Code/update_productState', 'GET', data).then(function (res) {
            wx.showToast({
              title: title,
              duration: 3000
            });
            mypublish_info[id].state = state
            that.setData({ mypublish_info: mypublish_info})

          })


        }
      }
    })

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