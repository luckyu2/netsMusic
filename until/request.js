import config from "./config";
export default(url,data={},method="GET")=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      // url: config.mobileHost + url,  //真机测试用
      // url: config.host + url,
      url: config.mobileHost1 + url, //真机测试用2
      data,
      header:{ //请求头   避免未登录时的cookie为空时出现错误，加上判断cookie是否有值可以解决问题
        Cookie:wx.getStorageSync('cookies')? wx.getStorageSync('cookies').find(item=>(item.indexOf('MUSIC_U') !== -1)):''
      },
      success: (res) => {
        // console.log("请求成功",res)
        if(data.isLogin){ //如果登录请求成功，则保存对应的cookies
          // console.log(res)
          wx.setStorage({   //用同步请求的数据为空，要用异步
            key:'cookies',
            data:res.cookies})
        }
        resolve(res.data)
      },
      fail: (err) => {
        console.log("请求失败",err)
        reject(err)
      }
    })
  })

}