//当前时间与发布时间的间隔
function time_now_publish(pub_timestamp, timestamp) {

  var span = timestamp - pub_timestamp;
  if(span<0)
  span = -span;
  if (span < 60)
    return span + "秒钟前";
  else if (span < 60 * 60)
    return parseInt(span / 60) + "分钟前";
  else if (span < 60 * 60 * 24)
    return parseInt(span / 3600) + "小时前"
  else
    return parseInt(span / (24 * 3600)) + "天前"
}

//获取所有发布的当前时间与发布时间的间隔
function span_time(publish_info) {
  var timestamp = parseInt(Date.parse(new Date()) / 1000);
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
  console.log(publish_info)
  for (var i = 0; i < publish_info.length; i++) {
    publish_info[i].span_time = time_now_publish(publish_info[i].timestamp, timestamp);
    if (publish_info[i].price == -1) {
      publish_info[i].price = '可商议'
    }
  }
  return publish_info
}


// 时间戳转换成时间格式
function formatDate(date) {

  date = new Date(parseInt(date + '000'));
  console.log(date)
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var h = date.getHours();
  var m1 = date.getMinutes();
  var s = date.getSeconds();
  m = m < 10 ? ("0" + m) : m;
  d = d < 10 ? ("0" + d) : d;
  h = h < 10 ? ('0' + h) : h;
  m1 = m1 < 10 ? ('0' + m1) : m1;
  s = s < 10 ? ('0' + s) : s;
  return y + "-" + m + "-" + d + ' ' + h + ':' + m1 + ':' + s;
}

function is_valid(data,content)
{
  if(!data)
  {
    wx.showModal({
      content: content,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  }
}


module.exports = {
  span_time: span_time,
  formatDate: formatDate,
  time_now_publish: time_now_publish,
  is_valid: is_valid,

}


