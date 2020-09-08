// pages/my_info/my_info.js
const app = getApp();
var request = require("../../utils/request.js")
var util = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myinfos: [],
    active: 0,
    notices:{},
    ready:false
  },
  onChange(event) {
    this.setData({ active: event.detail });
  },

  /*跳转到私信页面 */
  gotoprivatechat: function (event) {
    if (this.endTime - this.startTime < 350) {
      var id = event.currentTarget.id
      var myinfos = this.data.myinfos;
      var other_info = {}
      other_info['openid'] = myinfos[id]['openid']
      other_info['avatarUrl'] = myinfos[id]['image']
      other_info['nickname'] = myinfos[id]['nickname']
      app.globalData.other_info = other_info
      wx.navigateTo({
        url: '../private_chat/private_chat'
      })
      myinfos[id].unread = 0
      this.setData({ myinfos: myinfos })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '消息',
    })

  },
  timestamp_date: function (myinfos) {
      var openid = app.globalData.openid
      var myinfos1 = []
      for (var i = myinfos.length-1; i >=0; i--) {
        myinfos[i].timestamp = util.formatDate(myinfos[i].timestamp);
        if((myinfos[i].unread>0)&&(myinfos[i].sender_id==openid))
        myinfos[i].unread = 0;
        myinfos1.push(myinfos[i])
      }
    return myinfos1
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
    this.show_news()
    this.notice()
  },

  show_news:function(){
    var data = { openid: app.globalData.openid }
    var that = this
    request.request('https://www.xianwuzu.cn:443/chat/getNews', 'GET', data).then(function (res) {
      console.log(res)
      var myinfos = that.timestamp_date(res)
      console.log('jjjjjjjjjjjjjjjjjjjjj')
      console.log(myinfos)
      that.setData({ myinfos: myinfos,ready: true})
    }
    )
  },

  //点击时间，判断长按
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  delete_news: function (e) {
    var that = this

      var itemList = ['删除']
      wx.showActionSheet({
        itemList: itemList,
        success: function (res) {
          var other_info = that.data.myinfos[e.currentTarget.id]
          var sender_id = app.globalData.openid
          var receiver_id = other_info.openid
          var data = { sender_id: sender_id, receiver_id: receiver_id }
 
            request.request('https://www.xianwuzu.cn:443/chat/update_id1', 'GET', data).then(function (res) {
              that.show_news()
            })

        }
      })

  },

  notice:function()
  {
    var that = this
    var data = {openid:app.globalData.openid}
    request.request('https://www.xianwuzu.cn:443/wx_Code/user_notice', 'GET', data).then(function (res) {

      var notices = res
      notices['system'] = that.timestamp_date_notice(notices['system'])
      notices['user'] = that.timestamp_date_notice(notices['user'])

      that.setData({ notices: notices})
      app.globalData.notices = res

      console.log(res)
      })
  },
  system_notice:function()
  {
    var data = { openid: app.globalData.openid }
    request.request('https://www.xianwuzu.cn:443/wx_Code/isnew', 'GET', data).then(function (res) {
      wx.navigateTo({url:'./system_notice/system_notice'})
    })
  },

  reply_notice:function()
  {
    var data = { openid: app.globalData.openid }
    request.request('https://www.xianwuzu.cn:443/wx_Code/isnew2', 'GET', data).then(function (res) {
      wx.navigateTo({ url: './reply_notice/reply_notice' })
    })
  },


  timestamp_date_notice: function (myinfos) {
    var openid = app.globalData.openid
    var myinfos1 = []
    for (var i = myinfos.length - 1; i >= 0; i--) {
      myinfos[i].time = util.formatDate(myinfos[i].timestamp);
      myinfos1.push(myinfos[i])
    }
    return myinfos1
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
    this.show_news()


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