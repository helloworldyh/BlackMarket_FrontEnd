const app = getApp();
var request = require("../../utils/request.js");
var util = require("../../utils/util.js")

Page({

  data: {
    messages: [],//存储所有的交流数据
    scrollTop: 0,
    lastId: "msg1",
    message: '',
    scrollHeight: 0,
    lastID: '',
    other_info: { 'openid': 'osIqX5L0GcVzGmV8_HqQI6UbB9bo', 'nickname': '阿八' },//进来即获取的信息
    websocketUrl: 'wss://www.xianwuzu.cn:443/chat/',
    baseUrl: 'https://www.xianwuzu.cn:443/chat/',
    sender_ids: [],
    my_info: {},
    isme: false,
  },

  onLoad: function () {
    this.setData({ my_info: app.globalData.userInfo });
    var other_info = app.globalData.other_info
    this.clear_unread(app.globalData.openid, other_info.openid)
    this.setData({
      other_info: other_info
    })
    this.onload(other_info)

  },

  onload: function (other_info) {
    var that = this
    var openid = app.globalData.openid
    var url = that.data.websocketUrl + openid + "/" + other_info.openid;

    console.log('private_chat onload url')
    console.log(url)
    // that.setData({ websocketUrl: url });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ scrollHeight: res.windowHeight - 40 })
      },
    })


    wx.setNavigationBarTitle({
      title: other_info.nickname,
    })


    /**
     * 从数据库中找到前10条
     */
    var url_mysql = that.data.baseUrl + "getTop10Message?sender=" + openid + "&receiver=" + other_info.openid;

    request.request(url_mysql, 'POST').then(function (res) {
      console.log('private_chat onload messages')
      console.log(res);
      var messages = that.data.messages;
      for (var i = 0; i < res.length; i++) {
        var message_time_isme = {}
        message_time_isme['message'] = res[i].message
        message_time_isme['time'] = util.formatDate(res[i].timestamp)
        if((i==0)||(res[i].timestamp-res[i-1].timestamp)>60)
          message_time_isme['view'] = true
        else
          message_time_isme['view'] = false
        if(res[i].sender_id==openid)
          message_time_isme['isme'] = true
        else
          message_time_isme['isme'] = false
        messages.push(message_time_isme);
      }
      var scrollTop = (messages.length) * 100;
      var windowHeight = that.data.scrollHeight;
      if (scrollTop < windowHeight) {
        scrollTop = 0;
      }
      console.log('fffffffffffffffffffffffffff')
      console.log(messages)
      that.setData({ messages: messages, lastId: "msg" + messages.length - 1, scrollTop: scrollTop });
    })

    wx.connectSocket({
      url: url,
      success: function () {
        console.log('信道连接成功~')
      },
      fail: function () {
        console.log('信道连接失败~')
      }

    });

    wx.onSocketOpen(function (res) {

      console.log('信道已开通~')

      //接受服务器消息
      wx.onSocketMessage(function (res) {
        console.log('private_chat onload msg')
        console.log(res.data)
        if (res != '') {
          var messages = that.data.messages;
          var message_time_isme = {}
          var timestamp = parseInt(Date.parse(new Date()) / 1000)
          message_time_isme['message'] = res.data
          message_time_isme['time'] = util.formatDate(timestamp)
          message_time_isme['isme'] = false

          if ((messages.length == 0) || (timestamp - messages[messages.length - 1].timestamp > 60))
            message_time_isme['view'] = true
          else
            message_time_isme['view'] = false


          messages.push(message_time_isme)
          var height = messages.length * 100;
          var windowHeight = that.data.scrollHeight;
          if (height < windowHeight) {
            height = 0;
          }
          that.setData({ messages: messages, lastId: "msg" + messages.length - 1, scrollTop: height })
        }
      });//func回调可以拿到服务器返回的数据


    });


    wx.onSocketError(function (res) {
      console.log('信道连接失败，请检查！')

      wx.showToast({
        title: '信道连接失败，请检查！',
        icon: "none",
        duration: 2000
      })
    })

  },

  clear_unread: function (sender_id, receiver_id)
  {
    var data = { sender_id: sender_id, receiver_id: receiver_id}
    request.request('https://www.xianwuzu.cn:443/chat/clear_unread', 'GET', data).then(function (res) {

      // wx.getStorage({
      //   key: "userInfo",
      //   success: function (res_user) {
      //     var userInfo = res_user.data
      //     userInfo.unread_num -= res
      //     if(userInfo.unread_num<0)
      //       userInfo.unread_num = 0
      //     wx.setStorage({
      //       key: "userInfo",
      //       data: userInfo
      //     })  
      //   }
      // });

  
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



  },



  /**

   * 生命周期函数--监听页面隐藏

   */

  onHide: function () {
    wx.closeSocket({})
    if(app.globalData.isblack)
    {
      wx.reLaunch({
        url: '../index/index',
      })  

    }
      },
  /**

   * 生命周期函数--监听页面卸载

   */
  onUnload: function() {
    wx.closeSocket({})

    if (app.globalData.isblack) {
      wx.reLaunch({
        url: '../index/index',
      })  

    }
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

  /**

   * 修改scroll值

   */


  changeScrollvalue: function () {
    var length = 50;
    // var length = this.messages.length;
    var scrollTop = this.data.messages.length * 80;
    if(scrollTop>640)
    this.setData({ scrollTop: scrollTop })
  },

  /**

   * 记录msg

   */

  onInput: function (e) {
    // const value = e.detail.value;
    console.log(e)
    this.setData({ message: e.detail.value });
  },

  /**

   * 点击键盘上的完成键发送文字

   */
  sendMsg: function (e) {
    var that = this;
    var messages = this.data.messages;
    var message = this.data.message;
    console.log("beforebeforebeforebeforebeforebefore")
    console.log(message)
    if (message.replace(/\s+/g, '').length ==0) {
      return false;
    }
    
    var message_time_isme = {}
    var timestamp = parseInt(Date.parse(new Date()) / 1000)
    message_time_isme['message'] = message
    message_time_isme['time'] = util.formatDate(timestamp)
    message_time_isme['isme'] = true

    if ((messages.length == 0) || (timestamp - messages[messages.length-1].timestamp > 60))
      message_time_isme['view'] = true
    else
      message_time_isme['view'] = false

    messages.push(message_time_isme);
    var height = messages.length * 100;
    var windowHeight = that.data.scrollHeight;
    if (windowHeight > height) {
      height = 0;
    }
    this.setData({ messages: messages, message: '', lastId: "msg" + messages.length - 1, scrollTop: height });
    // this.data.messages = messages
    console.log("afterafterafterafterafterafter")
    console.log(this.data.message)

    wx.sendSocketMessage({
      data: message,
    })
    this.data.message= ''


  },




  recordVoice: function () {


  },

  uploadimage: function () {

  }

})
