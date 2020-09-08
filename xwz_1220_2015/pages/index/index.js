//index.js
//获取应用实例
const app = getApp()
var request = require("../../utils/request.js")
var util = require("../../utils/util.js")

Page({
  data: {
    publish_info:[],//所有的发布信息
    canIUse: true,//判断用户是否授权
    publish_info_my:0,//发布，消息，我的，分别对应0，1，2
    keyword:'',
    info_unreadnum:"",
    scrollHeight:0,
    title_text:'',
    active:0,
    isblack:false,
  },
  onChange(event) {
    this.setData({ active: event.detail });
  },
  //点击发布/求购执行的函数
  publish_purchase:function(event) {
    if(event.detail=='0')
    {
      this.to_otherpage('../upload/upload')

    }
    else if(event.detail=='1')
    {
      this.to_otherpage('../my_info/my_info')

    }
    else
    {
      this.to_otherpage('../my/my')

    }
  },
  //获取用户信息
  getUserInfo: function (e) {
      if(e.detail.userInfo)
      {
        app.globalData.userInfo = e.detail.userInfo;
        request.save_userinfo();
      }
        this.setData({
          canIUse: false,
          info_unreadnum:1
          
      })  
  },


  //用户详细信息
  detail_info:function(e)
  {
    //设置浏览次数
    var publish_info = this.data.publish_info;
    var cur_id = e.currentTarget.id;
    var pub_id = publish_info[parseInt(cur_id)].id;

    publish_info[cur_id]['page_view']+=1

    var product_info = publish_info[cur_id];

    app.globalData.product_info = product_info
    wx.setStorage({
      key: "product_info",
      data: product_info
    })
    wx.setStorage({
      key: "publish_info",
      data: publish_info
    })

    var data = { product_id: pub_id}
    request.request('https://www.xianwuzu.cn:443/wx_Code/update_pageView', 'GET', data).then(function (res) {
    })


    //是否跳转页面，主要判断用户是否登录过
    this.to_otherpage("../details/details")
  },

 //用户刷新后，获取最新信息
  onPullDownRefresh:function()
  {
    //刷新消息页面

    wx.showLoading({
      title: '玩命加载中',
    })
    this.get_unreadnum()
    this.clear();
    this.refresh('全部')
    var event = {"currentTarget":{"dataset":{"index":0}}}
    if (this.selectComponent("#van-tabs")!=null)
    {
      this.selectComponent("#van-tabs").onTap(event)

    }
    wx.hideLoading(); 

  },

 clear:function()
 {
   this.setData({
     keyword:''
   })
 },
 //获取发布信息
  onLoad: function (options) {
    console.log("lllllllllllllllllllllllllllllllll")
    console.log(options)
    var that = this
    this.setData({isblack:app.globalData.isblack})
    wx.navigateBack({
      delta: -1
    })

    //判断用户是否已授权
    if (app.globalData.userInfo!='') {
      that.setData({
        canIUse: false
      })
    }
    else {
      app.userInfoReadyCallback = res => {
        that.setData({
          canIUse: false
        })
      }
    }



    //设置滚动值
    that.get_titletext()

    wx.getSystemInfo({
      success: function (res) {
        that.setData({ scrollHeight: res.windowHeight })
      },
    })
    this.get_publishinfo1()


  },

  onShow:function()
  {
    this.get_unreadnum()
    this.get_publishinfo()
    this.setData({ keyword:''})
    // this.get_publishinfo()
    
  },



    //获取发布信息
  get_publishinfo:function()
  {

    var that = this
    wx.getStorage({
      key: "publish_info",
      success: function (res) {
        console.log("222222222222222222222")

        console.log('publish_info ')
        var publish_info = res.data
        console.log(publish_info)
        console.log(publish_info.length)
        publish_info = util.span_time(publish_info)
        that.setData({
          publish_info: publish_info
        })
        
      }
    });

  },

  get_publishinfo1: function () {
    //用户登录后，即可获取发布信息
    var that = this
    var data = { 'all_sell_buy': '全部' }
    request.request('https://www.xianwuzu.cn:443/wx_Code/agian', 'POST', data).then(function (res) {
      var publish_info = res['publish']
      wx.setStorage({
        key: "publish_info",
        data: publish_info
      })
      publish_info = util.span_time(publish_info)

      that.setData({publish_info:publish_info})
      app.globalData.id_pos = res['id_pos']
    })
  },

  get_unreadnum: function () {
    var that = this
    if(app.globalData.openid=='')
    {
      wx.getStorage({
        key: "openid",
        success: function (res) {
          that.get_unread(res.data)
        }
      });
    }
    else
    {
      that.get_unread(app.globalData.openid)
    }



  },

  get_unread:function(openid)
  {
    var that = this
    var data = { openid: openid }
    request.request('https://www.xianwuzu.cn:443/wx_Code/get_unreadnum', 'GET', data).then(function (res) {

      var unread_num = res
      if (unread_num == 0)
        unread_num = ''
      that.setData({ info_unreadnum: unread_num })
    }
    )
  },
  to_otherpage:function(url)
  {
    if (app.globalData.userInfo!='') {

      wx.navigateTo({
        url: url
      })
    }
    else {
      this.setData({canIUse:true})

    }
  },
  all_sell_buy:function(e)
  {
    console.log(e)
    this.refresh(e.detail.title)
  },

  refresh:function(sellbuy)
  {
    var data = { 'all_sell_buy': sellbuy }
    var that = this
    request.request('https://www.xianwuzu.cn:443/wx_Code/agian', 'POST', data).then(function (res) {
      var publish_info = util.span_time(res['publish'])
      that.setData({ 'publish_info': publish_info })
      if (data['all_sell_buy'] == '全部') {
        app.globalData.id_pos = res['id_pos']
        wx.setStorage({
          key: "publish_info",
          data: res['publish']
        })
        // 隐藏加载框
      }
    })
  },

  onSearch:function(e)
  {
    var that= this
    var keyword = this.data.keyword.replace(/\s+/g, '');
    console.log("keyword is "+keyword)
    if(!keyword)
    {
      return ''
      util.is_valid(keyword, "搜索不能为空")

    }
    else
    {
      var data = { 'keyword': keyword }
      wx.pageScrollTo({
        scrollTop: 0
      })
      
      request.request('https://www.xianwuzu.cn:443/wx_Code/search', 'GET', data).then(function (res) {
        console.log(res)
        // that.setData({
        //   publish_info: util.span_time(res),
        // })
        var event = { "currentTarget": { "dataset": { "index": 0 } } }
        that.selectComponent("#van-tabs").onTap(event)


        var search_info = util.span_time(res)
        app.globalData.search_info = search_info
        wx.navigateTo({
          url: '../search_show/search_show'
        })

      })
    }

  },

  keyword:function(e)
  {
    this.setData({keyword:e.detail})
  },
get_titletext:function()
{
  var that = this
  wx.getStorage({
    key: "title_text",
    success: function (res) {
      that.setData({
        title_text: res.data
      })
    }
  });
},
  onShareAppMessage: function () {
    return {
      title: '云麓hei市',
      desc: '云麓hei市',
      path: '/pages/index/index' // 路径，传递参数到指定页面。
    }
  }


})
