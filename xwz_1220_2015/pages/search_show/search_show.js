// pages/search_show/search_show.js
const app = getApp();
var request = require("../../utils/request.js")
var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_info:[],
    ready:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ search_info: app.globalData.search_info, ready:true})
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

  },
  //用户详细信息
  detail_info: function (e) {
    //设置浏览次数
    var search_info = this.data.search_info;
    var cur_id = e.currentTarget.id;
    var pub_id = search_info[parseInt(cur_id)].id;

    search_info[cur_id]['page_view'] += 1

    wx.getStorage({
      key: "publish_info",
      success: function (res) { 
      var publish_info = res.data
      var id_pos = app.globalData.id_pos
      var pos = id_pos[pub_id]
      publish_info[pos]['page_view'] += 1

        wx.setStorage({
          key: "publish_info",
          data: publish_info
        })

      }})

    var product_info = search_info[cur_id];

    app.globalData.product_info = product_info
    wx.setStorage({
      key: "product_info",
      data: product_info
    })

    this.setData({ search_info: search_info})



    var data = { product_id: pub_id }
    request.request('https://www.xianwuzu.cn:443/wx_Code/update_pageView', 'GET', data).then(function (res) {
    })
    wx.navigateTo({url: "../details/details"})


  },
})