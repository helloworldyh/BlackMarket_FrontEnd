// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color:'red',
    disabled:true,
    floor_n: [[['openid1', 'openid2', 'hello world', 'id']], [['openid1', 'openid2', 'hello world', 'id']]],
    openids_userinfo:{'openid1':'yh','openid2':'zxl'},
    publish_info:{'2':{'name':'22'},'4':{'name':'44'},'3':{'name':'33'}}
  },
  userNameInput:function(e)
  {
    console.log(('1'!='')&&([1].length!=0))

    var color = '';
    var disabled = true;
    if(e.detail.value=='')
    {
      color = 'red';
      disabled = true;
    }
    else
    {
      color = 'green';
      disabled = false;
    }
    this.setData({
      color:color,
      disabled : disabled
    })
      
  },

  detail_info:function(e)
  {
      console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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