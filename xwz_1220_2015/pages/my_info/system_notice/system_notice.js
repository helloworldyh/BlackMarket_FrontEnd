// pages/my_info/system_notice/system_notice'.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notices: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ notices: app.globalData.notices })
    console.log(app.globalData.notices)

    wx.setNavigationBarTitle({
      title: '系统通知',
      success: function (res) {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaa')// success
      },
      fail: function () {
        console.log('失败~')
      }
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

  }
})