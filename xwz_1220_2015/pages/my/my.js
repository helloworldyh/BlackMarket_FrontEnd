// pages/my/my.js
const app = getApp()
var request = require("../../utils/request.js")
var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_img: '',
    nickName: '',
    active: 0,
    mypublish_info: [],
    star_ids:[],
    my_comment:[],
    nums_colpubcom:[],
    rank:3,
  },
  onChange(event) {
    this.setData({ active: event.detail });
  },

  my_info:function()
  {
    // wx.navigateTo({url:'../my_info/my_info'})
  },


  /**
   * 生命周期函数--监听页面加载
   */

  my_information: function () {
    console.log("jjjjjjjjjjjjjjjjj")
    wx.navigateTo({ url: './myrank/myrank' })
  },
  //我的收藏函数
  my_collect:function(){
    wx.navigateTo({ url:'./mycollect/mycollect'})
  },
  //我的发布函数
  my_publish: function () {
    wx.navigateTo({url: './mypublish/mypublish'})
  },
  //我的求购函数
  my_history: function () {
    wx.navigateTo({ url: '../test/tset' })
  },
  //我的评论函数
  my_comment:function(){
    wx.navigateTo({ url: './mycomment/mycomment' })
  },
  //寻求帮助函数
  get_help:function(){

    var other_info = {}
    other_info['openid'] =app.globalData.kf_openid
    other_info['avatarUrl'] = app.globalData.kf_img
    other_info['nickname'] = app.globalData.kf_nick
    app.globalData.other_info = other_info
    wx.navigateTo({ url: '../private_chat/private_chat'})
  },

  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    this.setData({
      my_img: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    })
    wx.setNavigationBarTitle({
      title: "个人信息",
    })

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
    var data = {
      openid: app.globalData.openid
    }
    var that = this
    request.request('https://www.xianwuzu.cn:443/wx_Code/num_publishcommentcollect', 'GET', data).then(function (res) {
      console.log("bbbbbbbbbbbbbbbbbbb")
      console.log(res)
      that.setData({ 
        nums_colpubcom: res
      })
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