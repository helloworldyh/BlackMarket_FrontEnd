// pages/floor_comment/floor_comment.js
const app = getApp();
var request = require("../../utils/request.js")
var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    floor_comment: {},//评论
    chat: '',//评论文本
    openid2: '',//你回复的那个人的openid
    placeholder: "请输入你的回复内容",
    other_info: {},//你私信的那个人的基本信息
    openid2_nickname:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({
      floor_comment: app.globalData.floor_comment1
    })

  },

  personal_info: function () {
    wx.navigateTo({ url: '../my/my' })
  },

  write_chat: function (e) {
    this.data.chat = e.detail.value;

  },
  submit_chat: function (e) {
    var that = this
    var chat = this.data.chat;
    var chat1 = chat.replace(/\s+/g, '')
    if (chat.length == 0) {
      wx.showModal({
        content: '评论不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
    else {
      var timestamp = Date.parse(new Date());
      timestamp = parseInt(timestamp / 1000);
      var product_id = app.globalData.product_id;
      var openid2 = this.data.openid2;
      var openid2_1 = openid2
      if(openid2_1=='')
        openid2_1 = that.data.floor_comment[0][1]
      if (openid2_1 == app.globalData.openid)
        openid2_1 = ''



      var data = {
        timestamp: timestamp,
        text: chat,
        product_id: product_id,
        floor: app.globalData.floor_id,
        openid: app.globalData.openid,
        openid2: openid2,
        openid2_1: openid2_1
      }
      request.request('https://www.xianwuzu.cn:443/wx_Code/submit_chat', 'POST', data).then(function(res){
        if (res == '1') {
          wx.showModal({
            content: "您的发布内容可能包括政治，色情，违反等有害信息,请去除后重新发布",
            showCancel: false,
          })
          that.setData({ chat: "" })
        }
        else {
          that.update_comment(timestamp, chat, openid2)
          that.update_publishinfo(1)
          app.globalData.product_info.comment_ids += 1
            }
      })

    }


  },

  update_comment: function (timestamp, chat,openid2) {
    var openid2_nickname = this.data.openid2_nickname
    var comment = ['3']
    var l1 = 0
    if (app.globalData.product_info.openid == app.globalData.openid)
      l1 = 1
    var l2 = 0
    if (openid2 == app.globalData.openid)
      l2 = 1
    var userInfo = app.globalData.userInfo
    timestamp = util.formatDate(timestamp)
    comment = comment.concat([userInfo.openid, userInfo.avatarUrl, userInfo.nickName, openid2, null, openid2_nickname , chat, l1, l2, timestamp, ''])
    var floor_comment = this.data.floor_comment

    app.globalData.floor_comment[app.globalData.floor_id].push(comment)
    this.setData({ 
      floor_comment: floor_comment,
      chat: ""})

  },

  reply_delete: function (e) {
    var that = this
    var floor_comment = this.data.floor_comment;
    var itemList = ['回复', '私信'];
    if (floor_comment[e.currentTarget.id][1] == app.globalData.openid) {
      itemList = ['删除']
    }

    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        console.log(res);
        if (itemList[res.tapIndex] == "回复") {
          that.setData({
            openid2: floor_comment[e.currentTarget.id][1],
            openid2_nickname:floor_comment[e.currentTarget.id][3],
            placeholder: '回复: ' + floor_comment[e.currentTarget.id][3]
          })

        }
        else if (itemList[res.tapIndex] == '删除') {
          var id = e.currentTarget.id;
          var date = new Date(floor_comment[id][10])
          var timestamp = parseInt(date.getTime() / 1000)
          var data = {
            timestamp:timestamp,
            openid:app.globalData.openid,
            product_id: app.globalData.product_info.id,
            owner:0,
          }

          request.request('https://www.xianwuzu.cn:443/wx_Code/delete_comment', 'GET', data).then
            (function (res) {
            })
          app.globalData.floor_comment[app.globalData.floor_id].splice(id, 1)
          console.log(floor_comment)
          that.setData({
            floor_comment: floor_comment,
          })
          that.update_publishinfo(-1)
          app.globalData.product_info.comment_ids -= 1

        }
        else if (itemList[res.tapIndex] == '私信') {
          var other_info = that.data.other_info;
          other_info['openid'] = floor_comment[e.currentTarget.id][1]
          other_info['avatarUrl'] = floor_comment[e.currentTarget.id][2]
          other_info['nickname'] = floor_comment[e.currentTarget.id][3]
          app.globalData.other_info = other_info

          wx.navigateTo({
            url: '../private_chat/private_chat'
          })
        }

      }
    }
    )

  },

  to_comment_info: function (e) {
    var id = e.currentTarget.id
    var floor_comment = this.data.floor_comment[id]
    var other_info = {}
    other_info['avatarUrl'] = floor_comment[2]
    other_info['nickname'] = floor_comment[3]
    other_info['openid'] = floor_comment[1]
    app.globalData.other_info = other_info
    if (app.globalData.openid == other_info.openid)
      wx.navigateTo({ url: "../my/my" })
    else
      wx.navigateTo({ url: "../other_info/other_info" })
  },

  update_publishinfo: function (n) {
    var that = this
    wx.getStorage({
      key: "publish_info",
      success: function (res) {
        var publish_info = res.data
        var id_pos = app.globalData.id_pos
        var pos = id_pos[app.globalData.product_info.id]
        publish_info[pos].comment_ids += n
        wx.setStorage({
          key: "publish_info",
          data: publish_info
        })
      }
    });

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