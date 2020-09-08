// pages/upload/upload.js
const app = getApp()
var request = require("../../utils/request.js")
var util = require("../../utils/util.js")

var form_data;
var psw_vaule = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    publish_info: '',//发布的信息
    text_info: '',//文本
    value: '',
    tempFilePaths: [],
    img_arr: [],
    openid: '123',
    timestamp: '',
    buy_sell: '出售',
    comment2: '',
    color: '#DCDCDC',
    disabled: true,
    //
    price: '',
    price_warning: '',
    title: '',
    pub_count:0

  },
  //获取价格
  get_price: function (e) {
    var price = e.detail.value;
    var price_warning = '请输入合法金额';

    if (price.match(/^\d+(\.\d{1,2})?$/) || (price.length > 1) && (price[price.length - 1] == '.') && (price[price.length - 2] != '.')) {
      price_warning = ''
    }
    else {
      if (price.length != 0)
        price = this.data.price;
    }
    this.setData({
      price: price,
      price_warning: price_warning
    })
  },

  //发布类别备注
  buy_sell: function (e) {
    console.log(e)
    this.setData({
      buy_sell: e.detail.value,
    })
  },

  //物品类别备注
  comment2: function (e) {
    this.setData({
      comment2: e.detail.value,
    })
  },

  disabled_pub: function () {
    var title = this.data.title;
    var color = '#DCDCDC';
    var disabled = true;
    if (title.length != 0) {
      color = "black",
        disabled = false
    }
    this.setData({
      color: color,
      disabled: disabled
    })
  },

  get_describe(event) {
    // event.detail 为当前输入的值
    this.setData({
      text_info: event.detail.value
    });
    this.data.pub_count = 0;

  },

  get_title: function (e) {


    var title = e.detail.value;
    title = e.detail.value.replace(/\s+/g, '');
    this.setData({
      title: title,
    })
    this.disabled_pub();
    this.data.pub_count = 0;

  },

  //上传图片到服务器 
  submit: function () {
    if (this.data.pub_count>0)
    {
      console.log("已经发布了")
      return ''
    }
    this.data.pub_count+=1

    if (!this.data.title) {
      util.is_valid(this.data.title, '标题不能为空！')
    }
    else {
      var that = this
      var img_arr = that.data.img_arr;
      var text_info = that.data.text_info;
      var openid = app.globalData.openid;
      var timestamp = Date.parse(new Date());
      timestamp = parseInt(timestamp / 1000);
      var buy_sell = that.data.buy_sell;
      var price = that.data.price;
      if (price[price.legnth - 1] == '.') {
        price += '00'
      }
      if (price == '')
        price = '-1'

      var title = that.data.title;
      console.log('fffffffffffffffff')
      console.log(price)
      var formData = {
        text_Info: text_info,
        openid: openid,
        timestamp: timestamp,
        buy_sell: buy_sell,
        price: price,
        title: title
      }
      if (img_arr.length != 0)
        that.uploadfile_img(formData, img_arr[0])
      else
        that.uploadfile(formData, '')


    }

  },

  uploadfile_img: function (formData, filePath) {
    var that = this
    wx.uploadFile({
      url: 'https://www.xianwuzu.cn:443/wx_Code/publish',  //填写实际接口   
      header: {
        "Content-Type": "application/json"
      },
      filePath: filePath,
      name: 'file',
      formData: formData,
      success: function (res) {
        if (res) {
          wx.showToast({
            title: '已提交发布！',
            duration: 3000
          });
        }

        console.log('lllllllllllllllllllllllllllll')
        console.log(res.data)
        if(res.data=='1')
        {
          wx.showModal({
            content: "您的发布内容可能包括政治，色情，违反等有害信息,请去除后重新发布",
            showCancel: false,
          })
        }
        else
        {
          that.upload_data(JSON.parse(res.data))
        }


        // that.publish_collectid(app.globalData.openid)
      },

    })
  },


  uploadfile: function (formData, imgUrl) {
    var that = this
    formData['imgUrl'] = imgUrl
    request.request('https://www.xianwuzu.cn:443/wx_Code/uploadFile', 'POST', formData).then(function (res) {
      console.log('jjjjjjjjjjjjjjjj')
      console.log(res)
      if (res['result'] == '1') {
        wx.showModal({
          content: "您的发布内容可能包括政治，色情，违反等有害信息,请去除后重新发布",
          showCancel: false,
        })
      }
      else
      {
        that.upload_data(res)
      }

    })

  },
  to_index: function (publish_info) {
    var pagesArr = getCurrentPages();

    wx.navigateBack({
      delta: 1,   //回退前 delta 页面
    });
  },


  upload_data: function (data) {
    var publish_idpos = data

    var that = this
    // var publish_idpos = JSON.parse(data)
    that.setData({
      publish_info: publish_idpos['publish']
    }),
      app.globalData.id_pos = publish_idpos['id_pos']
    wx.setStorage({
      key: "publish_info",
      data: publish_idpos['publish']
    })
    that.to_index(publish_idpos['publish'])

  },
  //从本地获取照片 
  upimg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,        //一次性上传到小程序的数量     
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const tempFilePaths = res.tempFilePaths
        console.log(res.tempFilePaths)
        
        var size = res.tempFiles[0].size
        console.log("jjjjjjjjjjjjjjjj")
        console.log(size)
        if(size<=3000000)
        {
          that.setData({
            img_arr: res.tempFilePaths,
          })
        }
        else
        {
          wx.showModal({
            content: "上传图片不能大于3M!",
            showCancel: false,
          }) 
        }
  

        this.disabled_pub();
        this.data.pub_count = 0;

      }
    });


  },

  //删除照片功能与预览照片功能 
  deleteImg: function (e) {
    var that = this;
    var img_arr = that.data.img_arr;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          img_arr.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          img_arr: img_arr
        });
        console.log(img_arr)
        that.disabled_pub();

      }
    })

  },
  //预览图片
  previewImg: function (e) {
    console.log(e)
    var img_arr = this.data.img_arr
    wx.previewImage({
      current: img_arr[0],
      urls: img_arr
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "发布",
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
})