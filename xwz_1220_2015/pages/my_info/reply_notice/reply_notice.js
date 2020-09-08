// pages/my_info/reply_notice/reply_notice.js
const app = getApp();
var util = require("../../../utils/util.js")
var request = require("../../../utils/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notices: {},
    ready:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ notices: app.globalData.notices, ready:true})

    wx.setNavigationBarTitle({
      title: '回复',

    })
  },
  detail_info:function(e)
  {
    if (this.endTime - this.startTime < 350)
    {
          var that = this
          wx.getStorage({
            key: "publish_info",
            success: function (res) {
              var publish_info = res.data
              var product_info = publish_info[app.globalData.id_pos[that.data.notices['user'][e.currentTarget.id].product_id]]
              if(product_info!=undefined)
              {
                if(product_info.price==-1)
                product_info.price = '可商议'
                app.globalData.product_info = product_info

                wx.navigateTo({ url: "../../details/details" })
              }
              else
              {
                wx.showModal({
                  content: "该发布信息状态已改变，暂时不能查看！",
                  showCancel: false,
                })

              }
            }
          });
    }



  },
  delete_notice:function(e)
  {
    var itemList = ['删除']
    var that = this

    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (res.tapIndex == 0) {
          var notices = app.globalData.notices
          var id = e.currentTarget.id
          var data = { openid2_1: app.globalData.openid, openid: notices['user'][id].openid,timestamp:notices['user'][id].timestamp}
          console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
          console.log(id)
          console.log(notices)
          request.request('https://www.xianwuzu.cn:443/wx_Code/update_delete', 'GET', data).then(function (res) {
            notices['user'].splice(id,1)
            that.setData({notices:notices})
            app.globalData.notices = notices
          })
        }
      }
    })

  },

  //点击时间，判断长按
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
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