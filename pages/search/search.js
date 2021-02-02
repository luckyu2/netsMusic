// pages/search/search.js
import request from "../../until/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchHot:[],   //热榜前20的数据
    searchContent:'',  //输入的内容
    HistorySave:[],  //页面保存的搜索记录
    serchList:[] ,    //模糊搜索获得的关键字列表
    clearShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getsearchHot()

    this.getSearchHistory()
  },
  //获取存储在本地的搜索记录
  getSearchHistory(){
    let HistorySave =wx.getStorageSync('searchHistory')
    if(HistorySave){
      this.setData({
        HistorySave
      })
    }
  },
  //模糊搜索获取服务器的搜索结果
  async getserchKey(serchKeys){
    // if (!this.data.searchContent){
    //   this.setData({
    //     serchList:[]
    //   })
    //  return
    // }
    let serchKeyData= await request('/search',{keywords:serchKeys,limit:10})
    this.setData({
      serchList:serchKeyData.result.songs
    })
    let{HistorySave,searchContent}=this.data
    if(HistorySave.indexOf(searchContent) !== -1){  //判断是否有重名的搜索记录，有就删除
      HistorySave.splice(HistorySave.indexOf(searchContent),1)
    }
    HistorySave.unshift(searchContent)
    this.setData({
      HistorySave
    })
    // 保存数据到本地
    if(HistorySave){
      wx.setStorageSync('searchHistory',HistorySave)
    }

    },
  // 搜索框输入关键字获取
   handKeyword(event) {
     // console.log(event)
     this.setData({
       searchContent: event.detail.value,
       clearShow: true
     })
     this.getserchKey(event.detail.value)
   },
  // 清除搜索框内容
  cancel(){
    if(this.data.searchContent){
    this.setData({
      clearShow: false,
      searchContent:''
    })
      return
    }
  },
  // 清空历史搜索记录
  deleteHistoryList(){
    //提示窗，是否删除
    wx.showModal({
      title:'删除提醒',
      content:'是否清空浏览记录',
      success:(res)=>{
        // console.log(res)
        if(res.confirm){
          this.setData({
            clearShow: false,
            HistorySave:[]
          })
          wx.removeStorageSync('searchHistory')
        }
      }
    })
  },
  //获取热榜前20的数据
  async getsearchHot(){
     let searchHotword= await request('/search/hot/detail')
    let index= 0;
    searchHotword.data.map((item) =>{
      index=index+1
      item.id =index
      return item
    })
      this.setData({
        searchHot:searchHotword.data
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