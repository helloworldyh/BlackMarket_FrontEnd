// pages/Details/Details.js
const app = getApp();
var request = require("../../utils/request.js")

var util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    star: 0,//为1时收藏
    comment_collect: 0,//页面底下评论与收藏
    icon: ["star-o", "star"],//页面低下收藏显示的图片
    product_info: {},//用户发布的信息
    hidden_chat: true,//评论按钮是否隐藏
    chat: '',//评论文本
    floor_comment: {},//所有的评论
    f_ind_floor: {},
    id: 'ID0',
    actionSheetHidden: true,
    isme: false,
    state: 0, //产品状态为0(未完成)，1(已过期),2(已完成)
    showModal: false,
    reason: '',
    color: "#DCDCDC",
    disabled: true,
    comment_ready:false,
    canIUse:false
  },

  // 外面的弹窗
  complaint: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
    })
    this.setData({
      showModal: true
    })


  },

  // 禁止屏幕滚动
  preventTouchMove: function () {
  },

  // 弹出层里面的弹窗
  cancel: function () {
    this.setData({
      showModal: false
    })
  },
  write_reason: function (e) {
    var reason = e.detail.value.replace(/\s+/g, '');
    this.disabled_pub(reason)
    this.setData({ reason: reason })
  },
  assert: function () {
    var data = {
      openid: app.globalData.openid,
      timestamp: parseInt(Date.parse(new Date()) / 1000),
      product_id: this.data.product_info.id,
      reason: this.data.reason
    }
    request.request('https://www.xianwuzu.cn:443/wx_Code/report', 'GET', data).then(function (res) {
      wx.showToast({
        title: '举报已提交',
        duration: 3000
      });
    })

    this.setData({
      showModal: false
    })
  },
  disabled_pub: function (reason) {
    var color = '#DCDCDC';
    var disabled = true;
    if (reason.length != 0) {
      color = 'black',
        disabled = false
    }
    this.setData({
      color: color,
      disabled: disabled
    })
  },
  //预览图片
  previewImg: function (e) {
    console.log(e)
    var imgUrl = this.data.product_info.imgUrl
    wx.previewImage({
      current: imgUrl,
      urls: [imgUrl]
    })
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
    console.log(options)

    var that = this
    var product_info = {}
    if (app.globalData.userInfo=='')
    {
      this.setData({ canIUse:true})
    }
    if("product_info" in options)
    {
      product_info = JSON.parse(options["product_info"])
      app.globalData.product_info = product_info
      console.log(product_info)

    }
    else
    {
      product_info = app.globalData.product_info
    }

    product_info['pub_time'] = util.formatDate(product_info.timestamp);
    that.setData({
      state: product_info.state
    })
    that.isstar(product_info.id)

    // wx.getStorage({
    //   key: "product_info",
    //   success: function (res) {
    //     var product_info = res.data;
    //     product_info['pub_time'] = util.formatDate(product_info.timestamp);
    //     console.log('product_info')
    //     console.log(product_info)
    //     that.setData({
    //       product_info: product_info,
    //       state:product_info.state
    //     })
    //     that.isstar(product_info.id)
    //   }
    // });
    this.get_comment()

  },
  chat_star: function (e) {

    var that = this
    if (e.detail == 0) {
      var hidden_chat = true;
      if (e.detail == 0)
        hidden_chat = false;
      this.setData({
        hidden_chat: hidden_chat,
      })
    }
    else if (e.detail == 1) {
      var other_info = {};
      var product_info = this.data.product_info
      if (product_info.openid != app.globalData.openid) {
        other_info['openid'] = product_info.openid
        other_info['avatarUrl'] = product_info.image
        other_info['nickname'] = product_info.nickname
        app.globalData.other_info = other_info
        wx.navigateTo({
          url: '../private_chat/private_chat'
        })

      }
      else {

        wx.showModal({
          content: "不能私信自己哦",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }
    else if (e.detail == 2) {
      var star_ids = app.globalData.star_ids;
      var star_id = this.data.product_info.id;
      var star = 1;
      var cur_id = app.globalData.id_pos[star_id]
      console.log('details chat_star star_ids')
      console.log(star_ids)
      var p = star_ids.indexOf(star_id)
      if ( p> -1) {
        star_ids.splice(p,1)
        star = 0
        if(this.data.product_info.state==0)
          this.update_star(-1, cur_id)
      }
      else {
        star_ids = star_ids.concat(star_id)
        if (this.data.product_info.state == 0)
          this.update_star(1, cur_id)

      }
      this.setData({
        star: star
      })
      app.globalData.star_ids = star_ids;
      var data = {
        star_id: star_id,
        star: star,
        openid: app.globalData.openid
      };

      request.request('https://www.xianwuzu.cn:443/wx_Code/collect', 'GET', data)
    }


  },

  update_star: function (star, cur_id) {
    wx.getStorage({
      key: "publish_info",
      success: function (res) {
        var publish_info = res.data
        if(publish_info.indexOf(cur_id)>-1)
        {
          publish_info[cur_id].star_ids += star
          wx.setStorage({
            key: "publish_info",
            data: publish_info
          })
        }

      }
    });


  },
  //写评论
  write_chat: function (e) {
    var chat = e.detail.value;
    this.data.chat = chat;

  },
  submit_chat: function (e) {
    var that = this
    var chat = this.data.chat;
    var chat1 = chat.replace(/\s+/g, '')
    if (chat1.length == 0) {
      return 

      // wx.showModal({
      //   content: '评论不能为空',
      //   showCancel: false,
      //   success: function (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     }
      //   },
      // })
    }
    else {
      var timestamp = Date.parse(new Date());
      timestamp = parseInt(timestamp / 1000);
      var product_id = this.data.product_info.id;
      var floor = app.globalData.floor;
      var openid2_1 = that.data.product_info.openid
      if(openid2_1==app.globalData.openid)
      openid2_1 = ''
      console.log(openid2_1)

      app.globalData.floor += 1
      console.log("details submit_chat floor")
      console.log(app.globalData.floor)

      var data = {
        timestamp: timestamp,
        text: chat,
        product_id: product_id,
        floor: -1,
        openid: app.globalData.openid,
        openid2: '',
        openid2_1: openid2_1
      }
      request.request('https://www.xianwuzu.cn:443/wx_Code/submit_chat', 'POST', data).then(function (res) {
        if(res=='1')
        {
          wx.showModal({
            content: "您的发布内容可能包括政治，色情，违反等有害信息,请去除后重新发布",
            showCancel: false,
          })
          that.setData({ chat: "" })

        }
        else
        {
          that.update_publishinfo(1)
          that.update_comment(timestamp, chat)
        }

        // var floor_comment = that.timestamp_date(res);
        // that.setData({ floor_comment: floor_comment, chat: '' })

      })

    }

    
    this.setData({
      hidden_chat: true,
    })

  },

  update_comment: function (timestamp, chat)
{
  var comment = ['3']
  var l1 = 0
  if (this.data.product_info.openid==app.globalData.openid)
    l1 = 1
  var userInfo = app.globalData.userInfo
  timestamp = util.formatDate(timestamp)
    comment = comment.concat([userInfo.openid, userInfo.avatarUrl, userInfo.nickName, "", null, null, chat, l1, "0", timestamp,''])
  var floor_comment = this.data.floor_comment

    var keys = Object.keys(floor_comment)
    keys = keys.map(function (data) { return +data })
    var k = Math.max.apply(0, keys) + 1
    var f_ind_floor = this.data.f_ind_floor
    var product_info = this.data.product_info

    if (k == -Infinity)
    {
      k = 1
      f_ind_floor[k] = 1
    }
    else
    f_ind_floor[k] = f_ind_floor[k-1]+1
    floor_comment[k] = [comment]
    product_info.comment_ids+=1
    app.globalData.product_info = product_info



  this.setData({
    floor_comment:floor_comment,
    f_ind_floor: f_ind_floor,
    chat: '',
    product_info: product_info })

},
  update_publishinfo:function(n)
  {
    var that = this
    wx.getStorage({
      key: "publish_info",
      success: function (res) {
        var publish_info = res.data
        var id_pos = app.globalData.id_pos
        var pos = id_pos[that.data.product_info.id]
        if (publish_info.indexOf(pos)>-1)
        {
          publish_info[pos].comment_ids += n
          wx.setStorage({
            key: "publish_info",
            data: publish_info
          })     
        }

      }
    });

  },
  floor: function (e) {
    if (this.endTime - this.startTime < 350) {
      console.log("点击")
      console.log(e);
      app.globalData.floor_id = e.currentTarget.id
      app.globalData.floor_comment1 = this.data.floor_comment[e.currentTarget.id]
      wx.navigateTo({ url: '../floor_comment/floor_comment' });
    }

  },
  to_page: function () {
      var product_info = this.data.product_info;
      var other_info = {}
      other_info['avatarUrl'] = product_info['image']
      other_info['nickname'] = product_info['nickname']
      other_info['openid'] = product_info['openid']

      app.globalData.other_info = other_info

      if (app.globalData.openid == other_info.openid)
        wx.navigateTo({ url: "../my/my" })
      else
        wx.navigateTo({ url: "../other_info/other_info" })


  },

  to_comment_info: function (e) {
    if (this.endTime - this.startTime < 350) {
      var id = e.currentTarget.id
      var floor_comment = this.data.floor_comment[id][0]
      var other_info = {}
      other_info['avatarUrl'] = floor_comment[2]
      other_info['nickname'] = floor_comment[3]
      other_info['openid'] = floor_comment[1]
      app.globalData.other_info = other_info
      if (app.globalData.openid == other_info.openid)
        wx.navigateTo({ url: "../my/my" })
      else
        wx.navigateTo({ url: "../other_info/other_info" })


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
    var floor_comment = app.globalData.floor_comment
    if ((floor_comment != "")&&this.data.comment_ready)
    this.setData({floor_comment:floor_comment})
    this.setData({ product_info: app.globalData.product_info})
  },

  get_comment: function () {
    var that = this
    var product_info = app.globalData.product_info
    var product_id = product_info.id;
    that.get_isme(product_info.openid)
    var data = {
      product_id: product_id
    }
    request.request("https://www.xianwuzu.cn:443/wx_Code/getComment", 'GET', data).then(function (res) {
      console.log('details onShow floor_comment')
      console.log(res)

      var floor_comment = that.timestamp_date(res);
      that.setData({ floor_comment: floor_comment, comment_ready:true})
      app.globalData.floor_comment = floor_comment
      app.globalData.floor = Object.keys(floor_comment).length + 1



    })

  },
  get_isme: function (openid) {
    if (openid == app.globalData.openid)
      this.setData({ isme: true })
  },


  timestamp_date: function (floor_comment) {
    var f_ind_floor = {};
    var ind = 1;
    for (var floor in floor_comment) {
      f_ind_floor[floor] = ind;
      ind += 1
      for (var i = 0; i < floor_comment[floor].length; i++) {
        floor_comment[floor][i][10] = util.formatDate(floor_comment[floor][i][10])
      }
    }
    this.setData({
      f_ind_floor: f_ind_floor,
    })
    return floor_comment
  },

  isstar: function (star_id) {

    app.globalData.product_id = star_id;
    var star_ids = app.globalData.star_ids;

    var star = 0
    if (star_ids.indexOf(star_id) > -1) {
      star = 1
    }
    this.setData({
      star: star
    })
    console.log(star)


  },
  chat_gun: function (event) {
    console.log('%%%%%%%%%')
    this.setData({
      id: 'ID1'
    })

  },
  //点击时间，判断长按
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  delete_comment: function (e) {
    var that = this
    var id = e.currentTarget.id;
    var date = new Date(that.data.floor_comment[id][0][10])
    var timestamp = parseInt(date.getTime()/1000)

    if (this.data.floor_comment[id][0][1] == app.globalData.openid) {
      var itemList = ['删除']
      wx.showActionSheet({
        itemList: itemList,
        success: function (res) {
          console.log(that.data.product_info)
          var data = {
            product_id: that.data.product_info.id,
            // id: comment_id,
            openid:app.globalData.openid,
            timestamp:timestamp,
            owner: 1,
          }
          request.request('https://www.xianwuzu.cn/wx_Code/delete_comment', 'GET', data).then(function (res) {
            // var floor_comment = that.timestamp_date(res);

          })
          var floor_comment = that.data.floor_comment
          that.update_publishinfo(-floor_comment[id].length)

          var product_info = that.data.product_info
          product_info.comment_ids -= floor_comment[id].length
          app.globalData.product_info = product_info
          delete floor_comment[id]
          that.setData({
            floor_comment: floor_comment,
            product_info: product_info
          })

        }
      })
    }
    else {
      this.floor(e)
    }
  },

  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
    })
  }, 
  delete_product: function () {
    var that = this
    this.listenerActionSheet()
    wx.showModal({
      content: "确定删除吗",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          var product_id = that.data.product_info.id
          var star_ids = app.globalData.star_ids
          var data = { product_id: product_id }
          var pos = app.globalData.id_pos[product_id]
          console.log(that.data.product_info)
          request.request('https://www.xianwuzu.cn:443/wx_Code/delete_product', 'GET', data).then(function (res) {
            wx.getStorage({
              key: "publish_info",
              success: function (res) {
                var publish_info = res.data

                delete publish_info[pos]
                wx.setStorage({
                  key: "publish_info",
                  data: publish_info
                })
              }
            });


            var p = star_ids.indexOf(product_id)
            if (p > -1)
              star_ids.splice(p,1)
            app.globalData.star_ids = star_ids
            app.globalData.is_star = -1
            wx.showToast({
              title: '成功删除',
              duration: 3000
            });
            that.to_index()

          })
        }
      }
    })
  },

  change_state: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
    })
    var that = this
    wx.showModal({
      content: "已完成交易",
      showCancel: true,
      success: function (res) {
        var data = { product_id: that.data.product_info.id, state: 2 }
        if (res.confirm) {
          request.request('https://www.xianwuzu.cn:443/wx_Code/update_productState', 'GET', data).then(function (res) {
            var pos = app.globalData.id_pos[that.data.product_info.id]
            wx.getStorage({
              key: "publish_info",
              success: function (res) {
                var publish_info = res.data
                delete publish_info[pos]
                wx.setStorage({
                  key: "publish_info",
                  data: publish_info
                })
              }
            });

            if (app.globalData.star_ids.indexOf(that.data.product_info.id))
            var p = app.globalData.star_ids.indexOf(that.data.product_info.id)
            if(p>-1)
              app.globalData.star_ids.splice(p, 1)


            that.to_index()
            

          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.setData({
    //   actionSheetHidden: !this.data.actionSheetHidden,
    // })
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
    this.get_comment()
    this.setData({
      hidden_chat: true,
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */

  to_index: function () {
    var pagesArr = getCurrentPages();
    var that = this
    if (pagesArr[pagesArr.length - 2].route == 'pages/index/index') {
      var data = { 'all_sell_buy': '全部' }
      request.request('https://www.xianwuzu.cn:443/wx_Code/agian', 'POST', data).then(function (res) {
        var publish_info = res['publish']
        wx.setStorage({
          key: "publish_info",
          data: publish_info
        })
        publish_info = util.span_time(publish_info)
        app.globalData.id_pos = res['id_pos']
        that.navigateBack(pagesArr)
      }
      )
    }
    else {
      this.navigateBack(pagesArr)
    }
  },

  navigateBack: function (pagesArr) {
    wx.navigateBack({
      delta: 1,   //回退前 delta 页面
    });

  },

  update_data: function () {
    var data_pos = app.globalData.data_pos
    var data = data_pos['data']
    var pos = data_pos['pos']
    data.splice(pos, 1)
    return data

  },
  republish:function()
  {

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
    })
    var that = this
    wx.showModal({
      content: "确定重新发布?",
      showCancel: true,
      success: function (res) {
        var data = { product_id: that.data.product_info.id, state: 0 }
        if (res.confirm) {
          request.request('https://www.xianwuzu.cn:443/wx_Code/update_productState', 'GET', data).then(function (res) {
            wx.showToast({
              title: '已重新发布',
              duration: 3000
            });
            wx.navigateBack({
              delta: 1,   //回退前 delta 页面
            });

          })
        }
      }
    })

  },
  onShareAppMessage: function () {
    return {
      title: '云麓hei市',
      desc: '云麓hei市',
      path: "/pages/details/details?product_info="+JSON.stringify(this.data.product_info) // 路径，传递参数到指定页面。
    }
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      request.save_userinfo();
      this.setData({canIUse:false})
    }
    else
    {
      wx.showToast({
        title: '请授权',
        duration: 3000
      });     
    }
  },


})