//用户刷新后，获取最新信息
function request(url, method='GET', data={})
{
    return new Promise((resolve,reject) => {
    wx.request({
      url: url,
      header: {
        "Content-Type": "application/json"
      },
      method: method,
      data: data,
      success: function (res) {
        resolve(res.data)

      },
      fail: function (res) {
        console.log('failfailfailfailfailfailfail')
        console.log(res)
        reject(res)
      }

    })
  })
}


function save_userinfo()
{
  wx.login({
    success: res => {
      //获取openid
      if (res.code) {
        var data = {
          code: res.code,
        }
          request('https://www.xianwuzu.cn:443/wx_Code/getOpenId','GET',data = data).then(function (res) {
          var openid = res
          wx.getUserInfo({
            success: res => {
              var userInfo = res.userInfo
              var data = {
                sex: userInfo['gender'],
                nickname: userInfo['nickName'],
                city: userInfo['city'],
                userUrl: userInfo['avatarUrl'],
                openid: openid,
              }
              request('https://www.xianwuzu.cn:443/wx_Code/fresh', "GET", data)
            }
          }
          )
        })
      }
    }
  })

}




module.exports = {
  request: request,
  save_userinfo: save_userinfo
}